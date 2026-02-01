import { Bot, GrammyError, HttpError } from "grammy";
import type { OllamaInput } from "@langchain/ollama";
import { LLMAgent } from "../llm/agent";
import { CommandsHadler } from "../handlers/commands/commandsHandler";
import { MessagesHandler } from "../handlers/messages/messagesHandler";
import { weatherTool } from "../llm/toolsDefintions";

export class App {
    bot: Bot
    llmAgent: LLMAgent

    constructor(botToken: string, modelSetting: OllamaInput, systemMessage: string) {
        this.bot = new Bot(botToken)
        this.llmAgent = new LLMAgent(modelSetting, [weatherTool], systemMessage)
    }

    setupBot() {
        const commandsHadler = new CommandsHadler(this.bot)

        this.bot.use(commandsHadler.getComposer())
        commandsHadler.setupCommands()

        const messagesHandler = new MessagesHandler(this.llmAgent)
        this.bot.use(messagesHandler.getComposer())
        messagesHandler.setupHandlers()

        this.bot.catch((err) => {
            const ctx = err.ctx
            console.error(`Error while handling update: ${ctx.update.update_id}`)
            const e = err.error
            if (e instanceof GrammyError)
                console.error(`Error in request:\n${e.description}`)
            else if (e instanceof HttpError)
                console.error(`Could not contact with Telegram:\n${e}`)
            else
                console.error(`Unknown error:\n${e}`)
        })

        this.bot.start()
    }
}