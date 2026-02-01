import * as z from "zod"

export const toolCallShema = z.object({
    name: z.string(),
    arguments: z.object({
        location: z.string()
    })
})

function parseJSON(content: string) {
    const jsonMatch = content.match(/\{[\s\S]*\}/)

    if (jsonMatch) {
        const parsed = toolCallShema.parse(jsonMatch[0])

        return parsed
    }
}
