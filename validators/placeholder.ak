use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address, VerificationKey}
use cardano/assets
use cardano/transaction.{Output, OutputReference, Transaction}

validator placeholder {
  spend(
    datum: Option<KarbonDatum>,
    redeemer: KarbonRedeemer,
    _oref: OutputReference,
    tx: Transaction,
  ) {
    let Transaction { outputs, extra_signatories, .. } = tx
    expect Some(KarbonDatum { owner, amount }) = datum
    let (marketplace_payout, seller_payout) = calculate_payout_royalty(amount)
    when redeemer is {
      Buy -> and {
          payout_to_seller(outputs, owner, seller_payout),
          payout_to_marketplace(outputs, roylaty_address, marketplace_payout),
        }
      Withdraw -> list.has(extra_signatories, owner)
    }
  }

  else(_) {
    fail
  }
}

pub type KarbonRedeemer {
  Buy
  Withdraw
}

pub type KarbonDatum {
  owner: VerificationKeyHash,
  amount: Int,
}

pub fn payout_to_seller(
  outputs: List<Output>,
  owner: VerificationKeyHash,
  amount: Int,
) {
  payout_check(outputs, owner, amount)
}

pub fn payout_to_marketplace(
  outputs: List<Output>,
  owner: VerificationKeyHash,
  amount: Int,
) {
  payout_check(outputs, owner, amount)
}

pub fn payout_check(
  outputs: List<Output>,
  owner: VerificationKeyHash,
  amount: Int,
) {
  list.any(
    outputs,
    fn(o) {
      and {
        address_verificationKey_match(o.address, owner),
        assets.lovelace_of(o.value) == amount,
      }
    },
  )
}

pub fn address_verificationKey_match(address: Address, vkh: VerificationKeyHash) {
  when address.payment_credential is {
    VerificationKey(v) -> v == vkh
    _ -> False
  }
}

pub fn calculate_payout_royalty(amount: Int) -> (Int, Int) {
  // royalty is constant
  let marketplace = amount * royalty / 100
  let seller = amount - marketplace
  (marketplace, seller)
}

const royalty: Int = 3

const roylaty_address: VerificationKeyHash = "ykvfiusdgablviaweoblj"

test address_check() {
  // mockaddress
  // mockaddress.payment_credential
  // mockaddress.stake_cre
  // vkh= "...."
  // skh= "..."
  // address={vkh, skh}
  // scriptaddress={vkh, None}
  // address==mockaddress
  True
}
