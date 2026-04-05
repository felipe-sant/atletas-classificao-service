import { Request, Response } from "express";
import ModeloService from "../services/Modelo.service";
import AtletaType from "../types/Atleta.type";

class ModeloController {
    private modeloService: ModeloService = new ModeloService()

    /**
     * `POST | http://0.0.0.0:0000/api/`
     */
    public async predict(req: Request<{}, {}, AtletaType>, res: Response): Promise<void> {
        try {
            const atleta = req.body
            const result = await this.modeloService.predict(atleta)
            res.status(200).json(result)
        } catch (error: unknown) {
            console.error("Error:", error)
            res.sendStatus(500)
        }
    }
}

export default ModeloController