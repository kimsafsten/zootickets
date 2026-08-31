"use client";

import { useState } from "react";
import styles from "./ActivateTicket.module.css";

type Props = {
  onActivated: () => void;
};

export default function ActivateTicket({ onActivated }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function activateTicket() {
    if (!code.trim()) {
      setError("Ange en biljettkod.");
      return;
    }

    const confirmed = window.confirm(
      "Tänk på att en aktiverad dags- eller familjebiljett endast gäller " +
        "under aktiveringsdagen. En tvådagarsbiljett gäller även följande dag. " +
        "En säsongsbiljett gäller till årets slut. Vill du aktivera biljetten?"
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${encodeURIComponent(code.trim())}/activate`,
        { method: "PATCH" }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "Biljetten kunde inte aktiveras.");
      }

      setCode("");
      onActivated();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Biljetten kunde inte aktiveras."
      );
    }
  }

  return (
    <div className={styles.form}>
      <input
        className={styles.input}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Biljettkod"
      />
      <button className={styles.button} onClick={activateTicket}>
        Aktivera biljett
      </button>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
