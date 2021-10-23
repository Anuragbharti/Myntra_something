#Importing the necessary libraries
import string
from nltk.corpus import stopwords
import numpy as np
import pandas as pd
import json
import re

def preprocessing(text_corpus):
    '''
    Function to perform preprocessing steps on the text corpus.\n
    The steps include:-
    1)Converting every word to lowercase
    2)Discarding stop words and one letter words.
    3)Removing punctuations and symbols

    Parameters:
        text_corpus : string - The raw text corpus

    Returns:
        new_text : string - The modified text_corpus
    '''

    #Load the stopwords from nltk library
    stop_words = stopwords.words('english')

    # Convert all words in lowercase
    text_corpus = text_corpus.lower()

    new_text = ""
    
    #Remove Stop_words and one letter words
    for word in text_corpus.split():
        if ((word not in stop_words) and (len(word)>1)):
            new_text = new_text + " " + word        
    
    #Remove symnols and punctuations
    new_text = re.sub(r'[^\w]', ' ', new_text)

    return new_text

def initialize_df(path_to_json, category):
    '''
    Intializes dataframe to strore the trend scores\n
    Parameters:
        path_to_json: string - Absolute or relative path to the json file which contains the set of fashion attributes of a category in form of dictionary
        category: string - The name of the category(like sleeve, style etc.) in lowercase
    Returns:
        df : pandas.DataFrame - A dataframe with the first column containing the set of fashion attributes of the given category.
    '''
    #Load the json data
    with open(path_to_json) as f:
        data = json.load(f)
    lst = data[category]

    #Converting all the attributes in the set to lowercase
    lst = map(lambda x:x.lower(),lst)

    df = pd.DataFrame(lst,columns = [category])
    
    return df

def eucl_norm(lst):
    '''
    Calculates the euclidean normalisation of a given list\n
    Parameters:
        lst : list - List of numbers
    Returns:
        norm : int - The euclidean normalisation
    '''
    norm = np.linalg.norm(lst)
    return float(norm)

def count_tf_from_text(df,category,text_string):
    '''
    Counts the term frequency/euclidean normalisation for each attribute in the dataframe, and then appends the score as a new column\n
    Parameters:
        df : pandas.DataFrame - The dataframe returned by initialize_df()
        category: string- The name of the category(like sleeve, style etc.) in lowercase
        text_string :string - The text corpus obtained from the blogs, Should pass the preprocessed text string
    Returns:
        void - The datframe passed is modified
    '''
    count = []
    i = 0

    #Count the term frequency
    for word in df[category]:
        count.append(text_string.count(word))
        i = i+1
    
    #Dividing it by euclidean length of the vector
    if (eucl_norm(count) != 0):
        count = [c / eucl_norm(count) for c in count]
    
    #Inserting the blog score for one blog as a column
    df.insert( df.shape[1], "blog" + str(df.shape[1]) ,count, allow_duplicates = True)

