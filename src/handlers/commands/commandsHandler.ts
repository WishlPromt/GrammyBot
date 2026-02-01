import { Bot } from "grammy"
import { commandsDefinitions } from "./commandsDefinitions"
import type { BotCommand } from "grammy/types"
import { Handler } from "../handler"

export class CommandsHadler extends Handler {
    private bot: Bot

    constructor(bot: Bot) {
        super()
        this.bot = bot
    }

    setupCommands() {
        commandsDefinitions.forEach(({ command, callback }) => {
            this.composer.command(command, callback)
        })

        const commands: BotCommand[] = commandsDefinitions.map(({command, description}) => ({
            command,
            description
        }))

        this.bot.api.setMyCommands(commands);
    }
}
