from pymongo import MongoClient
import pymongo
from bson import ObjectId

# from pprint import pprint
import sys
CONNECTION_STRING = "mongodb+srv://vandit-admin:1234@cluster0.3wvtg.mongodb.net/xbook?authSource=admin&replicaSet=atlas-uj7g6h-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true"
client = MongoClient(CONNECTION_STRING)

db=client['myFirstDatabase']

books = db['book1']


mydb, mydb_name, instance_col = client, db, books
# make an API call to the MongoDB server
cursor = instance_col.find()
# extract the list of documents from cursor obj
mongo_df = list(cursor)

import pandas
# create an empty DataFrame for storing documents
df = pandas.DataFrame(columns=[])

# iterate over the list of MongoDB dict documents
for num, doc in enumerate(mongo_df):
    # convert ObjectId() to str
    doc["_id"] = str(doc["_id"])
    # get document _id from dict
    doc_id = doc["_id"]
    # create a Series obj from the MongoDB dict
    series_obj = pandas.Series( doc, name=doc_id )
        # append the MongoDB Series obj to the DataFrame obj
    df = df.append(series_obj)
    # get document _id from dict
    doc_id = doc["_id"]

import sys
Title=sys.argv[1]

#Validation of variables
index=df.loc[df._id==Title].index[0]
#print(df['selectedFile'][index])

import numpy as np 
import pandas as pd
import matplotlib.pyplot as plt
import os
import requests
import cv2
import pytesseract as pt
pt.pytesseract.tesseract_cmd=r'C:\Program Files\Tesseract-OCR\tesseract.exe'
import keras_ocr
pipeline = keras_ocr.pipeline.Pipeline()

url = df['selectedFile'][index]
imagetext = []
images = [
  keras_ocr.tools.read(url) for url in [
      url
  ]
]
prediction_groups = pipeline.recognize(images)
predicted_image_1 = prediction_groups[0]

for text, box in predicted_image_1:
    text = text.lower()
    imagetext.append(text)

    #print(text)
#print(imagetext)

bookname = df['bookName'][index]
bookname = bookname.lower()
author = df['author'][index]
booknamelist = bookname.split() 
#print(booknamelist)
counter = 0
check = all(item in imagetext for item in booknamelist)
booknamelength = len(booknamelist)
for item in booknamelist:
      if item in imagetext:
            #print("item",item)
            counter+=1

#print("counter", counter)
if counter>=2:
    books.update_one({"_id":ObjectId(Title)},{"$set":{"legitacy":"legit"}})
    #print("yooooooooooooooooooo")
else:
    books.update_one({"_id":ObjectId(Title)},{"$set":{"legitacy":"notlegit"}})
    #print("nooooooooooo")

from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

columns=['subject','publisher','author','semester']
df = df.dropna(subset=['subject','publisher','author','semester'])

df.reset_index(inplace = True)


def combine_feature(data):
      feature=[]
      for i in range(0,data.shape[0]):
        try:
            feature.append(data['subject'][i]+' '+data['publisher'][i]+' '+data['author'][i]+' '+data['semester'][i])
        except:
            pass
      return feature

df['combined']=combine_feature(df)

cm=CountVectorizer().fit_transform(df['combined'])

#Creating Cosine Similarity Matrix
cs=cosine_similarity(cm)
# Title='Engineering Drawing'

unique_id = Title
# print(unique_id)
book_id=df.loc[df._id==Title].index[0]
#print(book_id)
scores=list(enumerate(cs[book_id]))

sorted_scores=sorted(scores,key=lambda x:x[1],reverse=True)
# print(sorted_scores)
j=0
book_title=[]
pub=[]
sem=[]
author=[]
ids=''
final_obj={}
for item in sorted_scores:
  if df['_id'][item[0]]==unique_id:
        continue
  try:
    book_title.append(df['bookName'][item[0]])
    pub.append(df['publisher'][item[0]])
    sem.append(df['semester'][item[0]])
    author.append(df['author'][item[0]])
    
    ids+=df['_id'][item[0]]+','

    
  except:
    pass
  
  j=j+1
  if j>=5:
    break

print(ids) # stores id of 5 most similar books


