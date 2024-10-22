import React, { useState, useEffect } from 'react';
import "./CardForm.css"; // Import the CSS file

const DeleteForm = ({ existingCard = {}, updateCallback }) => {
    const [title, setCardName] = useState(existingCard.title || "")
    const [description, setCardDescription] = useState(existingCard.description || "")

    const onSubmit = async (e) => {
        e.preventDefault()

        console.log("id: " + existingCard.id)
        const url = `http://127.0.0.1:5000/delete_cards/${existingCard.id}`
        const options = {
            method: "DELETE"
        }

        const response = await fetch(url, options)
        if(response.status !== 201 && response.status !== 200) {
            const jsonResponse = await response.json()
            alert(jsonResponse.message)
        }
        else {
            updateCallback()
        }
    }

    return <form onSubmit={onSubmit}>
        <div class="card-modal">
            <label htmlFor="cardName">Card Name: {existingCard.title}</label>
            <label htmlFor="cardDescription">Card Description: {existingCard.description}</label>
        </div>
        <button type="submit">Delete</button>
    </form>

};

export default DeleteForm;
