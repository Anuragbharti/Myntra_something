"""Function to reverse sort the list of json on the basis of length"""
import json
def reverse_sort():
    #Enter the file path you want to access
    sing_score = json.load(open("./extras/single.json")
    new_scores = {}
    for k in sorted(sing_score, key=len, reverse=True):
    new_scores[k] = sing_score[k]
    #Enter the location where you want to dump the data
    json.dump(new_scores,open("./extras/rev_single.json",'w'))

reverse_sort()