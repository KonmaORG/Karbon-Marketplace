import { BF_PID, NETWORK } from "@/config";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleError(error: any) {
  const { info, message } = error;

  function toJSON(error: any) {
    try {
      const errorString = JSON.stringify(error);
      const errorJSON = JSON.parse(errorString);

      return errorJSON;
    } catch {
      return {};
    }
  }

  const { cause } = toJSON(error);
  const { failure } = cause ?? {};

  const failureCause = failure?.cause;
  const failureInfo = failureCause?.info;
  const failureMessage = failureCause?.message;

  // toast(`${failureInfo ?? failureMessage ?? info ?? message ?? error}`, {
  // type: "error",
  // });
  console.error(failureCause ?? { error });
}



export const getMetadata = async (asset: string) => {
  const url =
    `https://cardano-${NETWORK}.blockfrost.io/api/v0/assets/${asset}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "project_id": BF_PID,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.onchain_metadata;
  } catch (err: any) {
    return err.message;
  }
};




export type MetadataType = {
  name: string;
  image: string;
  mediaType: string;
  description: string;
};

export type CardanoAsset = {
  asset: string;
  policy_id: string;
  asset_name: string;
  fingerprint: string;
  quantity: string;
  initial_mint_tx_hash: string;
  mint_or_burn_count: number;
  onchain_metadata: MetadataType;
  onchain_metadata_standard: string;
  onchain_metadata_extra: null | any;
  metadata: null | any;
};
