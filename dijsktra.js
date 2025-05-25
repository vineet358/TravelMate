// ========================================
// DIJKSTRA'S ALGORITHM IMPLEMENTATION
// ========================================

/**
 * Dijkstra's algorithm for finding shortest path between two nodes
 * @param {Object} graph - The graph object with nodes and neighbors
 * @param {string} startNodeId - Starting node ID
 * @param {string} endNodeId - Ending node ID
 * @returns {Object} - {path: Array, distance: number, nodesVisited: number}
 */
function dijkstra(graph, startNodeId, endNodeId) {
    console.log(`🔍 Running Dijkstra's algorithm from ${startNodeId} to ${endNodeId}`);
    
    // Validate inputs
    if (!graph || !graph[startNodeId] || !graph[endNodeId]) {
        console.error('❌ Invalid graph or node IDs for Dijkstra');
        return { path: [], distance: Infinity, nodesVisited: 0 };
    }
    
    // Initialize data structures
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    let nodesVisited = 0;
    
    // Initialize all distances as Infinity and add all nodes to unvisited set
    Object.keys(graph).forEach(nodeId => {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
        unvisited.add(nodeId);
    });
    
    // Starting node has distance 0
    distances[startNodeId] = 0;
    
    // Main algorithm loop
    while (unvisited.size > 0) {
        // Find the unvisited node with the smallest distance
        let currentNodeId = null;
        let smallestDistance = Infinity;
        
        for (const nodeId of unvisited) {
            if (distances[nodeId] < smallestDistance) {
                smallestDistance = distances[nodeId];
                currentNodeId = nodeId;
            }
        }
        
        // If smallest distance is Infinity, no path exists
        if (smallestDistance === Infinity) {
            console.warn('⚠️ No path found with Dijkstra - unreachable nodes');
            break;
        }
        
        // If we've reached the destination, we can stop
        if (currentNodeId === endNodeId) {
            console.log('✅ Dijkstra reached destination');
            break;
        }
        
        // Mark current node as visited
        unvisited.delete(currentNodeId);
        nodesVisited++;
        
        // Check all neighbors of current node
        const currentNode = graph[currentNodeId];
        if (currentNode && currentNode.neighbors) {
            for (const neighbor of currentNode.neighbors) {
                // Only process unvisited neighbors
                if (unvisited.has(neighbor.id)) {
                    const tentativeDistance = distances[currentNodeId] + neighbor.distance;
                    
                    // Update if this path is shorter
                    if (tentativeDistance < distances[neighbor.id]) {
                        distances[neighbor.id] = tentativeDistance;
                        previous[neighbor.id] = currentNodeId;
                    }
                }
            }
        }
    }
    
    // Reconstruct the path
    const path = [];
    let current = endNodeId;
    
    // Check if destination is reachable
    if (previous[endNodeId] === null && endNodeId !== startNodeId) {
        console.warn('⚠️ No path found with Dijkstra - destination unreachable');
        return { path: [], distance: Infinity, nodesVisited };
    }
    
    // Build the path backwards
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }
    
    const finalDistance = distances[endNodeId];
    console.log(`✅ Dijkstra complete: ${path.length} nodes, ${finalDistance.toFixed(2)}km, visited ${nodesVisited} nodes`);
    
    return { 
        path, 
        distance: finalDistance, 
        nodesVisited 
    };
}

/**
 * Alternative implementation for backward compatibility
 * @param {string} startNodeId - Starting node ID
 * @param {string} endNodeId - Ending node ID
 * @returns {Object} - {path: Array, distance: number}
 */
function dijkstraShortestPath(startNodeId, endNodeId) {
    const result = dijkstra(graph, startNodeId, endNodeId);
    return {
        path: result.path,
        distance: result.distance
    };
}


console.log('📚 Dijkstra algorithm module loaded');