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
import vertices from './vertices';
const pcaBiGraph: Record<string, PcaNodeType> = {
  '0': { id: '0', inputs: [], outputs: ['2'] },
  '1': { id: '1', inputs: [], outputs: ['2'] },
  '2': { id: '2', inputs: [['0', '1']], outputs: ['3'] },
  '3': { id: '3', inputs: [['2']], outputs: ['4'] },
  '4': { id: '4', inputs: [['3']], outputs: ['5'] },
  '5': { id: '5', inputs: [['3'], ['4']], outputs: ['6'] },
  '6': { id: '6', inputs: [['5']], outputs: ['7'] },
  '7': { id: '7', inputs: [['6']], outputs: [] }
};
const dataVertices = vertices.filter((vertex) => vertex.type === 'data').map((vertex) => vertex.id);

export function traversePcaGraph(existingEdgesSet: Set<string>): string[] {
  const selectedDataVertex = dataVertices.find((vertexId) =>
    pcaBiGraph[vertexId].outputs.some((nextNode) =>
      existingEdgesSet.has(`${vertexId}-to-${nextNode}`)
    )
  );

  const graphRoot = selectedDataVertex;
  if (!graphRoot || !(graphRoot in pcaBiGraph)) {
    return [];
  }

  const visitedNodes = new Set<string>();
  const graphPath: string[] = [];

  //iterate is human, recurse is divine
  function dfs(nodeId: string) {
    if (visitedNodes.has(nodeId)) return;
    const inputsSatisfied = pcaBiGraph[nodeId].inputs.every((inputList) =>
      inputList.some((fromVertex) => existingEdgesSet.has(`${fromVertex}-to-${nodeId}`))
    );
    if (!inputsSatisfied) {
      return;
    }

    visitedNodes.add(nodeId);
    graphPath.push(nodeId);

    for (const nextNode of pcaBiGraph[nodeId].outputs) {
      dfs(nextNode);
    }
  }

  dfs(graphRoot);
  return graphPath;
}
