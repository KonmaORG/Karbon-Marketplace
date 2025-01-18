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
  price: number,
  token: string,
  qty: number
) {
  const datum: KarbonStoreDatum = {
    owner: paymentCredentialOf(address).hash,
    amount: toLovelace(price),
  };

  const K_token = { [POLICYID + token]: qty as unknown as bigint };
  const tx = await lucid
    .newTx()
    .pay.ToAddressWithData(
      address,
      { kind: "inline", value: Data.to(datum, KarbonStoreDatum) },
      K_token
    )
    .pay.ToAddress(KARBONSTOREADDR, { lovelace: price as unknown as bigint })
    .complete();

  const signed = await tx.sign.withWallet().complete();
  const txHash = await signed.submit();
  console.log("txHash: ", txHash);
}
