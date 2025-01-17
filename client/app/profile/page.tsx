'use client'
import TokenCard from '@/components/tokenCard';
import { useWallet } from '@/context/walletContext';
import React, { useEffect, useState } from 'react'

const POLICYID = "75f7fed150c1020caa4a1badb9370dc6e07d0724d9ab36d4fb5c65e2";
export default function Page() {
    const [walletConnection, setWalletConnection] = useWallet();
    const { wallet, lucid, address } = walletConnection
    const [karbonTokens, setKarbonTokens] = useState<Record<string, number>>({});
    useEffect(() => {
        async function tokens() {
            if (!lucid || !wallet || !address) return;
            const assetSet = new Set();
            // const api = await wallet.enable()
            // api.getBalance()
            const utxos = await lucid.wallet().getUtxos()
            const aggregateTokenQuantities = () => {
                const quantities: Record<string, number> = {};

                utxos.forEach((utxo) => {
                    if (utxo.assets) {
                        Object.entries(utxo.assets).forEach(([assetKey, quantity]) => {
                            if (assetKey.startsWith(POLICYID)) {
                                if (quantities[assetKey as keyof typeof quantities]) {
                                    quantities[assetKey as keyof typeof quantities] += Number(quantity); // Add quantity if the token exists
                                } else {
                                    quantities[assetKey as keyof typeof quantities] = Number(quantity); // Initialize the token with its quantity
                                }
                            }
                        });
                    }
                });

                setKarbonTokens(quantities);
            };

            aggregateTokenQuantities();
        }
        tokens()
    }, [wallet, address])

    useEffect(() => {
        setKarbonTokens({})
    }, [address, wallet])
    return (

        Object.entries(karbonTokens).map(([token, qty], index) => (
            <TokenCard key={index} token={token} qty={qty} />
        ))

    )
}
