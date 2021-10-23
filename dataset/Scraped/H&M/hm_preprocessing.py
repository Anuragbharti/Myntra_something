"""AIM is to complete the preprocessing of H&M to inculude it in database"""
import pandas as pd
import openpyxl

def preprocessing():
  #loading the scraped data of H&M in hm dataFrame
  hm = pd.read_excel(r'./new_H_M.xlsx')
  
  #Remaning a few Labels
  hm.rename(columns = {'swatch':'Color', 'Details':'Attributes',"Image_URL1":"Image"}, inplace = True)

  #Searching for category match from the provided list of categories and appending it into the dataFrame
  category_list = ["Boilersuit", "Playsuit", "Romper", "Dungarees", "Overalls", "Bodysuit", "Jumpsuit"]
  category = list()
  for title in hm["Title"]:
    flag = 0
    for element in category_list:
      if element.lower() in title.lower():
        category.append(element)
        flag=1
        break
    if flag==0:
      category.append("Jumpsuit")
  hm.insert(3,'Category',category)
  #Appending the site column into the dataFrame
  hm.insert(4,'Brand','H&M')

  #H&M has well formatted data taking advantage of keywords and making a list of all the following categories mentioned in attr_type appending them if they are found right after the selected keyword and before the next of that keyword
  attr_types = ['Length','Sleeve Length','Collar','Style','Neckline','Sleeve Style','Composition','Care instructions','Description','Concept','Collection','Nice to know','Art. No.']

  Length = list()
  Sleeve_Length = list()
  Collar = list()
  Style = list()
  Neckline = list()
  Sleeve_Style = list()
  Composition = list()
  Care_instructions = list()
  Description = list()
  Concept = list()
  product = list()

  #Creating a list of all the given categories
  for i in range(hm.shape[0]):
    attr = list()
    word = hm['Attributes'][i]
    start_idx = 0
    end_idx = 0
    if word[start_idx:6] == 'Length':
      for j in range(1,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Length.append(word[6:index].strip())
      attr.append(word[6:index].strip())
    
    if word.find(attr_types[1]) != -1:
      start_idx = word.find(attr_types[1])
      end_idx = len(attr_types[1]) + start_idx
      for j in range(2,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Sleeve_Length.append(word[end_idx:start_idx].strip())
      attr.append(word[end_idx:start_idx].strip())

    if word.find(attr_types[2]) != -1:
      start_idx = word.find(attr_types[2])
      end_idx = len(attr_types[2]) + start_idx
      for j in range(3,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Collar.append(word[end_idx:start_idx].strip())
      attr.append(word[end_idx:start_idx].strip())

    if word.find(attr_types[3]) != -1:
      start_idx = word.find(attr_types[3])
      end_idx = len(attr_types[3]) + start_idx
      for j in range(4,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Style.append(word[end_idx:start_idx].strip())
      attr.append(word[end_idx:start_idx].strip())

    if word.find(attr_types[4]) != -1:
      start_idx = word.find(attr_types[4])
      end_idx = len(attr_types[4]) + start_idx
      for j in range(5,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Neckline.append(word[end_idx:start_idx].strip())
      attr.append(word[end_idx:start_idx].strip())

    if word.find(attr_types[5]) != -1:
      start_idx = word.find(attr_types[5])
      end_idx = len(attr_types[5]) + start_idx
      for j in range(6,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Sleeve_Style.append(word[end_idx:start_idx].strip())
      attr.append(word[end_idx:start_idx].strip())

    if word.find(attr_types[6]) != -1:
      start_idx = word.find(attr_types[6])
      end_idx = len(attr_types[6]) + start_idx
      for j in range(7,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Composition.append(word[end_idx:start_idx].strip())
      attr.append(word[end_idx:start_idx].strip())

    if word.find(attr_types[7]) != -1:
      start_idx = word.find(attr_types[7])
      end_idx = len(attr_types[7]) + start_idx
      for j in range(8,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Care_instructions.append(word[end_idx:start_idx].strip())
      attr.append(word[end_idx:start_idx].strip())

    if word.find(attr_types[8]) != -1:
      start_idx = word.find(attr_types[8])
      end_idx = len(attr_types[8]) + start_idx
      for j in range(9,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Description.append(word[end_idx:start_idx].strip())
      attr.append(word[end_idx:start_idx].strip())

    if word.find(attr_types[9]) != -1:
      start_idx = word.find(attr_types[9])
      end_idx = len(attr_types[9]) + start_idx
      for j in range(10,len(attr_types)):
        index = word.find(attr_types[j])
        if index != -1:
          start_idx = index
          break
      Concept.append(word[end_idx:start_idx].strip())
      attr.append(word[end_idx:start_idx].strip())
    #Appending the long list in attributes
    #Benefits are removing the keyword getting a list essential for prediction of each product
    product.append(attr)
  attribute = [", ".join(product[i]).replace("\n",", ") for i in range(hm.shape[0])]

  hm = hm.drop('Attributes',axis=1)
  hm.insert(6,'Attributes',attribute)

  #Changing the column number of Image
  image = hm["Image"]
  hm = hm.drop("Image",axis=1)
  hm.insert(2,"Image",image)
  #Appending Site to the dataFrame
  hm.insert(9,"Site","H&M")

  #Removing rows with empty cells of essential columns
  hm = hm.dropna(axis=0, subset=["Title","Title_URL","Image","Brand","Attributes","Description"])

  #Saving into an excel file
  hm.to_excel('./complete_hm.xlsx',index = False)

preprocessing()
