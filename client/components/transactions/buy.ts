import { KARBONSTOREADDR, NETWORK, POLICYID } from "@/config";
import { toLovelace } from "@/lib/utils";
import { KarbonStoreDatum } from "@/types/cardano";
import {
  Data,
  fromText,
  LucidEvolution,
  paymentCredentialOf,
} from "@lucid-evolution/lucid";

export async function Buy(
  lucid: LucidEvolution,
  address: string,
  datum: KarbonStoreDatum,
  token: string,
  qty: number
) {


  const K_token = { [POLICYID + token]: qty as unknown as bigint };
  const tx = await lucid
    .newTx()
    .pay.ToAddress(
      address,
      { lovelace: 3_000_000n },
    )
    .complete();

  const signed = await tx.sign.withWallet().complete();
  const txHash = await signed.submit();
  console.log("txHash: ", txHash);
}
