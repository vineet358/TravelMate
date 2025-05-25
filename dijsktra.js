
function dijkstra(graph, startNodeId, endNodeId) {
    console.log(`🔍 Running Dijkstra's algorithm from ${startNodeId} to ${endNodeId}`);
    
    if (!graph || !graph[startNodeId] || !graph[endNodeId]) {
        console.error('❌ Invalid graph or node IDs for Dijkstra');
        return { path: [], distance: Infinity, nodesVisited: 0 };
    }
    
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    let nodesVisited = 0;
    
   
    Object.keys(graph).forEach(nodeId => {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
        unvisited.add(nodeId);
    });
    
    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
        let currentNodeId = null;
        let smallestDistance = Infinity;
        
        for (const nodeId of unvisited) {
            if (distances[nodeId] < smallestDistance) {
                smallestDistance = distances[nodeId];
                currentNodeId = nodeId;
            }
        }
        
        if (smallestDistance === Infinity) {
            console.warn('⚠️ No path found with Dijkstra - unreachable nodes');
            break;
        }
    
        if (currentNodeId === endNodeId) {
            console.log('✅ Dijkstra reached destination');
            break;
        }
        
        unvisited.delete(currentNodeId);
        nodesVisited++;
        
        const currentNode = graph[currentNodeId];
        if (currentNode && currentNode.neighbors) {
            for (const neighbor of currentNode.neighbors) {
                if (unvisited.has(neighbor.id)) {
                    const tentativeDistance = distances[currentNodeId] + neighbor.distance;
                
                    if (tentativeDistance < distances[neighbor.id]) {
                        distances[neighbor.id] = tentativeDistance;
                        previous[neighbor.id] = currentNodeId;
                    }
                }
            }
        }
    }
    
    const path = [];
    let current = endNodeId;
    

    if (previous[endNodeId] === null && endNodeId !== startNodeId) {
        console.warn('⚠️ No path found with Dijkstra - destination unreachable');
        return { path: [], distance: Infinity, nodesVisited };
    }
    

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

function dijkstraShortestPath(startNodeId, endNodeId) {
    const result = dijkstra(graph, startNodeId, endNodeId);
    return {
        path: result.path,
        distance: result.distance
    };
}


console.log('📚 Dijkstra algorithm module loaded');