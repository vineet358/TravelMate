// ========================================
// A* ALGORITHM IMPLEMENTATION
// ========================================

/**
 * A* algorithm for finding shortest path between two nodes
 * Uses Euclidean distance as heuristic function
 * @param {Object} graph - The graph object with nodes and neighbors
 * @param {string} startNodeId - Starting node ID
 * @param {string} endNodeId - Ending node ID
 * @returns {Object} - {path: Array, distance: number, nodesVisited: number}
 */
function aStar(graph, startNodeId, endNodeId) {
  console.log(`⭐ Running A* algorithm from ${startNodeId} to ${endNodeId}`);
  
  // Validate inputs
  if (!graph || !graph[startNodeId] || !graph[endNodeId]) {
      console.error('❌ Invalid graph or node IDs for A*');
      return { path: [], distance: Infinity, nodesVisited: 0 };
  }
  
  // Get destination coordinates for heuristic calculation
  const endNode = graph[endNodeId];
  const endLat = endNode.lat;
  const endLng = endNode.lng;
  
  // Initialize data structures
  const openSet = new Set([startNodeId]);
  const closedSet = new Set();
  const gScore = {}; // Cost from start to node
  const fScore = {}; // gScore + heuristic
  const previous = {};
  let nodesVisited = 0;
  
  // Initialize all g-scores as Infinity
  Object.keys(graph).forEach(nodeId => {
      gScore[nodeId] = Infinity;
      fScore[nodeId] = Infinity;
      previous[nodeId] = null;
  });
  
  // Starting node has g-score 0
  gScore[startNodeId] = 0;
  fScore[startNodeId] = heuristic(graph[startNodeId], endLat, endLng);
  
  // Main algorithm loop
  while (openSet.size > 0) {
      // Find node in openSet with lowest fScore
      let currentNodeId = null;
      let lowestFScore = Infinity;
      
      for (const nodeId of openSet) {
          if (fScore[nodeId] < lowestFScore) {
              lowestFScore = fScore[nodeId];
              currentNodeId = nodeId;
          }
      }
      
      // If we've reached the destination
      if (currentNodeId === endNodeId) {
          console.log('✅ A* reached destination');
          break;
      }
      
      // Move current node from open to closed set
      openSet.delete(currentNodeId);
      closedSet.add(currentNodeId);
      nodesVisited++;
      
      // Check all neighbors
      const currentNode = graph[currentNodeId];
      if (currentNode && currentNode.neighbors) {
          for (const neighbor of currentNode.neighbors) {
              const neighborId = neighbor.id;
              
              // Skip if neighbor is in closed set
              if (closedSet.has(neighborId)) {
                  continue;
              }
              
              // Calculate tentative g-score
              const tentativeGScore = gScore[currentNodeId] + neighbor.distance;
              
              // Add neighbor to open set if not already there
              if (!openSet.has(neighborId)) {
                  openSet.add(neighborId);
              }
              
              // Skip if this path is not better
              if (tentativeGScore >= gScore[neighborId]) {
                  continue;
              }
              
              // This path is better, record it
              previous[neighborId] = currentNodeId;
              gScore[neighborId] = tentativeGScore;
              fScore[neighborId] = tentativeGScore + heuristic(graph[neighborId], endLat, endLng);
          }
      }
  }
  
  // Reconstruct path
  const path = [];
  let current = endNodeId;
  
  // Check if destination is reachable
  if (previous[endNodeId] === null && endNodeId !== startNodeId) {
      console.warn('⚠️ No path found with A* - destination unreachable');
      return { path: [], distance: Infinity, nodesVisited };
  }
  
  // Build path backwards
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

/**
* Heuristic function using Haversine distance
* @param {Object} node - Current node with lat/lng properties
* @param {number} endLat - Destination latitude
* @param {number} endLng - Destination longitude
* @returns {number} - Estimated distance in km
*/
function heuristic(node, endLat, endLng) {
  return haversineDistance(node.lat, node.lng, endLat, endLng);
}

/**
* Calculate Haversine distance between two points
* @param {number} lat1 - First point latitude
* @param {number} lng1 - First point longitude
* @param {number} lat2 - Second point latitude
* @param {number} lng2 - Second point longitude
* @returns {number} - Distance in kilometers
*/
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

/**
* Alternative A* implementation for different use cases
* @param {string} startNodeId - Starting node ID
* @param {string} endNodeId - Ending node ID
* @returns {Object} - {path: Array, distance: number}
*/
function aStarShortestPath(startNodeId, endNodeId) {
  const result = aStar(graph, startNodeId, endNodeId);
  return {
      path: result.path,
      distance: result.distance
  };
}



console.log('📚 A* algorithm module loaded');