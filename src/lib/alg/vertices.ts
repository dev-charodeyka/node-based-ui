const vertices: VertexType[] = [
  {
    id: '0',
    humanName: 'Iris Dataset',
    codeName: 'IrisDataset',
    output: 'IrisDataset',
    type: 'data',
    connectsTo: [],
    accepts: ['2']
  },
  {
    id: '1',
    humanName: 'Wisconsin Dataset',
    codeName: 'WisconsinDataset',
    output: 'WisconsinDataset',
    type: 'data',
    connectsTo: [],
    accepts: ['2']
  },
  {
    id: '2',
    humanName: 'Data To Matrix',
    codeName: 'FormDataAsMatrix',
    output: 'dataMatrix',
    type: 'operation',
    connectsTo: ['0', '1'],
    accepts: ['3']
  },
  {
    id: '3',
    humanName: 'Adjust Matrix To Mean',
    codeName: 'AdjustMatrixToMean',
    output: 'meanAdjustedMatrix',
    type: 'operation',
    connectsTo: ['2'],
    accepts: ['4', '5']
  },
  {
    id: '4',
    humanName: 'Transpose Matrix',
    codeName: 'TransposeMatrix',
    output: 'transposedMatrix',
    type: 'operation',
    connectsTo: ['3'],
    accepts: ['5']
  },
  {
    id: '5',
    humanName: 'Multiply',
    codeName: 'Multiply',
    output: 'covarianceMatrix',
    type: 'operation',
    connectsTo: ['3', '4'],
    accepts: ['6']
  },
  {
    id: '6',
    humanName: 'Eigen Vectors and Values',
    codeName: 'EigenvectorsAndEigenvalues',
    output: 'eigen(vectors,values)',
    type: 'operation',
    connectsTo: ['5'],
    accepts: ['7']
  },
  {
    id: '7',
    humanName: 'Filter unused coordinates',
    codeName: 'FilterOutUnusedCoordinates',
    output: 'reducedData',
    type: 'output',
    connectsTo: ['6'],
    accepts: []
  }
];

export default vertices;
//
// algorithm PCA(dataset):
// INPUT
//    dataset = collection of data points
// OUTPUT
//    reducedData = dataset with reduced dimensionality

//dataMatrix <- FormDataAsMatrix(dataset)
//meanAdjustedMatrix <- AdjustMatrixToMean(dataMatrix)
//transposedMatrix <- TransposeMatrix(meanAdjustedMatrix)
//covarianceMatrix <- Multiply(meanAdjustedMatrix, transposedMatrix)
//(eigenvectors, eigenvalues) <- EigenvectorsAndEigenvalues(covarianceMatrix)
/* reducedData < -FilterOutUnusedCoordinates(eigenvectors, eigenvalues);
return reducedData; */
