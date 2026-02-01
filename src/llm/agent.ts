import { ChatOllama, type OllamaInput } from "@langchain/ollama";
import { weatherTool } from "./toolsDefintions";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { BindToolsInput } from "@langchain/core/language_models/chat_models";

export class LLMAgent {
    private model
    private modelWithTools
    private systemMessage

    constructor(modelSettings: OllamaInput, tools: BindToolsInput[], systemMessage: string) {
        this.model = new ChatOllama(modelSettings)
        this.modelWithTools = this.model.bindTools(tools)
        this.systemMessage = systemMessage
    }

    async generateAnswer(input: string): Promise<string> {
        try {
            const aiMessage = await this.modelWithTools.invoke([new SystemMessage(`
Вы — полезный ассистент-бот в Telegram, который может отвечать на общие вопросы и помогать пользователю. Не заостряй внимание на своих функциях - пользователь о них знает

Если вопрос не связан с указанием местоположения — отвечайте как обычно.
Если пользователь спрашивает о погоде и указывает город/локацию — используйте один из доступных инструментов.`), new HumanMessage(input)])
            
            console.log(`tool calss: ${aiMessage.tool_calls?.length}`);
            console.log(`answer: ${aiMessage.content}`)

            if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
                for (const toolCall of aiMessage.tool_calls) {
                    console.log(toolCall.name)
                    try {
                        if (toolCall.name === "get_weather") {
                            const weatherResult = await weatherTool.invoke({
                                location: toolCall.args.location
                            })
                            return weatherResult
                        }
                    } catch (err) {
                        console.error(err)
                    }
                }
            }
            const text = String(aiMessage.content)
            return text.trim()
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}