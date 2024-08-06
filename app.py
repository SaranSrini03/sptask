import pandas as pd
from flask import Flask, request, jsonify
from transformers import pipeline
import requests
from bs4 import BeautifulSoup
import urllib.parse
from flask_cors import CORS
import logging
import time
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from collections import Counter
import nltk
from flask_caching import Cache
import re
from werkzeug.urls import url_parse

nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)
CORS(app)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

pipe = pipeline("text-classification", model="ProsusAI/finbert")

# Load the company details CSV file
company_df = pd.read_excel('company.xlsx')

def analyze_sentiment(text):
    """
    Analyze the sentiment of the given text.
    
    Args:
        text (str): The text to analyze.
    
    Returns:
        tuple: A tuple containing lists of sentiments and confidences.
    """
    result = pipe(text, top_k=3)  # Get top 3 sentiments
    sentiments = [r['label'] for r in result]
    confidences = [r['score'] for r in result]
    return sentiments, confidences

@cache.memoize(timeout=300)  # Cache for 5 minutes
def get_google_news(query, num_articles=6):
    """
    Fetch news articles from Google News for the given query.
    
    Args:
        query (str): The search query.
        num_articles (int): The number of articles to fetch.
    
    Returns:
        list: A list of dictionaries containing news article details.
    """
    encoded_query = urllib.parse.quote(query)
    url = f'https://news.google.com/rss/search?q={encoded_query}'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, features='xml')
    items = soup.findAll('item')
    news_items = []
    for item in items[:num_articles]:
        news = {
            'title': item.title.text,
            'link': item.link.text,
            'pub_date': item.pubDate.text,
            'description': item.description.text
        }
        news_items.append(news)
    return news_items

def extract_keywords(text, num_keywords=5):
    """
    Extract the most common keywords from the given text.
    
    Args:
        text (str): The text to extract keywords from.
        num_keywords (int): The number of keywords to extract.
    
    Returns:
        list: A list of the most common keywords.
    """
    words = word_tokenize(text.lower())
    stop_words = set(stopwords.words('english'))
    words = [word for word in words if word.isalnum() and word not in stop_words]
    word_freq = Counter(words)
    return [word for word, _ in word_freq.most_common(num_keywords)]

def validate_url(url):
    """
    Validate the given URL.
    
    Args:
        url (str): The URL to validate.
    
    Returns:
        bool: True if the URL is valid, False otherwise.
    """
    parsed = url_parse(url)
    return bool(parsed.scheme and parsed.netloc)

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Analyze the sentiment of the given text, URL, or news query.
    """
    data = request.json
    text = data.get('text')
    url = data.get('url')
    news_query = data.get('news_query')

    logger.info(f'Received request: text={text}, url={url}, news_query={news_query}')

    try:
        if text:
            # Sanitize input
            text = re.sub(r'[^\w\s]', '', text)
            sentiments, confidences = analyze_sentiment(text)
            keywords = extract_keywords(text)
            response = {
                'sentiments': sentiments,
                'confidences': confidences,
                'keywords': keywords
            }
        elif url:
            if not validate_url(url):
                return jsonify({'error': 'Invalid URL'}), 400
            page_response = requests.get(url)
            soup = BeautifulSoup(page_response.content, 'html.parser')
            headline = soup.find('h1').get_text() if soup.find('h1') else "No headline found"
            description = soup.find('p').get_text() if soup.find('p') else "No description found"
            sentiments, confidences = analyze_sentiment(description)
            keywords = extract_keywords(description)
            response = {
                'headline': headline,
                'description': description,
                'sentiments': sentiments,
                'confidences': confidences,
                'keywords': keywords
            }
        elif news_query:
            # Sanitize input
            news_query = re.sub(r'[^\w\s]', '', news_query)
            news_items = get_google_news(news_query)
            analyzed_items = []
            for item in news_items:
                sentiments, confidences = analyze_sentiment(item['description'])
                keywords = extract_keywords(item['description'])
                item['sentiments'] = sentiments
                item['confidences'] = confidences
                item['keywords'] = keywords
                analyzed_items.append(item)
            response = analyzed_items
        else:
            return jsonify({'error': 'No input provided'}), 400

        logger.info(f'Response: {response}')
        return jsonify(response)
    except Exception as e:
        logger.error(f'Error: {str(e)}')
        return jsonify({'error': 'An unexpected error occurred. Please try again later.'}), 500

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    """
    Provide autocomplete suggestions for company names.
    """
    query = request.args.get('query', '').lower()
    suggestions = company_df[company_df['NAME OF COMPANY'].str.lower().str.startswith(query)]['NAME OF COMPANY'].tolist()
    return jsonify(suggestions[:10])  # Limit to 10 suggestions

@app.route('/related_news', methods=['GET'])
def related_news():
    """
    Fetch and analyze related news articles for the given query.
    """
    query = request.args.get('query', '')
    # Sanitize input
    query = re.sub(r'[^\w\s]', '', query)
    news_items = get_google_news(query, num_articles=3)
    for item in news_items:
        sentiments, confidences = analyze_sentiment(item['description'])
        keywords = extract_keywords(item['description'])
        item['sentiments'] = sentiments
        item['confidences'] = confidences
        item['keywords'] = keywords
    return jsonify(news_items)

if __name__ == '__main__':
    app.run(debug=True)