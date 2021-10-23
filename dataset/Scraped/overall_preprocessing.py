""" Aim is to concatenate the 3 files"""
import pandas as pd
import openpyxl

def final_preprocessing():

  # Loading the final files from each website 
  df1 = pd.read_excel(r"./ASOS/final_asos.xlsx")
  df2 = pd.read_excel(r"./H&M/complete_hm.xlsx")
  df3 = pd.read_excel(r"./Nordstrom/Nordstrom_final.xlsx")

  #removing "," from price string from Each DataFrame
  price3 = [i[1:].replace(",","") for i in df3["Price"]]
  df3 = df3.drop("Price",axis=1)
  df3.insert(3,"Price",price3)

  price2 = [i[1:].replace(",","") for i in df2["Price"]]
  df2 = df2.drop("Price",axis=1)
  df2.insert(3,"Price",price2)

  price1 = [i[1:].replace(",","") for i in df1["Price"]]
  df1 = df1.drop("Price",axis=1)
  df1.insert(3,"Price",price1)

  #Converting price to float type and changing Dollar to Pound (For Nordstrom Only)
  price = df3["Price"].astype(float)
  for i in range(len(price)):
    price[i] = price[i]*0.77
  df3 = df3.drop("Price",axis=1)
  df3.insert(3,"Price",price)
  price = df2["Price"].astype(float)
  df2 = df2.drop("Price",axis=1)
  df2.insert(3,"Price",price)
  price = df1["Price"].astype(float)
  df1 = df1.drop("Price",axis=1)
  df1.insert(3,"Price",price)

  #Concatinating 3 dataFrames and storing in .json format
  result = pd.concat([df1,df2,df3])
  result.drop_duplicates("Title_URL",keep='first', inplace=True)
  result.to_json("fashion_input.json", orient='records')

final_preprocessing()