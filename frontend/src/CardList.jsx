import React from "react";
import "./CardList.css"; // Import the CSS file

const CardList = ({ cards, updateCard, deleteCard }) => {

  return (
    <div>
      <div className="card-grid">
        {cards.map((card) => {
          // Convert date string to a Date object
          const date = new Date(card.date_created);
          // Format the date to "DD/MM/YY"
          const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).slice(2)}`;
  
          const free = card.is_free;

          return (

      <div class="card-container">
        <a href="/" class="hero-image-container">
          <img class="hero-image" src={"./images/game.PNG"} alt={card.title}/>
        </a>
        <main class="main-content">
          <h1><a href="#">{card.title}</a></h1>
          <p>{card.description}</p>

          <div class="flex-row">
            <div class="coin-base">
              
          <div className="card-info">
            <p className="card-free" style={{ backgroundColor: free ? '#007bff' : '#dc3545' }}>{free ? 'Free' : 'Paid'}</p>
          </div>

            </div>
            <div class="time-left">
              <img src="https://i.postimg.cc/prpyV4mH/clock-selection-no-bg.png" alt="clock" class="small-image"/>
              <p>{formattedDate}</p>
              
            </div>
            
          </div>
        </main>
        <div class="card-attribute">

          <div className="card-actions">
                  <button onClick={() => updateCard(card)}>Update</button>
                  <button onClick={() => deleteCard(card)}>Delete</button>
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
