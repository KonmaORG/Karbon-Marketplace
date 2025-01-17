'use client'
import { getMetadata, MetadataType } from '@/lib/utils';
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, SquareArrowOutUpRight } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from 'next/link';
import { NETWORK } from '@/config';

interface props {
    token: string;
    qty: number;
}

export default function TokenCard({ token, qty }: props) {
    const [metadata, setMetadata] = useState<MetadataType>();
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState<number | string>('');

    useEffect(() => {
        async function fetchData() {
            const result = await getMetadata(token)
            setMetadata(result)
        }
        fetchData()
    }, [])

    const imageUrl = metadata?.image.replace("ipfs://", "https://ipfs.io/ipfs/");
    return (
        metadata &&
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{metadata.name}</CardTitle>
                <CardDescription>
                    <Link href={`https://${NETWORK == "Mainnet" ? "" : NETWORK + "."}cexplorer.io/asset/${token}`} target="_blank" rel="noopener noreferrer"
                        className='flex items-baseline gap-2'>
                        {token.slice(0, 28)}... <SquareArrowOutUpRight size={12} />
                    </Link>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Image
                    src={imageUrl || ""}
                    alt="token image"
                    width={300}
                    height={200}
                    className="rounded-md object-cover"
                />
            </CardContent>
            <CardFooter className="flex items-center justify-between space-x-4">
                <div className="flex items-center border rounded-md h-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="h-full w-8 rounded-none"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(prev => Math.min(qty, prev + 1))}
                        className="h-full w-8 rounded-none"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
                <Button className="h-10">Sell</Button>
                <div className="flex items-center border rounded-md h-10 px-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                    <span className="text-lg font-semibold">₳</span>
                    <Input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        className="w-12 text-center h-10 p-0 border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                    />
                </div>
            </CardFooter>
        </Card>
    )
}
