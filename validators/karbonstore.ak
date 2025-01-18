use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address, VerificationKey}
use cardano/assets
use cardano/transaction.{Output, OutputReference, Transaction}
use mocktail/virgin_address.{mock_pub_key_address, mock_pub_key_stake_cred}

validator karbonstore {
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

const roylaty_address: VerificationKeyHash = "addr_test1qzqhza3hpgs5nsfmnqfzakczprrlm3yjdeny7wakywm052q3qskkkydwrt982spj6gq46yheeg4aszdqncv4cg92lzfqffnpd5"



test address() {
  let add = mock_pub_key_address(1, None)
  let stake = mock_pub_key_stake_cred(1)
  let add2 = mock_pub_key_address(1, Some(stake))
  trace @"stake": stake
  trace @"add": add
  trace @"add2": add2

  let add3 =
    Address {
      payment_credential: add.payment_credential,
      stake_credential: Some(stake),
    }

  trace @"addr3": add3
  add2 ==add3
}
// stake_credential: Some(Inline(ScriptCredential(marketplace_stake_sh))),
