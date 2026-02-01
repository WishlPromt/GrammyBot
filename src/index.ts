import { App } from "./app/app"
import { modelSettings } from "./llm/modelConfig"

const app = new App(process.env.TOKEN, modelSettings, process.env.SYSTEM_PROMPT)
app.setupBot()
