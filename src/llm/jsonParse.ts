import * as z from "zod"

export const toolCallSchemas = z.discriminatedUnion("name", [
    z.object({
        name: z.literal("get_weather"),
        arguments: z.object({
            location: z.string()
        })
    }),
    z.object({
        name: z.literal("get_utc"),
        arguments: z.object()
    }),
    z.object({
        name: z.literal("convert_currency"),
        arguments: z.object({
            amount: z.string(),
            from: z.string(),
            to: z.string()
        })
    })
])

export type ToolCallSchema = z.infer<typeof toolCallSchemas>

export function parseJSON(content: string): ToolCallSchema | null {
    try {
        let jsonObject = JSON.parse(content)

        if (Array.isArray(jsonObject) && jsonObject.length > 0) {
            jsonObject = jsonObject[0]
        }

        const parsed = toolCallSchemas.parse(jsonObject)

        return parsed
    } catch(e) {
        console.error(`Error when parsing object: ${e}`)
        return null
    }
}
