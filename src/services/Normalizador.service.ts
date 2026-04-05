import path from "path";
import * as ort from "onnxruntime-node";

class NormalizadorService {
    private session: ort.InferenceSession | null = null;
    private caminhoNormalizador = "./data/normalizador_atletas.onnx";

    public async getSession(): Promise<ort.InferenceSession> {
        if (!this.session) {
            this.session = await ort.InferenceSession.create(
                path.resolve(this.caminhoNormalizador)
            );
        }
        return this.session;
    }
}

export default NormalizadorService