import React, { useState, useEffect } from 'react';
import "./CardForm.css"; // Import the CSS file

const CardForm = ({ existingCard = {}, updateCallback }) => {
    const [title, setCardName] = useState(existingCard.title || "");
    const [description, setCardDescription] = useState(existingCard.description || "");
    const [is_free, setCardIsFree] = useState(existingCard.is_free || 0);

    const cardUpdating = Object.entries(existingCard).length !== 0;

    useEffect(() => {
        console.log("is_free:", is_free);
    }, [is_free]); 

    const onSubmit = async (e) => {
        e.preventDefault();
        const free = is_free ? 1 : 0; // Convert boolean value to 1 or 0
        
        const data = {
            title,
            description,
            "is_free": Boolean(free)
        };
        console.log(JSON.stringify(data));
        const url = "http://127.0.0.1:5000/" + (cardUpdating ? `update_cards/${existingCard.id}` : "create_cards");
        const options = {
            method: cardUpdating ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };
        const response = await fetch(url, options);
        if (response.status !== 201 && response.status !== 200) {
            const jsonResponse = await response.json();
            alert(jsonResponse.message);
        } else {
            updateCallback();
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="card-modal">
                <label htmlFor="cardName">Card Name:</label>
                <input 
                    type="text" 
                    id="cardName" 
                    value={title} 
                    onChange={(e) => setCardName(e.target.value)}
                />

                <label htmlFor="cardDescription">Card Description:</label>
                <input 
                    type="text" 
                    id="cardDescription" 
                    value={description} 
                    onChange={(e) => setCardDescription(e.target.value)}
                />

                <label htmlFor="cardIsFree">Card Free:</label>
                <input 
                    type="checkbox" 
                    id="cardIsFree" 
                    checked={is_free} 
                    onChange={(e) => setCardIsFree(e.target.checked)}
                />
            </div>
            <button type="submit">{cardUpdating ? "Update" : "Create"}</button>
        </form>
    );
};

export default CardForm;
