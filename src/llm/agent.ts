import { ChatOllama, type OllamaInput } from "@langchain/ollama";
import { AIMessage, HumanMessage, SystemMessage, type ToolCall } from "@langchain/core/messages";
import { toolUsage, type Tools } from "./tools/toolsDefintions";
import { parseJSON } from "./jsonParse";

export class LLMAgent {
    private model
    private modelWithTools
    private systemMessage

    constructor(modelSettings: OllamaInput, tools: Tools, systemMessage: string) {
        this.model = new ChatOllama(modelSettings)
        this.modelWithTools = this.model.bindTools(Object.values(tools))
        this.systemMessage = systemMessage
    }

    async generateAnswer(input: string): Promise<string> {
        try {
            const aiMessage = await this.modelWithTools.invoke([new SystemMessage(this.systemMessage), new HumanMessage(input)])
        
            const toolResults = await this.useTool(aiMessage)
            if (toolResults.length > 0)
                return toolResults.join("\n\n")

            const text = String(aiMessage.content)
            return text.trim()
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    async useTool(aiMessage: AIMessage): Promise<string[]> {
        const results: string[] = []

        console.log(aiMessage.content)

        if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
            for (const toolCall of aiMessage.tool_calls) {
                try {
                    if (toolCall.name in toolUsage)
                    {
                        const result = await toolUsage[toolCall.name as keyof typeof toolUsage](toolCall.args as any)
                        results.push(String(result).trim())
                    } else {
                        console.warn(`Tool ${toolCall.name} not found`)
                        results.push(`Инструмент ${toolCall.name} не поддерживается`)
                    }

                } catch (err) {
                    console.error(`Error while using ${toolCall.name}:\n${err}`)
                    results.push(`Ошибка при вызове инструмента ${toolCall.name}`)
                }
            }
        }

        else {
            const content = String(aiMessage.content).trim()

            const parsed = parseJSON(content)

            if (parsed) {
                const result = await toolUsage[parsed.name as keyof typeof toolUsage](parsed.arguments as any)

                results.push(result.trim())
            }
        }

        return results
    }

    async useToolWithJSON() {

    }
}