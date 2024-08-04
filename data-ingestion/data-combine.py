import os
from json_stream.writer import streamable_list
import json_stream
import json

@streamable_list
def read_files():
    for i in range(40):
        print(f"Processing file: {i}")
        try:
            f = open(f"{os.getcwd()}/data/movie-out-{i}.json", encoding="utf8")
            data = json.loads(f.read(), strict=False)
            for obj in data:
                yield obj
        except:
            print("Invalid JSON in file. Skipping.")

def merge_files():
    out_file = open("100000-movies.json", "w")
    json.dump(read_files(), out_file, indent=4)
    out_file.close()
    
    
def check_valid():
    with open("100000-movies.json") as f:
        data = json.loads(f.read())
    
    print("Successfully loaded")

if __name__ == "__main__":
    merge_files()
    check_valid()