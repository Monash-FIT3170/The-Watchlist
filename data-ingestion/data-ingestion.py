# For ease, we will download data into a JSON file as opposed to importing it straight into MongoDB
# This will improve performance of the ingestion (as writing takes a decent amount of time)
import json
import os
import requests
from datetime import datetime
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
def process_movies():
    '''
    Processes a particular movie from the initial data, yielding the result.
    This approach is used to make the data streamable so that RAM does not get filled.
    '''

    with open("movie_ids_07_28_2024.json", "rb") as f:
        num_lines = sum(1 for _ in f)

    movie_file = open("movie_ids_07_28_2024.json", encoding='utf8')

    
    i = 0
    # Read each line and parse it as JSON (each line of the file is valid JSON, the entire file is not)
    for movie_line in movie_file:
        i += 1
        print(f"[{i}/{num_lines}]")
        
        if i < 100: continue
        if i == 300: break
 
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

        movie_data["release_year"] = datetime.strptime(data.get('release_date'), "%Y-%m-%d").year
        movie_data["runtime"] = data.get("runtime")
        movie_data["popularity"] = data.get("popularity")
        movie_data["overview"] = data.get("overview")
        movie_data["language"] = data.get("original_language")
        movie_data["origin_country"] = data.get("origin_country")        
        movie_data["genres"] = [genre["name"] for genre in data.get("genres")]
        movie_data["keywords"] = [keyword["name"] for keyword in data.get("keywords").get("keywords")]

        movie_data["actors"] = [cast["name"] for cast in data.get("credits").get("cast")]
        
        directors = []
        for crew in data.get("credits").get("crew"):
            if crew.get("job") == "Director":
                directors.append(crew.get("name"))

        movie_data["directors"] = directors
        
        movie_data["background_url"] = ""
        movie_data["image_url"] = ""

        if data.get("images"):
            images = data.get("images")
            if images.get("backdrops") is not None and len(images.get("backdrops")):
                movie_data["background_url"] = IMAGE_ROOT + images.get("backdrops")[0]["file_path"]
            if images.get("posters") is not None and len(images.get("posters")):
                movie_data["image_url"] = IMAGE_ROOT + images.get("posters")[0]["file_path"]
        
        yield movie_data
    
    movie_file.close()


def process_all_movies():
    
    movie_output = open("all_movies.json", "w", encoding="utf8")
    all_data = process_movies()
    
    json.dump(all_data, movie_output, indent=4)
    
    movie_output.close()
        


def process_all_tv_shows():
    pass


if __name__ == "__main__":
    load_dotenv()

    if not os.environ['THEMOVIEDB_ACCESS_TOKEN']:
        print("THEMOVIEDB_ACCESS_TOKEN environment variable is not set. Exiting.")
        os.exit(-1)

    process_all_movies()