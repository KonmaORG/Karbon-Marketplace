import {
  Blockfrost,
  Koios,
  Network,
  Provider,
  validatorToAddress,
} from "@lucid-evolution/lucid";
import { KarbonStoreValidator } from "./scripts/scripts";
export const BF_URL = process.env.NEXT_PUBLIC_BF_URL!;
export const BF_PID = process.env.NEXT_PUBLIC_BF_PID!;
const NETWORKx = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

export const NETWORK: Network = NETWORKx;
export const PROVIDER: Provider = new Blockfrost(BF_URL, BF_PID);
// export const provider: Provider = new Koios("/koios");

export const KARBONSTOREADDR = validatorToAddress(
  NETWORK,
  KarbonStoreValidator
);
export const POLICYID =
  "a38a6084e71db8dc7c7a2f63707cd083b5e0e67aebc38cb7bada208c";
// "e41cc2543ce6b3c671baafee1bae6cd9fad5495030469b6c59cb49dd";
