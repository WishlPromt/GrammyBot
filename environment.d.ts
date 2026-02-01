declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string
            MODEL: string
            SYSTEM_PROMPT: string
        }
    }
}

export {}
