import path from "path";
import * as ort from "onnxruntime-node";

import NormalizadorService from "./Normalizador.service";
import AtletaType from "../types/Atleta.type";

class ModeloService {
    private normalizadorService: NormalizadorService = new NormalizadorService();
    private caminhoModelo = "./data/modelo_atletas.onnx";
    private session: ort.InferenceSession | null = null;

    private nomeClasses: Record<number, string> = {
        0: "Baixo Desempenho",
        1: "Médio Desempenho",
        2: "Alto Desempenho"
    };

    private mapaPosicoes: Record<string, number> = {
        "10s": 0,
        CBs: 1,
        CMs: 2,
        STs: 3,
        WBs: 4,
        Indefinido: 5
    };

    private async carregarModelo(): Promise<ort.InferenceSession> {
        if (!this.session) {
            this.session = await ort.InferenceSession.create(
                path.resolve(this.caminhoModelo)
            );
        }
        return this.session;
    }

    public async predict(dadosAtleta: AtletaType) {
        const normalizador = await this.normalizadorService.getSession();
        const modelo = await this.carregarModelo();

        const posicaoNumero =
            this.mapaPosicoes[dadosAtleta.Group ?? "Indefinido"] ??
            this.mapaPosicoes["Indefinido"];

        const vetorBruto = [
            posicaoNumero,
            dadosAtleta["Workload"],
            dadosAtleta["Sprint Distance"],
            dadosAtleta["High Intensity Running"],
            dadosAtleta["Top Speed"],
            dadosAtleta["Accelerations"],
            dadosAtleta["Decelerations"],
            dadosAtleta["No. of Sprints"],
            dadosAtleta["Metres per Minute"],
            dadosAtleta["No. of High Intensity Events"],
            dadosAtleta["Minutes Played"]
        ];

        const tensorInput = new ort.Tensor(
            "float32",
            Float32Array.from(vetorBruto),
            [1, 11]
        );

        const normResult = await normalizador.run({
            input: tensorInput
        });

        const vetorNormalizado = Object.values(normResult)[0] as ort.Tensor;

        const result = await modelo.run({
            input: vetorNormalizado
        });

        const probabilidadesTensor = result["probabilities"] as ort.Tensor;

        const probabilidades = Array.from(
            probabilidadesTensor.data as Float32Array
        );

        const classePrevista = probabilidades.indexOf(
            Math.max(...probabilidades)
        );

        return {
            nome_classe: this.nomeClasses[classePrevista],
            confianca: Number((probabilidades[classePrevista] * 100).toFixed(1)),
            probabilidades: probabilidades.reduce<Record<string, number>>(
                (acc, p, i) => {
                    acc[this.nomeClasses[i]] = Number((p * 100).toFixed(1));
                    return acc;
                },
                {}
            )
        };
    }
}

export default ModeloService;