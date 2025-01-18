'use client'
import { useWallet } from "@/context/walletContext";
import React, { use } from "react";

export default function Home() {
  const [walletConnection] = useWallet();
  const { address } = walletConnection

  if (!address) return <div className="mx-auto w-full">Connect Your Wallet First</div>
  return (
    <>
      HOME
    </>
  );
}
