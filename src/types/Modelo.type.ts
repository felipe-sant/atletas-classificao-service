type ModeloType = {
    predict: (input: number[][]) => number[];
    predictProba: (input: number[][]) => number[][];
}

export default ModeloType