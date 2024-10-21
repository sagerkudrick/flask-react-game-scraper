from config import db
from datetime import datetime

class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    is_free = db.Column(db.Boolean, default=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow())
    
    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "is_free": self.is_free,
            "date_created": self.date_created
        }
    
