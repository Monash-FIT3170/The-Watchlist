import os
from json_stream.writer import streamable_list
import json_stream
import json

@streamable_list
def read_files():
    for i in range(40):
        print(f"Processing file: {i}")
        try:
            f = open(f"{os.getcwd()}/data/tv-out-{i}.json", encoding="utf8")
            data = json.loads(f.read(), strict=False)
            for obj in data:
                yield obj
        except:
            print("Invalid JSON in file. Skipping.")

@streamable_list
def merge_two():
    f = open("750k-movies.json", encoding="utf8")
    data = json.loads(f.read(), strict=False)
    for obj in data:
        yield obj
    
    f.close()

    f = open("extra-movies.json", encoding="utf8")
    data = json.loads(f.read(), strict=False)
    for obj in data:
        yield obj

    f.close()

def merge_all_files():
    out_file = open("complete-tv.json", "w")
    json.dump(read_files(), out_file, indent=4)
    out_file.close()
    
def merge_two_files():
    out_file = open("complete-movies.json", "w")
    json.dump(merge_two(), out_file, indent=4)
    out_file.close()
    
def check_valid():
    with open("complete-tv.json") as f:
        data = json.loads(f.read())
    
    print("Successfully loaded")

if __name__ == "__main__":
    merge_all_files()
    #merge_two_files()
    check_valid()