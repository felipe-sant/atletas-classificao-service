import { Request, Response, NextFunction } from "express";
import { atletaSchema } from "../schemas/Atleta.schema";

function atletaValidationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const result = atletaSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            erro: "Body inválido",
            detalhes: result.error.format(),
        });
    }

    req.body = result.data;
    next();
}

export default atletaValidationMiddleware