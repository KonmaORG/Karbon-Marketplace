"use client";
import { blockfrost, MetadataType } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Minus, Plus, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { NETWORK } from "@/config";
import { Sell } from "./transactions/sell";
import { useWallet } from "@/context/walletContext";
import { Buy } from "./transactions/buy";

interface props {
  token: string;
  qty: number;
  type: "Buy" | "Sell";
}

export default function TokenCard({ token, qty, type }: props) {
  const [walletConnection] = useWallet();
  const { lucid, address } = walletConnection;
  const [metadata, setMetadata] = useState<MetadataType>();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await blockfrost.getMetadata(token);
      setMetadata(result.onchain_metadata);
    }
    fetchData();
  }, []);

  const handleListing = async () => {
    if (!lucid || !address) return;
    type == "Buy"
      ? await Buy(lucid, address, price as number, token, quantity) //console.log(type, address, token, quantity)
      : await Sell(lucid, address, price as number, token, quantity);
  };

  const imageUrl = metadata?.image.replace("ipfs://", "https://ipfs.io/ipfs/");

  return (
    metadata && (
      <Card className="w-[250px] p-1">
        <CardHeader className="p-2">
          <CardTitle className="text-lg font-bold truncate">
            {metadata.name}
          </CardTitle>
          <CardDescription>
            <Link
              href={`https://${NETWORK == "Mainnet" ? "" : NETWORK + "."}cexplorer.io/asset/${token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline gap-1 text-xs"
            >
              {token.slice(0, 20)}... <SquareArrowOutUpRight size={10} />
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-1">
          <Image
            src={imageUrl || ""}
            alt="token image"
            width={200}
            height={150}
            className="rounded-md object-cover"
          />
        </CardContent>
        <CardFooter className="flex items-center justify-between space-x-2 p-2">
          <div className="flex items-center border rounded-md h-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="h-full w-6 rounded-none px-1"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center text-sm font-semibold">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((prev) => Math.min(qty, prev + 1))}
              className="h-full w-6 rounded-none px-1"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <Button
            className="h-8 text-sm px-4"
            onClick={handleListing}
            disabled={type === "Sell" && !price}
          >
            {type}
          </Button>
          {type === "Sell" && (
            <div className="flex items-center border rounded-md h-8 px-1 focus-within:ring-1 focus-within:ring-ring">
              <span className="text-sm font-semibold">₳</span>
              <Input
                type="number"
                value={price || ""}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                placeholder="Price"
                className="w-10 text-center h-8 p-0 border-none text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />
            </div>
          )}
        </CardFooter>
      </Card>
    )
  );
}
