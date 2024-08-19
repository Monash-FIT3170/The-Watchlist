# For ease, we will download data into a JSON file as opposed to importing it straight into MongoDB
# This will improve performance of the ingestion (as writing takes a decent amount of time)
import json
import os
import requests
import threading
from datetime import datetime
import argparse
from dotenv import load_dotenv
from json_stream.writer import streamable_list 

ROOT_URL = "https://api.themoviedb.org/3"
IMAGE_ROOT = "http://image.tmdb.org/t/p/original"

def make_request(partial_url):
    '''
    Makes a request to the API, handling errors as required and returning a JSON object on success.
    The URL provided should be a partial URL including an initial slash.
    '''

    full_url = ROOT_URL + partial_url

    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {os.environ['THEMOVIEDB_ACCESS_TOKEN']}"
    }

    try:
        response = requests.get(full_url, headers=headers)
        # Throw an error on non-200 status
        response.raise_for_status()

        data = json.loads(response.text)
        return data
    
    except Exception as err:
        print(f"Request to {full_url} failed due to error:")
        print(err)



@streamable_list
def process_movies(data, num_lines):
    '''
    Processes a particular movie from the initial data, yielding the result.
    This approach is used to make the data streamable so that RAM does not get filled.
    '''
    
    i = 0
    # Read each line and parse it as JSON (each line of the file is valid JSON, the entire file is not)
    for movie_line in data:

        if i % 100 == 0:
            print(f"[{i}/{num_lines}]")
        
        i += 1
        initial_data = json.loads(movie_line)
        #print(initial_data)

        movie_data = {
            "id": initial_data.get("id"),
            "title": initial_data.get("original_title"),
            "popularity": initial_data.get("popularity")
        }

        # Retrieve the movie details and artwork via one request using the append_to_response query parameter
        request_url = f"/movie/{initial_data.get('id')}?append_to_response=keywords,credits,images&language=en-US&include_image_language=en,null"

        data = make_request(request_url)
        
        if data is None: continue

        movie_data["release_year"] = datetime.strptime(data.get('release_date'), "%Y-%m-%d").year if data.get("release_date") else None
        movie_data["runtime"] = data.get("runtime")
        movie_data["popularity"] = data.get("popularity")
        movie_data["overview"] = data.get("overview")
        movie_data["language"] = data.get("original_language")
        movie_data["origin_country"] = data.get("origin_country")        
        movie_data["genres"] = [genre["name"] for genre in data.get("genres")] if data.get("genres") else None
        movie_data["keywords"] = [keyword["name"] for keyword in data.get("keywords").get("keywords")] if data.get("keywords") else None


        movie_data["actors"] = [cast["name"] for cast in data.get("credits").get("cast")]
        
        directors = []
        if data.get("credits") is not None:

            for crew in data.get("credits").get("crew"):
                if crew.get("job") == "Director":
                    directors.append(crew.get("name"))

            movie_data["directors"] = directors
        else:
            movie_data["directors"] = None
        
        movie_data["background_url"] = ""
        movie_data["image_url"] = ""

        if data.get("images"):
            images = data.get("images")
            if images.get("backdrops") is not None and len(images.get("backdrops")):
                movie_data["background_url"] = IMAGE_ROOT + images.get("backdrops")[0]["file_path"]
            if images.get("posters") is not None and len(images.get("posters")):
                movie_data["image_url"] = IMAGE_ROOT + images.get("posters")[0]["file_path"]
        
        yield movie_data
        
