#Importing necessary classes and function
from scraper import voguescraper,cosmoscraper
from utils import initialize_df,preprocessing, count_tf_from_text
import pandas as pd

basepath = "./"

#Class to fetch data from blogs, count the blog score and save it as csv
class FetchData:
    
    def __init__(self,path_to_json,category):
        '''
        Initialize the class with attributes path_to_json and category\n
        Parameters:
            path_to_json: string - Absolute or relative path to the json file which contains the set of fashion attributes of a category in form of dictionary
            category: string - The name of the category(like sleeve, style etc.) in lowercase
        '''
        self.path_to_json = path_to_json
        self.category = category
        
        
    def fetch_vogue(self):
        '''
        End to end function to fetch data from vogue sitemap all the way to counting blog score from each blog, storing it in a dataframe and calculating
        the sum across all the blogs.
        Returns:
            df : pandas.DataFrame - Dataframe containing each fashion attribute in the set self.category and their corresponding total blog score 
        '''
       # Fetch all URLS from the vogue sitemap
        scraper = voguescraper
        urls = scraper.get_urls(scraper) 
        
        #Get the text corpus from all the blogs in URLs
        corpus = []
        for url in urls:
            try:
                txt = scraper.get_txt_from_blog(scraper,url)
            except:
                pass
            else:
                corpus.append(txt)
                
        #Initializing the dataframe for self.category
        df = initialize_df(self.path_to_json, self.category)

        #Get the normalized word frequency
        for text_string in corpus:
            count_tf_from_text(df,self.category ,preprocessing(text_string))

        #Store the sum of the blog score
        df["vogue"] = df.sum(axis=1)

        #Drop all the columns containing individual blog score
        for column in df.columns:
            if (column[-1].isdigit()):
                df = df.drop(column,axis = 1) 

        return df

    def fetch_cosmo(self):
        '''
        End to end function to fetch data from cosmopolitan sitemap all the way to counting blog score from each blog, storing it in a dataframe and calculating
        the sum across all the blogs.
        Returns:
            df : pandas.DataFrame - Dataframe containing each fashion attribute in the set self.category and their corresponding total blog score 
        '''
    # Fetch all URLS from the cosmo sitemap
        scraper = cosmoscraper
        urls = scraper.get_urls(scraper) 

        #Get the corpus of all the blogs in URLs
        corpus = []
        for url in urls:
            try:
                txt = scraper.get_txt_from_blog(scraper,url)
            except:
                pass
            else:
                corpus.append(txt)
        
        #Initializing the dataframe for self.category
        df = initialize_df(self.path_to_json, self.category)

        #Get the normalized word frequency
        for text_string in corpus:
            count_tf_from_text(df,self.category ,preprocessing(text_string))

        #Store the sum of the blog score
        df["cosmo"] = df.sum(axis=1)

        #Drop all the columns containing individual blog score
        for column in df.columns:
            if (column[-1].isdigit()):
                df = df.drop(column,axis = 1) 

        return df
    
    def store_csv(self):
        '''
        Function to get the blog score for each attribute in the set self.category, from vogue and cosmo websites and storing it as CSV files
        '''
        df1 = self.fetch_vogue()
        df2= self.fetch_cosmo()
        df = pd.merge(df1, df2, on = self.category)
        df["sum"] = df.sum(axis=1)
        df = df.drop(['vogue','cosmo'],axis = 1)
        df.to_csv(basepath + "score/" + self.category + ".csv" , index = False)
        print("Stored" + self.category + " blogscore at: " + "./blog_score/" + self.category + ".csv")
        