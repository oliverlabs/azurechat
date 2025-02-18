"use server";

import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

const USE_MANAGED_IDENTITIES = process.env.USE_MANAGED_IDENTITIES === "true";

export const GetSpeechToken = async () => {

  if (
    process.env.AZURE_SPEECH_REGION === undefined
  ) {
    return {
      error: true,
      errorMessage: "Missing Azure Speech region",
      token: "",
      region: "",
    };
  }

  var statusCode = 200;
  var errorMessage = "";
  var token = ""


  if (USE_MANAGED_IDENTITIES) {
  //if (false) {
    const credential = new DefaultAzureCredential();

    try {
      var token = (await credential.getToken("https://cognitiveservices.azure.com/.default")).token;
    }
    catch (error) {
      var statusCode = 500;
      var errorMessage = `${error}`;
    }
  }
  else {

    if (
      process.env.AZURE_SPEECH_KEY === undefined
    ) {
      return {
        error: true,
        errorMessage: "Missing Azure Speech key",
        token: "",
        region: "",
      };
    }

    const response = await fetch(
      `https://${process.env.AZURE_SPEECH_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY!,
        },
        cache: "no-store",
      }
    );

    var statusCode = response.status;
    var token = await response.text();
    var errorMessage = response.statusText;
  }

  return {
    error: statusCode !== 200,
    errorMessage: errorMessage,
    token: token,
    region: process.env.AZURE_SPEECH_REGION,
  };
};
