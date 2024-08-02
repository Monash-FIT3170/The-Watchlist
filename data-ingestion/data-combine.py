import os
from json_stream.writer import streamable_list
import json_stream
import json

@streamable_list
def read_file(filename):
    f = open(filename, encoding="utf8")
    data = json_stream.load(f)
    for obj in data:
        yield obj

def merge_files():
    out_file = open("100000-movies.json", "w")
    for i in range(40):
        json.dump(read_file(f"{os.getcwd()}/data/movie-out-{i}.json"), out_file, indent=4)

    out_file.close()

if __name__ == "__main__":
    merge_files()