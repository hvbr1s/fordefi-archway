import { toBase64, fromBase64 } from '@cosmjs/encoding';
import { TxBody, AuthInfo } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { MsgStoreCode } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import * as fs from 'fs';
import * as path from 'path';

export async function createRequest(vault_id: string, sender: string, binary: any) {

  // 1. Create the MsgStoreCode message
  const storeCodeMsg = MsgStoreCode.fromPartial({
     sender: sender,
     wasmByteCode: binary,
     instantiatePermission: undefined
  });
  
  // 2. Create and encode the transaction body
  const txBody = TxBody.fromPartial({
    messages: [{
      typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
      value: MsgStoreCode.encode(storeCodeMsg).finish()
    }],
    memo: ""
  });
  
  const bodyBytes = TxBody.encode(txBody).finish();
  const bodyBase64 = toBase64(bodyBytes);
  
  // 3. Create and encode the auth info
  const publicKeyBytes = fromBase64("AqL2SON9Q8XivpgRbbYYf+Pm+3Ctjmg93QuNpM90/BHO"); // change to your public_key_compressed
  const pubKey = PubKey.fromPartial({
    key: publicKeyBytes
  });
  
  const authInfo = AuthInfo.fromPartial({
    signerInfos: [{
      publicKey: {
        typeUrl: "/cosmos.crypto.secp256k1.PubKey",
        value: PubKey.encode(pubKey).finish()
      },
      modeInfo: {
        single: {
          mode: SignMode.SIGN_MODE_DIRECT
        }
      },
      sequence: BigInt(0) // change as needed
    }],
    fee: {
      amount: [{
        denom: "aarch",
        amount: "5000000000"
      }],
      gasLimit: BigInt(600000)
    }
  });
  
  const authInfoBytes = AuthInfo.encode(authInfo).finish();
  const authInfoBase64 = toBase64(authInfoBytes);
  
  // 4. Construct the request with direct format
  const requestJson = {
    "vault_id": vault_id,
    "signer_type": "api_signer",
    "type": "cosmos_transaction",
    "details": {
      "type": "cosmos_raw_transaction",
      "chain": "cosmos_archway-1",
      "request_data": {
        "format": "direct",
        "body": bodyBase64,
        "auth_info": authInfoBase64
      }
    }
  }
  
  return requestJson;
}
