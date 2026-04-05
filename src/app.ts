import express, { Request, Response } from 'express'
import cors from 'cors'
import requestLoggerMiddleware from './middleware/requestLogger.middleware'
import dotenv from "dotenv"
import modeloRoutes from './routes/Modelo.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLoggerMiddleware)

app.use("/api/", modeloRoutes)
app.use("/", (_: Request, res: Response) => res.sendStatus(404))

export default app