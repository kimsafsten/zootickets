"use client";

import { useState } from "react";
import styles from "./ActivateTicket.module.css";

type Props = {
  onActivated: () => void;
};

export default function ActivateTicket({ onActivated }: Props) {
  const [code, setCode] = useState("");

  async function activateTicket() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tickets/${code}/activate`,
      { method: "PATCH" }
    );

    if (!response.ok) {
      throw new Error("Failed to activate ticket");
    }

    onActivated();
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
    </div>
  );
}