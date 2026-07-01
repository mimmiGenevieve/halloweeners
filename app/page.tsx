"use client";
import React, { useState } from "react";
import { CORRECT_PASSWORD } from "./constants";
import TarotCards from "./TarotCards";

export default function Home(): JSX.Element {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setError("");
      setLoggedIn(true);
    } else {
      setError(
        "The spirits have tasted your phrase and found it wanting. Pray, try again."
      );
      setLoggedIn(false);

      setTimeout(() => setError(""), 5000);
    }
  };

  if (loggedIn) return <TarotCards />;

  return (
    <div>
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
