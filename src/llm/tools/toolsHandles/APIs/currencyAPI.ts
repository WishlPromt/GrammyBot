import * as z from "zod"
import { api } from "./api"

export const CBRValuteSchema = z.object({
  ID: z.string(),
  NumCode: z.string(),
  CharCode: z.string(),
  Nominal: z.number(),
  Name: z.string(),
  Value: z.number(),
  Previous: z.number()
})

export const CBRResponseSchema = z.object({
  Date: z.string(),
  PreviousDate: z.string(),
  Timestamp: z.string(),
  Valute: z.record(z.string(), CBRValuteSchema)
})

export async function getCurrency(amount: number, from: string, to: string): Promise<string> {
    try {
        const responseJSON = await currencyAPI(`https://www.cbr-xml-daily.ru/daily_json.js`)
        
        const data = CBRResponseSchema.parse(responseJSON)

        const valutes = data.Valute
        const fromCode = from.toUpperCase()
        const toCode = to.toUpperCase()
        
        if (fromCode === 'RUB') {
            if (toCode === 'RUB') return `${amount} ₽ = ${amount} ₽`
        
            const target = valutes[toCode]
            if (!target) return `Валюта ${toCode} не поддерживается`

            const rate = target.Value / target.Nominal
            const result = amount / rate
        
            return `${amount.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽ = ${result.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${toCode}`
        }
        
        if (toCode === 'RUB') {
            const source = valutes[fromCode]
            if (!source) return `Валюта ${fromCode} не поддерживается`
        
            const rate = source.Value / source.Nominal
            const result = amount * rate
        
            return `${amount.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${fromCode} = ${result.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ₽`
        }
        
        const source = valutes[fromCode]
        const target = valutes[toCode]
        
        if (!source) return `Валюта ${fromCode} не поддерживается`
        if (!target) return `Валюта ${toCode} не поддерживается`
        
        const rateFrom = source.Value / source.Nominal
        const rubAmount = amount * rateFrom
        
        const rateTo = target.Value / target.Nominal
        const result = rubAmount / rateTo
        
        return `${amount.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${fromCode} = ${result.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${toCode}`
    } catch (error) {
        console.error("Error when converting currencies:", error)
        return `Не удалось получить курсы валют. Попробуйте позже.`
    }
}

async function currencyAPI(url: string) {
    return await api(url)
}
