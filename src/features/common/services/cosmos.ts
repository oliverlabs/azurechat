import { CosmosClient } from "@azure/cosmos";
import { DefaultAzureCredential } from "@azure/identity";


// Read Cosmos DB_NAME and CONTAINER_NAME from .env
const DB_NAME = process.env.AZURE_COSMOSDB_DB_NAME || "chat";
const CONTAINER_NAME = process.env.AZURE_COSMOSDB_CONTAINER_NAME || "history";
const CONFIG_CONTAINER_NAME =
  process.env.AZURE_COSMOSDB_CONFIG_CONTAINER_NAME || "config";

export const CosmosInstance = () => {
  const endpoint = process.env.AZURE_COSMOSDB_URI;

  if (!endpoint) {
    throw new Error(
      "Azure Cosmos DB is not configured. Please configure it in the .env file."
    );
  }

  // Use DefaultAzureCredential for Azure RBAC
  const credential = new DefaultAzureCredential();
  return new CosmosClient({ endpoint, aadCredentials: credential });
};

export const ConfigContainer = () => {
  const client = CosmosInstance();
  const database = client.database(DB_NAME);
  const container = database.container(CONFIG_CONTAINER_NAME);
  return container;
};

export const HistoryContainer = () => {
  const client = CosmosInstance();
  const database = client.database(DB_NAME);
  const container = database.container(CONTAINER_NAME);
  return container;
};
