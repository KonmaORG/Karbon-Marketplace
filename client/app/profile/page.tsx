'use client'
import TokenCard from '@/components/tokenCard';
import { useWallet } from '@/context/walletContext';
import React, { useEffect, useState } from 'react'

const POLICYID = "e41cc2543ce6b3c671baafee1bae6cd9fad5495030469b6c59cb49dd";
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
