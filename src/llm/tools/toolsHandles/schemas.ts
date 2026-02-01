import * as z from "zod"

export const weatherSchema = z.object({
        location: z.string().describe("City name in Russian or English, e.g. Moscow or Paris")
    })

export const utcSchema = z.object({})

export const currencySchema = z.object({
    amount: z.string()
        .describe("Amount to convert (positive number). Examples: 100, 50.5, 1000"),
    from: z.string()
        .regex(/^[A-Z]{3}$/, "Must be 3 uppercase letters (ISO 4217 code)")
        .describe("Source currency code in ISO 4217 format (3 uppercase letters). Examples: USD, EUR, RUB, GBP, JPY, CNY. DO NOT use full names like 'dollar'"),
    to: z.string()
        .regex(/^[A-Z]{3}$/, "Must be 3 uppercase letters (ISO 4217 code)")
        .describe("Target currency code in ISO 4217 format (3 uppercase letters). Examples: USD, EUR, RUB, GBP, JPY, CNY. DO NOT use full names like 'dollar'")
})
