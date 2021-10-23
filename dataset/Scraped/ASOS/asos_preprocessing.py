"""AIM is to complete the preprocessing of ASOS to inculude it in database"""
import pandas as pd
import numpy as np
import re
import openpyxl

def preprocessing():
  #Enter the 2 files you want to merge
	df1 = pd.read_excel(r'./Jumpsuits_ASOS_full2.xlsx')
	df2 = pd.read_excel(r'./Jumpsuits_ASOS_images.xlsx')

	# merging them on "Title_URL"
  asos = pd.merge(df1, df2, on='Title_URL')
  
  #reading the Combined file of ASOS
  #asos = pd.read_excel('./Jumpsuits_ASOS_complete.xlsx')
  
  #Removing useless labels
  asos = asos.drop(labels=["Image_URL","name"],axis=1)
  
  #Remaning a few Labels
  asos.rename(columns = {'fabric':'Description', 'detail':'Attributes', 'price':"Price"}, inplace = True)

  #Searching for "image url" from "Image_x" and "Image_y" and storing in form of list
  image = list()
  for i in range(asos.shape[0]):
    if type(asos["Image_x"][i]) != type(np.nan):
      image.append(asos["Image_x"][i])
    elif type(asos["Image_y"][i]) != type(np.nan):
      image.append(asos["Image_y"][i])
    else:
      image.append(np.nan)
  asos = asos.drop(["Image_x","Image_y"],axis=1)
  asos.insert(2,"Image",image)

  #Fetching pre made list of brands from all 3 websites and searching for matches
  brand = pd.read_excel(r"./../../extras/brand.xlsx")
  add_brand = list()
  for title in asos['Attributes']:
    flag=0
    if type(title) != type(np.nan):
      for element in brand["Brand"]:
        if element.lower() in title.lower():
          add_brand.append(element)
          flag=1
          break
      if flag==0:
        add_brand.append(np.nan)
    else:
      add_brand.append(np.nan)

  #Appending brand into the DataFrame
  asos.insert(4,"Brand",add_brand)

  #Searching for category match from the provided list of categories
  category_list = ["Boilersuit", "Playsuit", "Romper", "Dungarees", "Overalls", "Bodysuit", "Jumpsuit"]
  category = list()
  for title in asos["Attributes"]:
    flag = 0
    if type(title) != type(np.nan):
      for element in category_list:
        if element.lower() in title.lower():
          category.append(element)
          flag=1
          break
      if flag==0:
        category.append("Jumpsuit")
    else:
      category.append(np.nan)

  #Appending Category and Website into the dataFrame
  asos.insert(4,"Category",category)
  asos.insert(8,"Site","ASOS")

  #Extracting Color information from url of image
  color = list()
  size = len(image)
  for i in range(size):
    if type(asos["Image"][i]) != type(np.nan):
      color.append(image[i].split("?")[0].split("-")[-1])
    else:
      color.append(np.nan)

  #Appending color to dataFrame
  asos.insert(6,"Color", color)

  #Processing the Attribute column by seperating the joined words and removing extra spaces
  attribute = list()
  for i in range(len(asos["Attributes"])):
    if type(asos["Attributes"][i]) != type(np.nan):
      attribute.append(asos["Attributes"][i][15:].strip())
    else:
      attribute.append(np.nan)
  
  pattern = ".[a-z][A-Z]."
  new_attr = list()

  for i in range(len(attribute)):
    if type(attribute[i]) != type(np.nan):
      temp = re.sub('\s\s+','/',attribute[i])
      idx = [m.start(0) for m in re.finditer(pattern, temp)]
      if len(idx) == 1:
        attr = str(temp[:idx[0]+2] + "/" + temp[idx[0]+2:]).split("/")
      elif len(idx) > 1:
        new_str = temp[:idx[0]+2]
        for k in range(len(idx)-1):
          new_str = new_str + "/" + temp[idx[k]+2:idx[k+1]+2]
        attr = str(new_str + "/" + temp[idx[k+1]+2:]).split("/")
      else:
        attr = temp.split("/")
      new_attr.append(", ".join(attr))
    else:
      new_attr.append(np.nan)

  #Dropping previous Attributes and adding the new ones to dataFrame
  asos = asos.drop("Attributes",axis=1)
  asos.insert(7,"Attributes",new_attr)

  #Processing the Description column by seperating the joined words and removing extra spaces
  desc = asos["Description"]
  pattern = ".[a-z][A-Z]."
  new_desc = list()
  for i in range(len(desc)):
    if type(desc[i]) != type(np.nan):
      temp = desc[i][8:].strip()
      idx = [m.start(0) for m in re.finditer(pattern, temp)]
      if len(idx) == 1:
        new_desc.append(temp[:idx[0]+2] + ", " + temp[idx[0]+2:])
      elif len(idx) > 1:
        new_str = temp[:idx[0]+2]
        for k in range(len(idx)-1):
          new_str = new_str + ", " + temp[idx[k]+2:idx[k+1]+2]
        new_desc.append(new_str + ", " + temp[idx[k+1]+2:])
      else:
        new_desc.append(temp)
    else:
      new_desc.append(np.nan)

  #Dropping previous Descrition and adding the new ones to dataFrame
  asos = asos.drop('Description',axis=1)
  asos.insert(8,'Description',new_desc)

  #As the colors from the url are joined, they are seperated using a pre made AsosColors list and appended into the dataFrame
  col = pd.read_excel(r'./../../extras/AsosColors.xlsx')

  color = asos["Color"]
  c = list()
  for i in range(len(color)):
    flag=0
    for colo in col["Color"]:
      if "".join(colo.split()).lower() == color[i]:
        c.append(colo)
        flag=1
        break
    if flag==0:
      c.append(np.nan)

  asos = asos.drop('Color',axis=1)
  asos.insert(6,'Color',c)

  #Removing all the empty cells of essential columns
  asos = asos.dropna(axis=0, subset=["Title","Title_URL","Image","Color","Brand","Attributes","Description"])

  #Saving the dataFrame in excel format
  asos.to_excel("final_asos.xlsx",index=False)

preprocessing()