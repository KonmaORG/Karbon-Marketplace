import { KARBONSTOREADDR, NETWORK } from "@/config";
import { toLovelace } from "@/lib/utils";
import { KarbonStoreDatum } from "@/types/cardano";
import {
  Data,
  LucidEvolution,
  paymentCredentialOf,
} from "@lucid-evolution/lucid";

export async function Sell(
  lucid: LucidEvolution,
  address: string,
  price: number,
  token: string,
  qty: number,
) {
  const datum: KarbonStoreDatum = {
    owner: paymentCredentialOf(address).hash,
    amount: toLovelace(price),
  };
  const tx = await lucid
    .newTx()
    .pay.ToAddressWithData(
      KARBONSTOREADDR,
      { kind: "inline", value: Data.to(datum, KarbonStoreDatum) },
      { lovelace: 3_000_000n, [token]: BigInt(qty) },
    )
    .complete();

  const signed = await tx.sign.withWallet().complete();
  const txHash = await signed.submit();
  console.log("txHash: ", txHash);
}
