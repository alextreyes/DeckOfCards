import React, { useState, useEffect } from "react";
import axios from "axios";

const DeckOfCards = () => {
  const [deckId, setDeckId] = useState(null);
  const [card, setCard] = useState(null);
  const [remaining, setRemaining] = useState(52);
  const [isShuffling, setIsShuffling] = useState(false);
  const [error, setError] = useState(null);

  // Fetch a new deck when the component mounts
  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await axios.get(
          "https://deckofcardsapi.com/api/deck/new/shuffle/"
        );
        setDeckId(response.data.deck_id);
      } catch (error) {
        setError("Failed to load deck");
      }
    };
    fetchDeck();
  }, []);

  // Function to draw a card
  const drawCard = async () => {
    if (remaining === 0) {
      alert("Error: no cards remaining!");
      return;
    }

    try {
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`
      );
      if (response.data.success) {
        const cardData = response.data.cards[0];
        setCard(cardData);
        setRemaining(response.data.remaining);
      }
    } catch (error) {
      setError("Error drawing card");
    }
  };

  // Function to shuffle the deck
  const shuffleDeck = async () => {
    setIsShuffling(true); // Disable shuffle button while shuffling
    setCard(null); // Clear the drawn card from the screen
    try {
      const response = await axios.get(
        `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
      );
      if (response.data.success) {
        setRemaining(52); // Reset the number of cards in the deck
      }
    } catch (error) {
      setError("Error shuffling deck");
    } finally {
      setIsShuffling(false); // Enable shuffle button after shuffle completes
    }
  };

  return (
    <div>
      <h1>Deck of Cards</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {card && (
        <div>
          <h2>
            {card.value} of {card.suit}
          </h2>
          <img src={card.image} alt={`${card.value} of ${card.suit}`} />
        </div>
      )}
      <p>Remaining cards: {remaining}</p>

      <button onClick={drawCard} disabled={isShuffling}>
        Draw a Card
      </button>
      <button onClick={shuffleDeck} disabled={isShuffling}>
        Shuffle Deck
      </button>

      {isShuffling && <p>Shuffling...</p>}
    </div>
  );
};

export default DeckOfCards;
