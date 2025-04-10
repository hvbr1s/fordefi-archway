export async function createRequest(vault_id: string, sender: string, bytecode: any) {
    
  const requestJson =  {
    "vault_id": vault_id,
    "signer_type":"api_signer",
    "type":"cosmos_transaction",
    "details":{
       "type":"cosmos_raw_transaction",
       "chain":"cosmos_archway-1",  // or whichever chain you're targeting
       "request_data":{
          "format":"amino",
          "messages":[
            {
               "type":"wasm/MsgInstantiateContract",
               "value":`{\"sender\":\"${sender}\",\"admin\":\"\",\"code_id\":\"123\",\"label\":\"My Contract v1\",\"msg\":\"{\\\"param1\\\":\\\"value1\\\",\\\"param2\\\":\\\"value2\\\"}\"}`
            }
          ]
       }
    }
 }
    return requestJson;
}
