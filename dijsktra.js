// Function to calculate route using Dijkstra's algorithm
function calculateRouteWithDijkstra(sourcePos, destPos) {
    const sourceNode = findNearestNode(sourcePos);
    const destNode = findNearestNode(destPos);
    
    if (!sourceNode || !destNode) {
        alert('Could not find suitable road network near selected points.');
        document.getElementById('loadingIndicator').style.display = 'none';
        return;
    }
    
    console.log(`Calculating route using Dijkstra's algorithm from ${sourceNode.name} to ${destNode.name}`);
    
    // Run Dijkstra's algorithm
    const { distance, path } = dijkstraShortestPath(sourceNode.id, destNode.id);
    
    if (!path || path.length === 0) {
        alert('Could not find a path between the selected locations.');
        document.getElementById('loadingIndicator').style.display = 'none';
        return;
    }
    
    // Convert path to route points
    const routePoints = path.map(nodeId => {
        const node = graph[nodeId];
        return [node.lat, node.lng];
    });
    
    // Calculate estimated duration based on transportation mode
    let speedFactor;
    switch (currentRouteMode) {
        case 'walking':
            speedFactor = 5; // km/h for walking
            break;
        case 'cycling':
            speedFactor = 15; // km/h for cycling
            break;
        case 'driving':
        default:
            speedFactor = 30; // km/h for driving
            break;
    }
    
    // Convert to minutes: (distance in km / speed in km/h) * 60 min/h
    const duration = (distance / speedFactor) * 60;
    
    // Display the route
    displayRoute({
        distance: distance,
        duration: duration,
        points: routePoints
    });
    
    // Hide loading indicator
    document.getElementById('loadingIndicator').style.display = 'none';
}

// Dijkstra's algorithm for finding shortest path
function dijkstraShortestPath(startNodeId, endNodeId) {
    // Initialize data structures
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    
    // Initialize all distances as Infinity and add all nodes to unvisited set
    Object.keys(graph).forEach(nodeId => {
        distances[nodeId] = Infinity;
        previous[nodeId] = null;
        unvisited.add(nodeId);
    });
    
    // Distance from start node to itself is 0
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
        
        // If smallest distance is Infinity, there's no path to destination
        if (smallestDistance === Infinity) {
            break;
        }
        
        // If we've reached the end node, we're done
        if (currentNodeId === endNodeId) {
            break;
        }
        
        // Remove current node from unvisited set
        unvisited.delete(currentNodeId);
        
        // Check all neighbors of current node
        const currentNode = graph[currentNodeId];
        
        for (const neighbor of currentNode.neighbors) {
            // Only consider unvisited neighbors
            if (unvisited.has(neighbor.id)) {
                // Calculate tentative distance
                const tentativeDistance = distances[currentNodeId] + neighbor.distance;
                
                // Update if this path is shorter
                if (tentativeDistance < distances[neighbor.id]) {
                    distances[neighbor.id] = tentativeDistance;
                    previous[neighbor.id] = currentNodeId;
                }
            }
        }
    }
    
    // Reconstruct the path
    const path = [];
    let current = endNodeId;
    
    // If end node wasn't reached, return empty path
    if (previous[endNodeId] === null && endNodeId !== startNodeId) {
        return { distance: Infinity, path: [] };
    }
    
    // Build the path backwards
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }
    
    return { distance: distances[endNodeId], path };
}