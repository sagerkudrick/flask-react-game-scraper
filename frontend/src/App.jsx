import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import CardList from './CardList';
import CardForm from './CardForm';
import DeleteForm from './DeleteForm';

function App() {
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState({});
  const [cardFilter, setCardFilter] = useState('');

  useEffect(() => {
    fetchCards();
  }, [cardFilter]);

  const fetchCards = async () => {
    let url = 'http://127.0.0.1:5000/cards';
    if (cardFilter) {
      url = `http://127.0.0.1:5000/cards_filtered/${cardFilter}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    setCards(data.cards);
    console.log(data.cards);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setCurrentCard({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    if (isModalOpen) return;
    setCurrentCard(card);
    setIsModalOpen(true);
  };

  const openDeleteModal = (card) => {
    setCurrentCard(card);
    setIsDeleteModalOpen(true);
  };

  const updateFilter = (filter) => {
    setCardFilter(filter);
  };

  const onUpdate = () => {
      closeModal()
      fetchCards()
    }

  return (
    <>
      <div class="header">
        <div class="header-title">
          <h1>Games</h1>
        </div>
        <div class="header-buttons">
          <button onClick={openCreateModal}>Create New Card</button>
          <button onClick={() => updateFilter("")}>All Cards</button>
          <button onClick={() => updateFilter("true")}>Free Cards</button>
          <button onClick={() => updateFilter("false")}>Paid Cards</button>
        </div>
      </div>
      <div className='card-grid'>
        <CardList cards={cards} updateCard={openEditModal} deleteCard={openDeleteModal} updateCallback={onUpdate} />
      </div>
      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={closeModal}>
              &times;
            </span>
            <CardForm existingCard={currentCard} updateCallback={onUpdate}/>
          </div>
        </div>
      )}
      {isDeleteModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <span className='close' onClick={closeModal}>
              &times;
            </span>
            <DeleteForm existingCard={currentCard} updateCallback={onUpdate}/>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
