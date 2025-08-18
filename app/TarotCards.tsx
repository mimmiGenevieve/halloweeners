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

export default function TarotCards({ card }: { card?: TCard }): JSX.Element {
  const [drawnCard, setDrawnCard] = useState<TCard | null>(card ?? null);
  const [isFlipped, setIsFlipped] = useState(!!card);
  const [slideOut, setSlideOut] = useState<TCard | null>(card ?? null);
  const [shuffledCards, setShuffledCards] = useState<TCard[]>(cards);
  const [flipImage, setFlipImage] = useState(false);

  // Shuffle deck on mount
  useEffect(() => {
    setShuffledCards((prev) => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  const handleClick = (card: TCard) => {
    if (drawnCard) return;

    localStorage.setItem("card", JSON.stringify(card));
    setSlideOut(card);

    // Animate: slide → reveal → flip
    setTimeout(() => {
      setDrawnCard(card);
      setTimeout(() => setIsFlipped(true), 50);
    }, 1000);
  };

  // Renders a spread of cards (desktop version)
  const renderSpread = (
    cards: TCard[],
    total: number,
    spreadAngle: number,
    isSmall = false
  ) =>
    cards.map((card, index) => {
      const middle = (total - 1) / 2;
      const rotation = (index - middle) * spreadAngle;
      const distance = Math.abs(index - middle);
      const curveHeight = Math.pow(distance, 2) * 6;

      let className = `card-wrapper${isSmall ? " small" : ""}`;
      if (slideOut && card.id !== slideOut.id) className += " fade-out";

      let styles: React.CSSProperties = {
        transform:
          slideOut && card.id === slideOut.id
            ? `translateY(-20px)${isSmall ? " scale(0.7)" : ""}`
            : `rotate(${rotation}deg) translateY(${curveHeight}px)`,
      };

      if (slideOut && card.id === slideOut.id) {
        className += " hide";
        styles.transition = "transform 0.8s ease";
      }

      if (drawnCard && card.id === drawnCard.id) {
        styles.transform = `rotateY(180deg)${isSmall ? " scale(0.7)" : ""}`;
      }

      return (
        <div
          key={card.id}
          className={className}
          style={styles}
          onClick={() => handleClick(card)}
        >
          <div className="card-face card-back"></div>
        </div>
      );
    });

  return (
    <div className="tarot-container">
      <h1 className="title">
        {drawnCard ? "The spirits have spoken." : "Choose wisely"}
      </h1>
      <p className="subtitle">The truth stands before you.</p>

      {drawnCard && (
        <div className={`selected-card ${isFlipped ? "flipped" : ""}`}>
          <div className="card-face card-back" />
          <div
            className="card-face card-front"
            onClick={() => setFlipImage(!flipImage)}
          >
            <div className={`images${flipImage ? " flipped" : ""}`}>
              <div className="front">
                <img src={drawnCard.image} alt={drawnCard.name} />
                <p className="meaning">Meaning: {drawnCard.meaning}</p>
              </div>
              <div className="back">
                <p className="meaning">Rejoice!</p>
              </div>
            </div>

            <div>
              <p className="left title">{drawnCard.name}</p>
              <p className="left">{drawnCard.reading}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile deck */}
      <div className={`deck mobile${drawnCard ? " hide" : ""}`}>
        {shuffledCards.map((card) => {
          let className = "card-wrapper";
          if (slideOut && card.id !== slideOut.id) className += " fade-out";
          if (slideOut && card.id === slideOut.id) className += " hide";

          return (
            <div
              key={card.id}
              className={className}
              onClick={() => handleClick(card)}
            >
              <div className="card-face card-back"></div>
            </div>
          );
        })}
      </div>

      {/* Desktop spreads */}
      <div className="deck desktop">
        {renderSpread(shuffledCards.slice(0, 13), 13, 6)}
      </div>
      <div className="deck desktop">
        {renderSpread(shuffledCards.slice(13, 22), 9, 8, true)}
      </div>
    </div>
  );
}
