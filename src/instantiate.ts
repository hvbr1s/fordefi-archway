import dotenv from 'dotenv'
import { signWithApiSigner } from "../api_request/signer";
import { createInstantiateRequest } from "../api_request/formInstantiateRequestDirect";
import { createAndSignTx } from "../api_request/pushToApi";

dotenv.config()
const fordefiConfig = {
  accessToken: process.env.FORDEFI_API_USER_TOKEN ?? "",
  vaultId: process.env.FORDEFI_COSMOS_VAULT_ID || "",
  senderAddress: process.env.FORDEFI_COSMOS_ARCHWAY_ADDRESS || "",
  compressedPubKey: process.env.FORDEFI_COSMOS_VAULT_COMPRESSED_PUBKEY || "", // public_key_compressed value when GET https://api.fordefi.com/api/v1/vaults/{id}
  privateKeyPath: "./secret/private.pem",
  pathEndpoint: "/api/v1/transactions"
};

// Contract specific variables
const codeId = 853; // Replace with the actual code ID from the Archway explorer on Mintscan
const contractLabel = "Fordef Deployed Contract!";
const instantiateMsg = {
  count: 42
};
const msgString = JSON.stringify(instantiateMsg);

async function main(): Promise<void> {
  try {
    // 1. Create json payload for instantiate transaction
    const requestBody = JSON.stringify(
      await createInstantiateRequest(
        fordefiConfig.vaultId, 
        fordefiConfig.senderAddress,
        fordefiConfig.compressedPubKey, 
        codeId,
        contractLabel,
        msgString
      )
    );
    console.log("Request: ", requestBody)

    // 2. Sign with Fordefi API Signer
    const timestamp = new Date().getTime();
    const payload = `${fordefiConfig.pathEndpoint}|${timestamp}|${requestBody}`;
    const signature = await signWithApiSigner(fordefiConfig.privateKeyPath, payload);

    // 3. Submit the transaction to Fordefi API and wait for result
    const response = await createAndSignTx(fordefiConfig.pathEndpoint, fordefiConfig.accessToken, signature, timestamp, requestBody);
    const fordDefiResult = response.data;
    console.log(fordDefiResult);
    
  } catch (error: any) {
    console.error(`Failed to sign the transaction: ${error.message}`);
  }
}
  
if (require.main === module) {
  main();
}