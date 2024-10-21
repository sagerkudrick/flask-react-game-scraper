import React from "react";
import "./CardForm.css"; // Import the CSS file

const CardList = ({ cards, updateCard, deleteCard }) => {

  return (
    <div>
      <div className="card-list">
        {cards.map((card) => {
          // Convert date string to a Date object
          const date = new Date(card.date_created);
          // Format the date to "DD/MM/YY"
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(2)}`;
  
          const free = card.is_free;

          return (
            <div key={card.id} className="card-container">
              <img src={"./images/game.PNG"} alt={card.title} className="card-image" />
              <div className="card-content">
                <h2 className="card-title">{card.title}</h2>
                <p className="card-description">{card.description}</p>
                <div className="card-actions">
                  <button onClick={() => updateCard(card)}>Update</button>
                  <button onClick={() => deleteCard(card)}>Delete</button>
                </div>
                <div className="card-info">
                  <p className="card-free" style={{ backgroundColor: free ? '#007bff' : '#dc3545' }}>{free ? 'Free' : 'Paid'}</p>
                  <p className="card-date">{formattedDate}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardList;
