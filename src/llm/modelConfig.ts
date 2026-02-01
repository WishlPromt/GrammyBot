import type { OllamaInput } from "@langchain/ollama";

export const modelSettings: OllamaInput = {
    model: process.env.MODEL,
    temperature: 0,
    maxRetries: 2
}