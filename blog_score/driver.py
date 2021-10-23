from fetchdata import FetchData

basepath = "./"

#List of all the catgories containing set of fashion attributes inside ther corresponding .json files
lst = ['category', 'collar', 'fabric', 'fabric work','leg', 'length','neck', 'occasion','pattern','sleeve length', 'sleeve style', 'style']

for l in lst:
    fd = FetchData( basepath + "Dict/Required/" + l  + ".json",l)
    fd.store_csv()