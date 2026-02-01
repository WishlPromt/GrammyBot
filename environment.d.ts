declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string
            MODEL: string
            WEATHER_API_KEY: string
        }
    }
}

export {}