@streamable_list
def process_tv(data, num_lines):
    current_count = 0
    # Read each line and parse it as JSON (each line of the file is valid JSON, the entire file is not)
    for tv_line in data:

        if current_count % 100 == 0:
            print(f"[{current_count}/{num_lines}]")
        
        current_count += 1
        initial_data = json.loads(tv_line)
        #print(initial_data)

        tv_data = {
            "id": initial_data.get("id"),
            "title": initial_data.get("original_name"),
            "popularity": initial_data.get("popularity")
        }

        # Retrieve the movie details and artwork via one request using the append_to_response query parameter
        request_url = f"/tv/{initial_data.get('id')}?append_to_response=keywords,credits,images&language=en-US&include_image_language=en,null"

        data = make_request(request_url)
        
        if data is None: continue
        
        tv_data["overview"] = data.get("overview")
        
        tv_data["first_aired"] = None
        tv_data["last_aired"] = None
        
        if data.get("first_air_date"):
            tv_data["first_aired"] = { "$date": datetime.strptime(data.get('first_air_date'), "%Y-%m-%d").isoformat() }
        
        if data.get("last_air_date"):
            tv_data["last_aired"] = { "$date": datetime.strptime(data.get('last_air_date'), "%Y-%m-%d").isoformat() }
                
        tv_data["genres"] = [genre["name"] for genre in data.get("genres")] if data.get("genres") else None
        tv_data["language"] = data.get("original_language")
        tv_data["origin_country"] = data.get("origin_country") 
        tv_data["keywords"] = [keyword["name"] for keyword in data.get("keywords").get("results")] if data.get("keywords") else None
        tv_data["actors"] = [cast["name"] for cast in data.get("credits").get("cast")]

        directors = []
        if data.get("credits") is not None:

            for crew in data.get("credits").get("crew"):
                if crew.get("job") == "Director":
                    directors.append(crew.get("name"))

            tv_data["directors"] = directors
        else:
            tv_data["directors"] = None
        
        tv_data["background_url"] = ""
        tv_data["image_url"] = ""

        if data.get("images"):
            images = data.get("images")
            if images.get("backdrops") is not None and len(images.get("backdrops")):
                tv_data["background_url"] = IMAGE_ROOT + images.get("backdrops")[0]["file_path"]
            if images.get("posters") is not None and len(images.get("posters")):
                tv_data["image_url"] = IMAGE_ROOT + images.get("posters")[0]["file_path"]
        
        tv_data["seasons"] = []
        
        number_of_seasons = data.get("number_of_seasons")
        
        season_request_urls = []
        
        if number_of_seasons is not None and number_of_seasons > 0:
            append_to_value = ""
            for i in range(number_of_seasons):
                append_to_value += f"{',' if append_to_value else ''}season/{i+1}"
                
                # Can only do a maximum of 20 additional append_to_response values
                if (i + 1) % 19 == 0:
                    request_url = f"/tv/{initial_data.get('id')}?append_to_response={append_to_value}"
                    season_request_urls.append(request_url)
                    append_to_value = ""
                    
            # Check if we have any extra data
            if append_to_value != "":
                request_url = f"/tv/{initial_data.get('id')}?append_to_response={append_to_value}"
                season_request_urls.append(request_url)
                
        # Then perform all the respective queries
        for url in season_request_urls:
            all_season_data = make_request(url)
            
            if all_season_data is None: continue
            
            for i in range(number_of_seasons):
                output_season = {
                    "season_number": i+1
                }
                
                # Not all seasons are in the dataset
                if f"season/{i+1}" not in all_season_data: continue
                                
                season_data = all_season_data[f"season/{i+1}"]
                
                episodes = []
                
                if season_data.get("episodes") is None: continue
                
                for episode in season_data.get("episodes"):
                    episode_data = {
                        "title": episode.get("name"),
                        "episode_number": episode.get("episode_number"),
                        "runtime": episode.get("runtime")
                    }
                    episodes.append(episode_data)
                
                output_season["episodes"] = episodes
                tv_data["seasons"].append(output_season)
                
        yield tv_data
                
                    
                     
                
            




def process_movie_set(outfile, data, num_line_count):
    movie_output = open(f"{os.getcwd()}/data/{outfile}", "w", encoding="utf8")
    all_data = process_movies(data, num_line_count)
    
    json.dump(all_data, movie_output, indent=4)
    
    movie_output.close()
        


def process_tv_set(outfile, data, num_line_count):
    tv_output = open(f"{os.getcwd()}/data/{outfile}", "w", encoding="utf8")
    all_data = process_tv(data, num_line_count)
    json.dump(all_data, tv_output, indent=4)
    
    tv_output.close()
    
    
def read_file(filename):
    """
    Reads the specified file, returning a tuple containing an array of each line as well as the number of lines in the file.
    """
    with open(filename, "rb") as f:
        num_lines = sum(1 for _ in f)

    with open(filename, encoding='utf8') as f:
        file_lines = [line for line in f]
        
    return (file_lines, num_lines)

def begin_threads(dataset, num_lines, target_func, filename):
    """
    Spawns 40 threads using the specified target and filename. The name will have the file index appended.
    Example target: process_movie_set (function reference)
    Example filename: movie-out
    """
    
    threads = []
    per_thread_count = int(num_lines / 40)
    for i in range(0, 40):
        start_id = int(i * per_thread_count)
        end_id = int(((i+1) * per_thread_count) - 1)
        
        args = (f"{filename}-{i}.json", dataset[start_id:end_id], per_thread_count)

        print(start_id)
        print(end_id)
        t = threading.Thread(target=target_func, args=args)
        threads.append(t)

    for thread in threads:
        thread.start()

    for thread in threads:
        thread.join()
    
    
def begin_movie():
    # Change the filename to process here
    # filename = "movie_ids_07_28_2024.json" # initial dataset
    filename = "missing-data.json" # smaller dataset of movies that got corrupted
    
    (movie_file, num_lines) = read_file(filename)
    
    begin_threads(movie_file, num_lines, target_func=process_movie_set, filename="movie-out")
    
def begin_tv():
    filename = "tv_series_ids_07_28_2024.json"
    
    (tv_file, num_lines) = read_file(filename)
    
    begin_threads(tv_file, num_lines, target_func=process_tv_set, filename="tv-out")
    

if __name__ == "__main__":
    load_dotenv()

    if not os.environ['THEMOVIEDB_ACCESS_TOKEN']:
        print("THEMOVIEDB_ACCESS_TOKEN environment variable is not set. Exiting.")
        os.exit(-1)
        
    parser = argparse.ArgumentParser("data-ingestion")
    parser.add_argument("type", choices=["tv", "movie"])
    args = parser.parse_args()
    
    if args.type == "tv":
        begin_tv()
    else:
        begin_movie()

    #process_all_movies()