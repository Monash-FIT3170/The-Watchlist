import json

def find_missing_ids():
    with open("750k-movies.json") as f:
        data = json.loads(f.read())

    ids = []
    for result in data:
        ids.append(result.get("id"))

    ids = set(ids)

    with open("movie_ids_07_28_2024.json", encoding='utf8') as f:
        total_ids = set([json.loads(line)['id'] for line in f])

    with open("missing-ids.json", "w") as out:
        json.dump(list(total_ids.difference(ids)), out, indent=4)
 
def build_search_json():
    with open("missing-ids.json") as f:
        missing_ids = json.load(f)

    with open("movie_ids_07_28_2024.json", encoding='utf8') as f:
        all_data = [line for line in f]
        
    full_dataset = {}

    resultant_lines = [

    ]

    for line in all_data:
        line_data = json.loads(line)
        full_dataset[line_data["id"]] = line
        
    for missing_id in missing_ids:
        resultant_lines.append(full_dataset[missing_id])

    with open("missing-data.json", "w", encoding='utf8') as out:
        out.writelines(resultant_lines)

if __name__ == "__main__":
    build_search_json()