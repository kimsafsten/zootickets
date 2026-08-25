"use client";

import { useState } from "react";

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
    <div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Biljettkod"
      />
      <button onClick={activateTicket}>Använd biljett</button>
    </div>
  );
}