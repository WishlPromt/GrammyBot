import type { Context } from "grammy"

interface CommandDefinition {
    command: string,
    description: string,
    callback: (ctx: Context) => Promise<void> | void
}

export const commandsDefinitions: CommandDefinition[] = [
    {
        command: "start",
        description: "Запуск бота",
        callback: async (ctx) => {
            await ctx.reply("Бот запущен!")
        }
    },
    {
        command: "help",
        description: "Помощь",
        callback: async (ctx) => {
            await ctx.reply("Это бот ai-помощник")
        }
    }
]