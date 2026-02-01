import { App } from "./app/app"
import { modelSettings } from "./llm/modelConfig"
import { systemMessage } from "./llm/modelConfig"

const app = new App(process.env.TOKEN, modelSettings, systemMessage)
app.setupBot()
