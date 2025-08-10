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

  useEffect(() => {
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    setLoadingMessage(randomMsg);

    setTimeout(() => {
      const storedLogin = localStorage.getItem("loggedIn");
      if (storedLogin === "true") setLoggedIn(true);
      setLoading(false);
    }, 800);
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

  if (loggedIn) return <TarotCards />;

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
