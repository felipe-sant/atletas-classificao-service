import { Router } from "express";
import ModeloController from "../controllers/Modelo.controller";
import atletaValidationMiddleware from "../middleware/atletaValidation.middleware";

class ModeloRoutes {
    private modeloController: ModeloController
    private router: Router = Router()

    private url: string = "/"
    private url_id: string = "/:id"
    private url_test: string = "/_"

    constructor() {
        this.modeloController = new ModeloController()

        // `POST | http://0.0.0.0:0000/api/`
        this.router.post(
            this.url,
            atletaValidationMiddleware,
            this.modeloController.predict.bind(this.modeloController)
        )
    }

    public getRouter() {
        return this.router
    }
}

const modeloRoutes = new ModeloRoutes().getRouter()
export default modeloRoutes