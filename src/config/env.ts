// Load environment variables from .env file
import "dotenv/config";

// Define the type of our env variables
interface EnvVariables {
    GROQ_API_KEY: string;
    PINECONE_API_KEY: string;
    PINECONE_INDEX_NAME: string;
    PINECONE_NAMESPACE: string;
}

// Function to validate the the env variables
function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error('Missing Envrionment Variable: ${name}');
    }

    return value;
}

// Export the environment variables
function getEnv(): EnvVariables {
    return {
        GROQ_API_KEY: getRequiredEnv("GROQ_API_KEY"),
        PINECONE_API_KEY: getRequiredEnv("PINECONE_API_KEY"),
        PINECONE_INDEX_NAME: getRequiredEnv("PINECONE_INDEX_NAME"),
        PINECONE_NAMESPACE: process.env.PINECONE_NAMESPACE || "",
    };
}

export const config = getEnv();