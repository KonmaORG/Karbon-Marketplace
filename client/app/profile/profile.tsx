"use client";
import React, { useEffect, useState } from "react";

import TokenCard from "@/components/tokenCard";
import { POLICYID } from "@/config";
import { useWallet } from "@/context/walletContext";

export default function Profile() {
  const [walletConnection] = useWallet();
  const { wallet, lucid, address } = walletConnection;
  const [karbonTokens, setKarbonTokens] = useState<Record<string, number>>({});

  useEffect(() => {
    async function tokens() {
      if (!lucid || !address) return;
      const utxos = await lucid.wallet().getUtxos();
      // const utxos = await emulator.getUtxos(address);
      const aggregateTokenQuantities = () => {
        const quantities: Record<string, number> = {};

        utxos.forEach((utxo) => {
          if (utxo.assets) {
            Object.entries(utxo.assets).forEach(([assetKey, quantity]) => {
              if (assetKey.startsWith(POLICYID)) {
                if (quantities[assetKey as keyof typeof quantities]) {
                  quantities[assetKey as keyof typeof quantities] +=
                    Number(quantity); // Add quantity if the token exists
                } else {
                  quantities[assetKey as keyof typeof quantities] =
                    Number(quantity); // Initialize the token with its quantity
                }
              }
            });
          }
        });
        setKarbonTokens(quantities);
      };

      aggregateTokenQuantities();
    }
    tokens();
  }, [address]);

  useEffect(() => {
    setKarbonTokens({});
  }, [address, wallet]);

  if (!address)
    return <div className="mx-auto w-full">Connect Your Wallet First</div>;

  return (
    <div className="flex gap-4 flex-wrap">
      {Object.entries(karbonTokens).map(([token, qty], index) => (
        <>
          <TokenCard key={index} qty={qty} token={token} type="Sell" />
        </>
      ))}
    </div>
  );
}
