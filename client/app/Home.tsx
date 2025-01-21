"use client";
import TokenCard from "@/components/tokenCard";
import { KARBONSTOREADDR, POLICYID } from "@/config";
import { useWallet } from "@/context/walletContext";
import { datumDecoder } from "@/lib/utils";
import { KarbonStoreDatum } from "@/types/cardano";
import { Data, LucidEvolution, UTxO } from "@lucid-evolution/lucid";
import React, { use, useEffect, useState } from "react";

export default function HomePage() {
  const [walletConnection] = useWallet();
  const { lucid } = walletConnection;
  const [balance, setBalance] = useState<{ unit: string; quantity: number, datum: KarbonStoreDatum }[]>(
    [],
  );

  useEffect(() => {
    async function fetchutxos() {
      if (!lucid) return;
      const utxos = await lucid.utxosAt(KARBONSTOREADDR);
      utxos.map(async (utxo) => {
        const datum = await datumDecoder(lucid, utxo)
        Object.entries(utxo.assets).map(([assetKey, quantity]) => {
          if (assetKey.startsWith(POLICYID)) {
            setBalance((prev) => [
              ...prev,
              { unit: assetKey, quantity: Number(quantity), datum: datum },
            ]);
          }
        });
      });
    }
    fetchutxos();
  }, [lucid]);


  return (
    <div className="flex gap-4 flex-wrap">
      {balance &&
        balance.map((token) => (
          <TokenCard
            key={token.unit}
            token={token.unit}
            qty={token.quantity}
            datum={token.datum}
            type="Buy"
          />
        ))}
    </div>
  );
}
