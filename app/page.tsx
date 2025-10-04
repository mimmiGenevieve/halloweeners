"use client";
import React, { useState, useEffect } from "react";
import { CORRECT_PASSWORD, messages } from "./constants";
import TarotCards from "./TarotCards";

export default function Home(): JSX.Element {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [storedCard, setStoredCard] = useState(undefined);

  useEffect(() => {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setLoadingMessage(randomMsg);

    const cardInStorage = localStorage.getItem("card");

    if (cardInStorage) setStoredCard(JSON.parse(cardInStorage));
    else {
      const urlParams = new URLSearchParams(window.location.search);
      const urlPassword = urlParams.get("password");

      const storedLogin = localStorage.getItem("loggedIn");
      if (urlPassword === CORRECT_PASSWORD) {
        setLoggedIn(true);
        localStorage.setItem("loggedIn", "true");
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("password");
        window.history.replaceState({}, document.title, newUrl.toString());
      } else if (storedLogin === "true") {
        setLoggedIn(true);
      }
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      setError("");
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true");
    } else {
      setError(
        "The spirits have tasted your phrase and found it wanting. Pray, try again."
      );
      setLoggedIn(false);
      localStorage.removeItem("loggedIn");

      setTimeout(() => setError(""), 5000);
    }
  };

  if (loading) {
    return (
      <div className="loading title">
        <div className="spinner"></div>
        <p>{loadingMessage}</p>
      </div>
    );
  }

  if (loggedIn) return <TarotCards card={storedCard} />;

  return (
    <div className="login-form">
      <h1 className="title">Enter the secret phrase and gain entry</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button type="submit">Enter</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
