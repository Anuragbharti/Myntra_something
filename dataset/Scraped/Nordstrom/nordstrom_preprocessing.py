"""AIM is to complete the preprocessing of Nordstrom to inculude it in database"""
import pandas as pd
import numpy as np
from urllib import parse
import openpyxl

def preprocessing():
  #loading the scraped data of H&M in hm dataFrame
  romper = pd.read_excel (r'./nordstrom_jumpsuits.xlsx')

  #Finding colors from title URL and appending them to the dataFrame
  title_url  = romper['Title_URL']
  size = len(title_url)

  color = [parse.parse_qs(parse.urlsplit(title_url[i]).query)['color'][0] for i in range(size)]

  romper.insert(4, "Color", color)

  #Searching for category match from the provided list of categories and appending it into the dataFrame
  category_list = ["Boilersuit", "Playsuit", "Romper", "Dungarees", "Overalls", "Bodysuit", "Jumpsuit"]
  category = list()
  for title in romper["Title"]:
    flag = 0
    for element in category_list:
      if element.lower() in title.lower():
        category.append(element)
        flag=1
        break
    if flag==0:
      category.append("Jumpsuit")

  romper.insert(4, "Category", category)

  #Fetching pre made list of brands from all 3 websites and searching for matches and appending the brand into dataFrame
  brand = pd.read_excel(r"./../../extras/brand.xlsx")
  add_brand = list()
  titl = list()
  for title in romper['Title']:
    flag=0
    for element in brand["Brand"]:
      if element.lower() in title.lower():
        titl.append(title[len(element)+1:])
        add_brand.append(element)
        flag=1
        break
    if flag==0:
      titl.append(title)
      add_brand.append(np.nan)

  romper = romper.drop(["Title"],axis=1)
  romper.insert(0,"Title",titl)
  romper.insert(5, "Brand", add_brand)

  #Adding Site into the DataFrame
  romper.insert(7, "Site", "Nordstrom")

  #Reading another file from nordstrom for its attributes and description and merging it with the previous dataFrame
  romper2 = pd.read_excel (r'./NordstromJumpsuit2.xlsx')

  final = pd.merge(romper,romper2,on="Title")

  #Dropping the redundant column
  final = final.drop('brand',axis=1)

  #Formatting the Attribute and Description and appending them to the dataFrame
  attr = list()
  desc = list()
  for i in range(final.shape[0]):
    if type(final["details"][i]) != type(np.nan):
      attr.append(final["details"][i].split("\n\n")[2].replace("\n",", "))
      desc.append(final["details"][i].split("\n\n")[1])
    else:
      attr.append(np.nan)
      desc.append(np.nan)

  final = final.drop("details",axis=1)
  final.insert(7,"Attributes",attr)
  final.insert(8, "Description", desc)

  #Removing rows with empty cells of essential columns 
  final = final.dropna(axis=0, subset=["Title","Title_URL","Image","Brand","Attributes","Description"])

  #Saving the DF in excel format
  final.to_excel("./Nordstrom_final.xlsx", index=False)

preprocessing()

