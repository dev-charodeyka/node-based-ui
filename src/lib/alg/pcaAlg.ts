/* algorithm PCA(dataset):
    // INPUT
    //    dataset = collection of data points 
    // OUTPUT
    //    reducedData = dataset with reduced dimensionality

    dataMatrix <- FormDataAsMatrix(dataset)
    meanAdjustedMatrix <- AdjustMatrixToMean(dataMatrix)
    transposedMatrix <- TransposeMatrix(meanAdjustedMatrix)
    covarianceMatrix <- Multiply(meanAdjustedMatrix, transposedMatrix)
    (eigenvectors, eigenvalues) <- EigenvectorsAndEigenvalues(covarianceMatrix)
    reducedData <- FilterOutUnusedCoordinates(eigenvectors, eigenvalues)
    return reducedData */

const pcaBiGraph = {
    '0': {id:'0', inputs:[], outputs:[]},
    '1': {id:'0', inputs:[], outputs:[]},
    '2': {id:'0', inputs:[], outputs:[]},
    '3': {id:'0', inputs:[], outputs:[]},
}