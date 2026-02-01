import * as z from "zod"
import { api } from "./api"

const weatherApiKey = process.env.WEATHER_API_KEY

const WeatherAPIResponseSchema = z.object({
  location: z.object({
    name: z.string(),
    region: z.string().optional(),
    country: z.string(),
    lat: z.number(),
    lon: z.number(),
  }),
  current: z.object({
    temp_c: z.number(),
    feelslike_c: z.number(),
    condition: z.object({
      text: z.string(),
      icon: z.string(),
    }),
    humidity: z.number(),
    wind_kph: z.number(),
  }),
});

type WeatherAPIResponse = z.infer<typeof WeatherAPIResponseSchema>

export async function getWeather(location: string): Promise<string> {    
    const responseJSON = await weatherAPI(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(location)}&lang=ru`)

    const data = WeatherAPIResponseSchema.parse(responseJSON)

    return `${data.location.name}:\nТемпература: ${data.current.temp_c}°C`
}

async function weatherAPI(url: string) {
    return await api(url)
}
