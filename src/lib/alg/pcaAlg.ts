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
