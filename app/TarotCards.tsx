"use client";
import { useState, useEffect } from "react";
import { cards, messages } from "./constants";

type TCard = {
  id: number;
  name: string;
  image: string;
  meaning: string;
  reading: string;
};

export default function TarotCards({ card }: { card?: TCard }): JSX.Element {
  const [drawnCard, setDrawnCard] = useState<TCard | null>(card ?? null);
  const [isFlipped, setIsFlipped] = useState(card ? true : false);
  const [slideOut, setSlideOut] = useState<TCard | null>(card ?? null);
  const [shuffledCards, setShuffledCards] = useState(cards);

  useEffect(
    () => setShuffledCards((prev) => [...prev].sort(() => Math.random() - 0.5)),
    []
  );

  const handleClick = (card: TCard) => {
    if (!drawnCard) {
      localStorage.setItem("card", JSON.stringify(card));

      setSlideOut(card);

      setTimeout(() => {
        setDrawnCard(card);
        setTimeout(() => setIsFlipped(true), 50);
      }, 1000);
    }
  };

  return (
    <div className="tarot-container">
      <h1 className="title">
        {drawnCard ? "The spirits have spoken." : "Choose wisely"}
      </h1>
      <p className="subtitle">The truth stands before you.</p>

      {drawnCard && (
        <>
          <div className={`selected-card ${isFlipped ? "flipped" : ""}`}>
            <div className="card-face card-back"></div>
            <div className="card-face card-front">
              <span>
                <img src={drawnCard.image} alt={drawnCard.name} />
                <p className="meaning">Meaning: {drawnCard.meaning}</p>
              </span>

              <span>
                <p className="left title">{drawnCard.name}</p>
                <p className="left">{drawnCard.reading}</p>
              </span>
            </div>
          </div>
        </>
      )}

      <div className="deck">
        {shuffledCards.map((card, index) => {
          const total = shuffledCards.length;
          const middle = (total - 1) / 2;
          const spreadAngle = 8;

          const rotation = (index - middle) * spreadAngle;

          const distanceFromCenter = Math.abs(index - middle);
          const curveHeight = Math.pow(distanceFromCenter, 2) * 6;

          let className = "card-wrapper";

          if (slideOut && card.id !== slideOut.id) className += " fade-out";

          let styles: React.CSSProperties = {
            transform:
              slideOut && card.id === slideOut.id
                ? "translateY(-20px)"
                : `rotate(${rotation}deg) translateY(${curveHeight}px)`,
          };

          if (slideOut && card.id === slideOut.id)
            styles = { ...styles, transition: "transform 0.8s ease" };

          if (drawnCard && card.id === drawnCard.id)
            styles = {
              ...styles,
              transform: "rotateY(180deg)",
            };

          return (
            <div
              key={card.id}
              className={className}
              style={styles}
              onClick={() => !drawnCard && handleClick(card)}
            >
              <div className="card-face card-back"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
