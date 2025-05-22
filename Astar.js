
function calculateRouteWithAStar(sourcePos, destPos) {
    
    const startNode = findNearestNode({ lat: sourcePos.lat, lng: sourcePos.lng });
    const endNode = findNearestNode({ lat: destPos.lat, lng: destPos.lng });
    
    console.log('Starting A* routing from', startNode.name, 'to', endNode.name);
    
    if (!startNode || !endNode) {
        console.error('Could not find nearest nodes for the selected points');
        alert('Could not determine nearest points on the road network. Please try again.');
        document.getElementById('loadingIndicator').style.display = 'none';
        return;
    }
    
 
    const path = aStar(haldwaniData.nodes, haldwaniData.edges, startNode.id, endNode.id);
    
    if (!path || path.length === 0) {
        console.error('No path found between the selected points');
        alert('Could not find a path between the selected points. Please try different locations.');
        document.getElementById('loadingIndicator').style.display = 'none';
        return;
    }
    
    // Convert path to route points
    const routePoints = path.map(nodeId => {
        const node = haldwaniData.nodes.find(n => n.id === nodeId);
        return [node.lat, node.lng];
    });
    
    // Calculate total distance
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        const edge = haldwaniData.edges.find(e => 
            (e.source === path[i] && e.target === path[i + 1]) || 
            (e.target === path[i] && e.source === path[i + 1])
        );
        
        if (edge) {
            totalDistance += edge.distance;
        }
    }
    
    // Calculate duration based on the mode of transport
    let speed;
    switch (currentRouteMode) {
        case 'driving':
            speed = 30; // km/h
            break;
        case 'cycling':
            speed = 15; // km/h
            break;
        case 'walking':
            speed = 5; // km/h
            break;
        default:
            speed = 30; // km/h
    }
    
    const duration = (totalDistance / speed) * 60; // minutes
    
    // Display route
    displayRoute({
        points: routePoints,
        distance: totalDistance,
        duration: duration
    });
    
    // Hide loading indicator
    document.getElementById('loadingIndicator').style.display = 'none';
}


function aStar(nodes, edges, startId, goalId) {
    const nodeMap = Object.fromEntries(nodes.map(node => [node.id, node]));
  
    const openSet = new Set([startId]);
    const cameFrom = {};
  
    const gScore = {};
    const fScore = {};
  
    nodes.forEach(node => {
      gScore[node.id] = Infinity;
      fScore[node.id] = Infinity;
    });
  
    gScore[startId] = 0;
    
    
    fScore[startId] = getHeuristicDistance(nodeMap[startId], nodeMap[goalId]);
  
    while (openSet.size > 0) {
      // Get node in openSet with lowest fScore
      let current = [...openSet].reduce((a, b) =>
        fScore[a] < fScore[b] ? a : b
      );
  
      if (current === goalId) {
        // Reconstruct path
        const path = [current];
        while (cameFrom[current]) {
          current = cameFrom[current];
          path.unshift(current);
        }
        return path; 
      }
  
      openSet.delete(current);
  
      const neighbors = edges
        .filter(e => e.source === current || e.target === current)
        .map(e => (e.source === current ? e.target : e.source));
  
      for (let neighbor of neighbors) {
        const edge = edges.find(
          e =>
            (e.source === current && e.target === neighbor) ||
            (e.target === current && e.source === neighbor)
        );
        
        if (!edge) continue; // Skip if no edge found
        
        const tentativeG = gScore[current] + edge.distance;
  
        if (tentativeG < gScore[neighbor]) {
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentativeG;
          fScore[neighbor] = tentativeG + getHeuristicDistance(nodeMap[neighbor], nodeMap[goalId]);
          openSet.add(neighbor);
        }
      }
    }
  
    return null; // No path found
}


function getHeuristicDistance(node1, node2) {
    
    return getDistance(
        { lat: node1.lat, lng: node1.lng },
        { lat: node2.lat, lng: node2.lng }
    );
}

s
function getDistance(point1, point2) {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}