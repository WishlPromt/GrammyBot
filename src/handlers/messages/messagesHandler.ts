import { Handler } from "../handler"
import type { LLMAgent } from "../../llm/agent"

export class MessagesHandler extends Handler {
    private agent: LLMAgent

    constructor(llm: LLMAgent) {
        super()
        this.agent = llm
    }

    setupHandlers() {
        this.composer.on(":text", async (ctx) => {
            const answer = await ctx.reply("Генерирую ответ...", { parse_mode: "Markdown" })
            try {
                const completion = await this.agent.generateAnswer(ctx.msg.text)
                await ctx.api.editMessageText(answer.chat.id, answer.message_id, completion, { parse_mode: "Markdown" })
            } catch (err) {
                console.error(err)
                await ctx.api.editMessageText(answer.chat.id, answer.message_id, "Не удалось сгенерировать ответ", { parse_mode: "Markdown" })
            }
        })

        this.composer.on(":photo", async (ctx) => {
            await ctx.reply("Ты отправил мне фото")
        })

        this.composer.on(":video", async (ctx) => {
            await ctx.reply("Ты отправил мне видео")
        })

        this.composer.on(":file", async (ctx) => {
            await ctx.reply("Ты отправил мне файл")
        })
    }
}