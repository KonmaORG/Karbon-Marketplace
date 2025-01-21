"use client";
import { blockfrost, MetadataType } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { LoaderCircle, Minus, Plus, SquareArrowOutUpRight } from "lucide-react";
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
import { KarbonStoreDatum } from "@/types/cardano";

interface props {
  token: string;
  qty: number;
  datum?: KarbonStoreDatum;
  type: "Buy" | "Sell";
}

export default function TokenCard({ token, qty, datum, type }: props) {
  const [walletConnection] = useWallet();
  const { lucid, address } = walletConnection;
  const [metadata, setMetadata] = useState<MetadataType>();
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const result = await blockfrost.getMetadata(token);
      setMetadata(result);
    }
    fetchData();
  }, []);

  const handleListing = async () => {
    if (!lucid || !address) return;
    setSubmitting(true)
    try {
      type == "Buy"
        ? await Buy(lucid, address, datum as KarbonStoreDatum, token, quantity) //console.log(type, address, token, quantity)
        : await Sell(lucid, address, price as number, token, quantity);
    } catch (err: any) {
      console.log(err.message)
    } finally {
      setQuantity(1);
      setPrice(null);
      setSubmitting(false)
    }
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
        <CardContent className="flex justify-center p-1 relative">
          <Image
            src={imageUrl || ""}
            alt="token image"
            width={200}
            height={150}
            className="rounded-md object-cover"
          />
          <div className="absolute left-2 bottom-2 rounded-full bg-background p-1"><span className="text-primary-foreground">x{qty}</span></div>
        </CardContent>
        <CardFooter className="flex items-center justify-between space-x-2 p-2">
          <div className="flex items-center border rounded-md h-8 focus-within:ring-1 focus-within:ring-ring">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              className="h-full w-6 rounded-none px-1"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              value={quantity || ""}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              placeholder="Quantity"
              className="w-6 text-center font-semibold h-8 p-0 border-none text-sm outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
            />
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
            disabled={(type === "Sell" && !price) || submitting}
          >
            {submitting && <LoaderCircle className="animate-spin" />}{type}
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
