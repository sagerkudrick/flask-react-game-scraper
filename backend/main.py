from flask import Flask, render_template, url_for, jsonify, request
import requests
from flask_sqlalchemy import SQLAlchemy
from models import Card
from config import app, db
import threading 
import time
from scraper import get_website_contents

@app.route("/cards", methods=["GET"])
def get_cards():
    cards = Card.query.all()
    json_cards = list(map(lambda x: x.to_json(), cards))
    return jsonify({"cards": json_cards})

@app.route("/cards_filtered/<filter_value>", methods=["GET"])
def get_cards_filtered(filter_value):
    is_free = filter_value.lower() == "true"
    cards = Card.query.filter(Card.is_free == is_free).all()
    json_cards = [card.to_json() for card in cards]
    return jsonify({"cards": json_cards})

@app.route("/create_cards", methods=["POST"])
def create_cards():
    title = request.json.get("title")
    description = request.json.get("description")
    date_created = request.json.get("date_created")
    is_free = request.json.get("is_free")

    if not title or not description:
        return (jsonify({"message": "Card title and description required."}), 400)

    # Check if a card with the same title exists
    existing_card = Card.query.filter_by(title=title).first()
    if existing_card:
        return (jsonify({"message": f"Card with title '{title}' already exists."}), 400)

    new_card = Card(title=title, description=description, date_created=date_created, is_free=is_free)
    try:
        db.session.add(new_card)
        db.session.commit()
        return (jsonify({"message": "Card created successfully."}), 201)
    except Exception as e:
        db.session.rollback()  # Rollback changes if an error occurs
        return (jsonify({"message": "Database error has occurred: " + str(e)}), 400)

@app.route("/update_cards/<int:user_id>", methods=["PATCH"])
def update_cards(user_id):
    card = Card.query.get(user_id)

    if not card:
        return (jsonify({"message": "User with that ID not found."}), 404)
    
    data = request.json
    card.title = data.get("title", card.title)
    card.description = data.get("description", card.description)
    card.is_free = data.get("is_free", card.is_free)

    db.session.commit()

    return (jsonify({"message": "Card successfully updated."}), 201)

@app.route("/delete_cards/<int:user_id>", methods=["DELETE"])
def delete_cards(user_id):
    card = Card.query.get(user_id)

    if not card:
        return (jsonify({"message": "User with that ID not found."}), 404)

    db.session.delete(card)
    db.session.commit()

    return (jsonify({"message": "Card successfully deleted."}), 201)

def create_default_data():
    # populate with default data
    first_run = False
    if Card.query.count() == 0:
        first_run = True
        default_data = [
            Card(title='The Legend of Zelda: Breath of the Wild', description='Explore the vast world of Hyrule and uncover its mysteries.'),
            Card(title='Red Dead Redemption 2', description='Immerse yourself in the wild west as Arthur Morgan, an outlaw on the run.'),
            Card(title='The Witcher 3: Wild Hunt', description='Embark on an epic journey as Geralt of Rivia, a monster hunter for hire.'),
            Card(title='Fortnite', description='Join the battle royale and compete to be the last one standing.'),
            Card(title='Minecraft', description='Unleash your creativity in a world of blocks and endless possibilities.'),
            Card(title='Among Us', description='Work together to complete tasks on a spaceship, but watch out for impostors!'),
        ]
        db.session.bulk_save_objects(default_data)
        db.session.commit()

        return first_run

def wait_for_server():
    print("Waiting for Flask server to start...")
    if first_run:
        while True:
            try:
                response = requests.get("http://127.0.0.1:5000/cards")
                if response.status_code == 200:
                    print("Flask server is up and running!")
                    get_website_contents()
                    break
            except requests.exceptions.RequestException:
                pass
            time.sleep(1)

first_run = False
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        first_run = create_default_data()

   # Wait for the server to start in a separate thread
    wait_thread = threading.Thread(target=wait_for_server)
    wait_thread.start()

    app.run(debug=True)


