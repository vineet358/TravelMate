
function aStar(graph, startNodeId, endNodeId) {
  console.log(`⭐ Running A* algorithm from ${startNodeId} to ${endNodeId}`);

  if (!graph || !graph[startNodeId] || !graph[endNodeId]) {
      console.error('❌ Invalid graph or node IDs for A*');
      return { path: [], distance: Infinity, nodesVisited: 0 };
  }
  
  const endNode = graph[endNodeId];
  const endLat = endNode.lat;
  const endLng = endNode.lng;
  

  const openSet = new Set([startNodeId]);
  const closedSet = new Set();
  const gScore = {}; 
  const fScore = {}; 
  const previous = {};
  let nodesVisited = 0;
  

  Object.keys(graph).forEach(nodeId => {
      gScore[nodeId] = Infinity;
      fScore[nodeId] = Infinity;
      previous[nodeId] = null;
  });
  

  gScore[startNodeId] = 0;
  fScore[startNodeId] = heuristic(graph[startNodeId], endLat, endLng);
  
  while (openSet.size > 0) {

      let currentNodeId = null;
      let lowestFScore = Infinity;
      
      for (const nodeId of openSet) {
          if (fScore[nodeId] < lowestFScore) {
              lowestFScore = fScore[nodeId];
              currentNodeId = nodeId;
          }
      }
      
      if (currentNodeId === endNodeId) {
          console.log('✅ A* reached destination');
          break;
      }
      

      openSet.delete(currentNodeId);
      closedSet.add(currentNodeId);
      nodesVisited++;
      
      const currentNode = graph[currentNodeId];
      if (currentNode && currentNode.neighbors) {
          for (const neighbor of currentNode.neighbors) {
              const neighborId = neighbor.id;
              
    
              if (closedSet.has(neighborId)) {
                  continue;
              }
              
              const tentativeGScore = gScore[currentNodeId] + neighbor.distance;
              
              if (!openSet.has(neighborId)) {
                  openSet.add(neighborId);
              }
         
              if (tentativeGScore >= gScore[neighborId]) {
                  continue;
              }
              
        
              previous[neighborId] = currentNodeId;
              gScore[neighborId] = tentativeGScore;
              fScore[neighborId] = tentativeGScore + heuristic(graph[neighborId], endLat, endLng);
          }
      }
  }
  

  const path = [];
  let current = endNodeId;
  
  if (previous[endNodeId] === null && endNodeId !== startNodeId) {
      console.warn('⚠️ No path found with A* - destination unreachable');
      return { path: [], distance: Infinity, nodesVisited };
  }
  

  while (current !== null) {
      path.unshift(current);
      current = previous[current];
  }
  
  const finalDistance = gScore[endNodeId];
  console.log(`✅ A* complete: ${path.length} nodes, ${finalDistance.toFixed(2)}km, visited ${nodesVisited} nodes`);
  
  return { 
      path, 
      distance: finalDistance, 
      nodesVisited 
  };
}

function heuristic(node, endLat, endLng) {
  return haversineDistance(node.lat, node.lng, endLat, endLng);
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371; // Earth's radius in km
  
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;
  
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


function aStarShortestPath(startNodeId, endNodeId) {
  const result = aStar(graph, startNodeId, endNodeId);
  return {
      path: result.path,
      distance: result.distance
  };
}



console.log('📚 A* algorithm module loaded');