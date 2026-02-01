import { tool } from "@langchain/core/tools";
import type { BindToolsInput } from "@langchain/core/language_models/chat_models";
import * as z from "zod"
import { currencySchema, weatherSchema } from "./toolsHandles/schemas";
import { getWeather } from "./toolsHandles/APIs/weatherAPI";
import { getCurrency } from "./toolsHandles/APIs/currencyAPI";

export interface Tools {
    get_weather: BindToolsInput,
    get_utc: BindToolsInput,
    convert_currency: BindToolsInput
}

const weatherTool = tool(
    async (input) => {
        return await getWeather(input.location)
    },
    {
        name: "get_weather",
        description: "Get current weather/temperature/forecast ONLY when user explicitly asks about weather conditions in a specific city. NEVER call for greetings, small talk, or when location is not specified.",
        schema: weatherSchema
    }
)

const utcTool = tool(
    () => `Текущее время в UTC: ${new Date().toUTCString()}`,
    {
        name: "get_utc",
        description: "Get current time in UTC",
        schema: z.object({})
    }
)

const currencyTool = tool(
    async (input) => {
        return await getCurrency(Number(input.amount), input.from, input.to)
    },
    {
        name: "convert_currency",
        description: "Convert amount between currenciesr",
        schema: currencySchema
    }
)

export const tools = {
    get_weather: weatherTool,
    get_utc: utcTool,
    convert_currency: currencyTool
}

export const toolUsage = {
    get_weather: async (args: { location: string }): Promise<string> => {
        return await weatherTool.invoke({
            location: args.location
        })
    },
    get_utc: async (args: {}): Promise<string> => {
        return await utcTool.invoke({})
    },
    convert_currency: async (args: {amount: string, from: string, to: string}): Promise<string> => {
        return await currencyTool.invoke({amount: args.amount, from: args.from, to: args.to})
    }
}
