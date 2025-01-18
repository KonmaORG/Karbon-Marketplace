'use client'
import TokenCard from "@/components/tokenCard";
import { KARBONSTOREADDR, POLICYID } from "@/config";
import { useWallet } from "@/context/walletContext";
import { blockfrost } from "@/lib/utils";
import React, { use, useEffect, useState } from "react";

export default function Home() {
  const [walletConnection] = useWallet();
  const { lucid, address } = walletConnection
  const [balance, setBalance] = useState<{ unit: string, quantity: number }[]>([])

  useEffect(() => {
    async function fetchutxos() {
      if (!lucid || !address) return
      const utxos = await lucid.utxosAt(KARBONSTOREADDR)
      utxos.map((utxo) => {
        Object.entries(utxo.assets).map(([assetKey, quantity]) => {
          if (assetKey.startsWith(POLICYID)) {
            setBalance((prev) => [...prev, { unit: assetKey, quantity: Number(quantity) }])
          }
        })
      })
    }
    fetchutxos()
  }, [address])


  if (!address) return <div className="mx-auto w-full">Connect Your Wallet First</div>
  return (
    <div className='flex gap-4 flex-wrap'>
      {balance && balance.map((token) => (

        <TokenCard key={token.unit} token={token.unit} qty={token.quantity} type="Buy" />
      ))}
    </div>
  );
}
