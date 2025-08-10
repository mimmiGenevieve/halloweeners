"use client";
import { useState, useEffect } from "react";
import { cards } from "./constants";

type TCard = {
  id: number;
  name: string;
  image: string;
  meaning: string;
  reading: string;
};

export default function TarotCards(): JSX.Element {
  const [drawnCard, setDrawnCard] = useState<TCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const [shuffledCards, setShuffledCards] = useState(cards);

  useEffect(
    () => setShuffledCards((prev) => [...prev].sort(() => Math.random() - 0.5)),
    []
  );

  const handleClick = (card: TCard) => {
    if (!drawnCard) {
      setDrawnCard(card);

      setTimeout(() => setIsFlipped(true), 500);
    }
  };

  return (
    <div className="tarot-container">
      <h1 className="title">
        {drawnCard ? "The spirits have spoken." : "Choose wisely"}
      </h1>
      <p className="subtitle">The truth stands before you.</p>
      <div className="deck">
        {shuffledCards.map((card) => (
          <div
            key={card.id}
            className={`card-wrapper ${
              drawnCard
                ? drawnCard.id !== card.id
                  ? "fade-out"
                  : "selected"
                : ""
            } 
            ${
              drawnCard && drawnCard.id === card.id && isFlipped
                ? "flipped"
                : ""
            }
            `}
            onClick={() => handleClick(card)}
          >
            <div className="card-face card-back"></div>
            <div className="card-face card-front">
              <img src={card.image} alt={card.name} />
              <p className="meaning">Meaning: {card.meaning}</p>
              <p>{card.reading}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
