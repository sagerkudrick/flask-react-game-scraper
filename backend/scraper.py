import http.client
import json
from bs4 import BeautifulSoup
from models import Card
import requests

def get_website_contents():
    try:
        website_url = "/"
        conn = http.client.HTTPSConnection("www.epicbundle.com")
        conn.request("GET", website_url)
        response = conn.getresponse()

        if response.status == 200:
            data = response.read()
            soup = BeautifulSoup(data, 'html.parser')
            articles = soup.find_all('article')

            game_data = []
            for article in articles:
                title = article.find('h2', class_='entry-title').a.text.strip()
                description = article.find('div', class_='camya-post-content-excerpt').text.strip()
                is_free = "free" in title.lower()
                game_data.append({"title": title, "description": description, "is_free": is_free})

            if game_data:
                for game in game_data:
                    print("Title:", game["title"])
                    print("Description:", game["description"])
                    print("Is Free:", game["is_free"])
                    print("-" * 50)
                    send_to_api(game)
        else:
            print("Failed to fetch website content. Status code:", response.status)
            return None
        
    except Exception as e:
        print("An error occurred:", e)
        return None

def send_to_api(game):
    try:
        url = "http://127.0.0.1:5000/create_cards"
        free = 1 if bool(game["is_free"]) else 0
        payload = {
            "title": game["title"],
            "description": game["description"],
            "is_free": free
        }
        headers = {
            'Content-Type': 'application/json'
        }
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise an error for HTTP errors
        print(response.text)
    except Exception as e:
        print("Failed to update item: ", e)

if __name__ == "__main__":
    get_website_contents()