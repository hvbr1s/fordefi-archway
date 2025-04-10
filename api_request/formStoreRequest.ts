export async function createRequest(vault_id: string, sender: string, bytecode: any) {
    
   const messageValue = {
      sender: sender,
      wasm_byte_code: bytecode, 
      instantiate_permission: null
   };
  

  const requestJson =  {
    "vault_id": vault_id,
    "signer_type":"api_signer",
    "type":"cosmos_transaction",
    "details":{
       "type":"cosmos_raw_transaction",
       "chain":"cosmos_archway-1",
       "request_data":{
          "format":"amino",
          "messages":[
             {
                "type":"wasm/MsgStoreCode",
                "value": JSON.stringify(messageValue)
             }
          ],
          "std_fee": {
            "amount": [
              {
                "denom": "aarch",
                "amount": "5000000000"
              }
            ],
            "gas": "600000"
          }
    
       }
    }
 }
    return requestJson;
}
