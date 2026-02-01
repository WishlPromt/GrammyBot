import { tool } from "@langchain/core/tools";
import * as z from "zod"

export const tools = [
    tool(
        () => `The time in UTC: ${new Date().toUTCString()}`,
        {
            name: "get_utc_time",
            description: "Get tiem in UTC",
            schema: z.object({})
        }
    )
]

export const weatherTool = tool(
    (input) => `Погода в ${input.location} - 25°C`,
    {
        name: "get_weather",
        description: "Get current weather/temperature/forecast ONLY when user explicitly asks about weather conditions in a specific city. NEVER call for greetings, small talk, or when location is not specified.",
        schema: z.object({
            location: z.string().describe("City name in Russian or English, e.g. Moscow or Paris")
        })
    }
)