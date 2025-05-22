document.addEventListener('DOMContentLoaded', function() {
  
    const dijkstraMap = L.map('dijkstraMap').setView([51.505, -0.09], 13);
    const astarMap = L.map('astarMap').setView([51.505, -0.09], 13);
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(dijkstraMap);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(astarMap);
    
   
    let sourceLocation = localStorage.getItem('travelMateSourceLocation');
    let destLocation = localStorage.getItem('travelMateDestLocation');
    let transportMode = localStorage.getItem('travelMateTransportMode') || 'driving';
    
    console.log('=== COMPARE PAGE DEBUG ===');
    console.log('Source:', sourceLocation);
    console.log('Destination:', destLocation);
    console.log('Transport:', transportMode);
    
   
    let source = null;
    let destination = null;
    
    try {
        if (sourceLocation) source = JSON.parse(sourceLocation);
        if (destLocation) destination = JSON.parse(destLocation);
    } catch (e) {
        console.error("Error parsing location data:", e);
    }
    
    // Update transport mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        if (btn.dataset.mode === transportMode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    //check whether destination and source are specified or not 
    if (!source || !destination) {
        document.querySelector('.comparison-container').innerHTML = 
            '<div class="error-message">No source or destination specified. Please select locations on the main map first.</div>';
        return;
    }
    
    // Update location display
    document.querySelector('#sourceDisplay span').textContent = `${source.lat.toFixed(4)}, ${source.lng.toFixed(4)}`;
    document.querySelector('#destinationDisplay span').textContent = `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`;
    
    // Create source and destination markers
    const sourceMarker = L.marker([source.lat, source.lng], { title: 'Source' }).addTo(dijkstraMap);
    const destMarker = L.marker([destination.lat, destination.lng], { title: 'Destination' }).addTo(dijkstraMap);
    
    const sourceMarkerAStar = L.marker([source.lat, source.lng], { title: 'Source' }).addTo(astarMap);
    const destMarkerAStar = L.marker([destination.lat, destination.lng], { title: 'Destination' }).addTo(astarMap);
    
    // Fit bounds to show both markers
    const bounds = L.latLngBounds([source.lat, source.lng], [destination.lat, destination.lng]).pad(0.1);
    dijkstraMap.fitBounds(bounds);
    astarMap.fitBounds(bounds);
    
    // Variables for animation control
    let animationInProgress = false;
    let animationSpeed = 5;
    let dijkstraResult = null;
    let astarResult = null;
    let currentNodeIndex = 0;
    let pathNodeIndex = 0;
    
    //Elements for Animation 
    let dijkstraVisitedCircles = [];
    let astarVisitedCircles = [];
    let dijkstraPathLine = null;
    let astarPathLine = null;
    
    // Set up animation speed control
    document.getElementById('animationSpeed').addEventListener('input', function(e) {
        animationSpeed = parseInt(e.target.value);
    });
    
    // Create graph from haldwaniData (same as in index.js)
    let graph = {};
    
    function createGraph() {
        // Initialize nodes
        haldwaniData.nodes.forEach(node => {
            graph[node.id] = {
                name: node.name,
                lat: node.lat,
                lng: node.lng,
                neighbors: []
            };
        });
        
        // Add edges (connections between nodes)
        haldwaniData.edges.forEach(edge => {
            // Add bidirectional edges
            graph[edge.source].neighbors.push({
                id: edge.target,
                distance: edge.distance
            });
            
            graph[edge.target].neighbors.push({
                id: edge.source,
                distance: edge.distance
            });
        });
    }
    
    // Find nearest node to a given position
    function findNearestNode(position) {
        let nearestNode = null;
        let minDistance = Infinity;
        
        haldwaniData.nodes.forEach(node => {
            const distance = getDistance(
                { lat: position.lat, lng: position.lng },
                { lat: node.lat, lng: node.lng }
            );
            
            if (distance < minDistance) {
                minDistance = distance;
                nearestNode = node;
            }
        });
        
        return nearestNode;
    }
    
    // Calculate distance between two points
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
    
    // Dijkstra's Algorithm Implementation
    function dijkstraAlgorithm(sourceNodeId, targetNodeId) {
        const distances = {};
        const previous = {};
        const visited = {};
        const visitedOrder = [];
        const queue = [];
        
        // Initialize distances
        Object.keys(graph).forEach(nodeId => {
            distances[nodeId] = Infinity;
            previous[nodeId] = null;
        });
        
        distances[sourceNodeId] = 0;
        queue.push({ nodeId: sourceNodeId, distance: 0 });
        
        while (queue.length > 0) {
            // Sort queue by distance and get the closest node
            queue.sort((a, b) => a.distance - b.distance);
            const current = queue.shift();
            const currentNodeId = current.nodeId;
            
            if (visited[currentNodeId]) continue;
            
            visited[currentNodeId] = true;
            visitedOrder.push(currentNodeId);
            
            // If we reached the target, we can stop
            if (currentNodeId === targetNodeId) break;
            
            // Check all neighbors
            graph[currentNodeId].neighbors.forEach(neighbor => {
                if (!visited[neighbor.id]) {
                    const newDistance = distances[currentNodeId] + neighbor.distance;
                    
                    if (newDistance < distances[neighbor.id]) {
                        distances[neighbor.id] = newDistance;
                        previous[neighbor.id] = currentNodeId;
                        queue.push({ nodeId: neighbor.id, distance: newDistance });
                    }
                }
            });
        }
        
        // Reconstruct path
        const path = [];
        let current = targetNodeId;
        while (current !== null) {
            path.unshift(current);
            current = previous[current];
        }
        
        return {
            path: path,
            visitedOrder: visitedOrder,
            distance: distances[targetNodeId],
            nodesVisited: visitedOrder.length
        };
    }
    
    // A* Algorithm Implementation
    function astarAlgorithm(sourceNodeId, targetNodeId) {
        const gScore = {};
        const fScore = {};
        const previous = {};
        const visited = {};
        const visitedOrder = [];
        const openSet = [];
        
        // Initialize scores
        Object.keys(graph).forEach(nodeId => {
            gScore[nodeId] = Infinity;
            fScore[nodeId] = Infinity;
            previous[nodeId] = null;
        });
        
        gScore[sourceNodeId] = 0;
        fScore[sourceNodeId] = heuristic(sourceNodeId, targetNodeId);
        openSet.push({ nodeId: sourceNodeId, fScore: fScore[sourceNodeId] });
        
        while (openSet.length > 0) {
            // Sort by fScore and get the node with lowest fScore
            openSet.sort((a, b) => a.fScore - b.fScore);
            const current = openSet.shift();
            const currentNodeId = current.nodeId;
            
            if (visited[currentNodeId]) continue;
            
            visited[currentNodeId] = true;
            visitedOrder.push(currentNodeId);
            
            // If we reached the target, we can stop
            if (currentNodeId === targetNodeId) break;
            
            // Check all neighbors
            graph[currentNodeId].neighbors.forEach(neighbor => {
                if (!visited[neighbor.id]) {
                    const tentativeGScore = gScore[currentNodeId] + neighbor.distance;
                    
                    if (tentativeGScore < gScore[neighbor.id]) {
                        previous[neighbor.id] = currentNodeId;
                        gScore[neighbor.id] = tentativeGScore;
                        fScore[neighbor.id] = gScore[neighbor.id] + heuristic(neighbor.id, targetNodeId);
                        
                        // Add to open set if not already there
                        if (!openSet.find(item => item.nodeId === neighbor.id)) {
                            openSet.push({ nodeId: neighbor.id, fScore: fScore[neighbor.id] });
                        }
                    }
                }
            });
        }
        
        // Reconstruct path
        const path = [];
        let current = targetNodeId;
        while (current !== null) {
            path.unshift(current);
            current = previous[current];
        }
        
        return {
            path: path,
            visitedOrder: visitedOrder,
            distance: gScore[targetNodeId],
            nodesVisited: visitedOrder.length
        };
    }
    
    // Heuristic function for A* (Euclidean distance)
    function heuristic(nodeId1, nodeId2) {
        const node1 = graph[nodeId1];
        const node2 = graph[nodeId2];
        return getDistance(
            { lat: node1.lat, lng: node1.lng },
            { lat: node2.lat, lng: node2.lng }
        );
    }
    
    // Run actual algorithms
    function runAlgorithms() {
        console.log('Running real algorithms...');
        
        // Find nearest nodes to source and destination
        const sourceNode = findNearestNode(source);
        const destNode = findNearestNode(destination);
        
        if (!sourceNode || !destNode) {
            console.error('Could not find nearest nodes');
            return;
        }
        
        console.log('Source node:', sourceNode.name);
        console.log('Destination node:', destNode.name);
        
        // Run Dijkstra
        console.log('Running Dijkstra...');
        dijkstraResult = dijkstraAlgorithm(sourceNode.id, destNode.id);
        console.log('Dijkstra result:', dijkstraResult);
        
        // Run A*
        console.log('Running A*...');
        astarResult = astarAlgorithm(sourceNode.id, destNode.id);
        console.log('A* result:', astarResult);
        
        // Update UI with results
        updateStats();
    }
    
    // Update statistics display
    function updateStats() {
        if (dijkstraResult) {
            document.getElementById('dijkstraDistance').textContent = `${dijkstraResult.distance.toFixed(2)} km`;
            document.getElementById('dijkstraDuration').textContent = `${Math.round(dijkstraResult.distance * 2)} min`;
            document.getElementById('dijkstraNodesVisited').textContent = dijkstraResult.nodesVisited;
            document.getElementById('dijkstraPathLength').textContent = `${dijkstraResult.path.length} nodes`;
        }
        
        if (astarResult) {
            document.getElementById('astarDistance').textContent = `${astarResult.distance.toFixed(2)} km`;
            document.getElementById('astarDuration').textContent = `${Math.round(astarResult.distance * 2)} min`;
            document.getElementById('astarNodesVisited').textContent = astarResult.nodesVisited;
            document.getElementById('astarPathLength').textContent = `${astarResult.path.length} nodes`;
        }
    }
    
    // Animation functions
    function resetAnimation() {
        // Clear previous animation elements
        dijkstraVisitedCircles.forEach(circle => dijkstraMap.removeLayer(circle));
        astarVisitedCircles.forEach(circle => astarMap.removeLayer(circle));
        
        if (dijkstraPathLine) dijkstraMap.removeLayer(dijkstraPathLine);
        if (astarPathLine) astarMap.removeLayer(astarPathLine);
        
        dijkstraVisitedCircles = [];
        astarVisitedCircles = [];
        currentNodeIndex = 0;
        pathNodeIndex = 0;
        animationInProgress = false;
        
        document.getElementById('playBtn').textContent = '▶ Play Animation';
    }
    
    function animateAlgorithms() {
        if (!dijkstraResult || !astarResult) {
            alert('Please wait for algorithms to complete');
            return;
        }
        
        if (!animationInProgress) {
            animationInProgress = true;
            document.getElementById('playBtn').textContent = '⏸ Pause Animation';
            animateNextStep();
        } else {
            animationInProgress = false;
            document.getElementById('playBtn').textContent = '▶ Resume Animation';
        }
    }
    
    function animateNextStep() {
        if (!animationInProgress) return;
        
        const maxVisited = Math.max(dijkstraResult.visitedOrder.length, astarResult.visitedOrder.length);
        
        // Add visited nodes
        if (currentNodeIndex < maxVisited) {
            // Dijkstra visited nodes
            if (currentNodeIndex < dijkstraResult.visitedOrder.length) {
                const nodeId = dijkstraResult.visitedOrder[currentNodeIndex];
                const node = graph[nodeId];
                const circle = L.circle([node.lat, node.lng], {
                    color: 'blue',
                    fillColor: '#3388ff',
                    fillOpacity: 0.5,
                    radius: 50
                }).addTo(dijkstraMap);
                dijkstraVisitedCircles.push(circle);
            }
            
            // A* visited nodes
            if (currentNodeIndex < astarResult.visitedOrder.length) {
                const nodeId = astarResult.visitedOrder[currentNodeIndex];
                const node = graph[nodeId];
                const circle = L.circle([node.lat, node.lng], {
                    color: 'green',
                    fillColor: '#33cc33',
                    fillOpacity: 0.5,
                    radius: 50
                }).addTo(astarMap);
                astarVisitedCircles.push(circle);
            }
            
            currentNodeIndex++;
            setTimeout(animateNextStep, Math.max(1, 11 - animationSpeed) * 50);
        }
        // After all nodes visited, show the path
        else if (pathNodeIndex === 0) {
            pathNodeIndex = 1;
            setTimeout(animateNextStep, 500);
        }
        // Animate path
        else if (pathNodeIndex <= Math.max(dijkstraResult.path.length, astarResult.path.length)) {
            // Draw Dijkstra path
            if (pathNodeIndex <= dijkstraResult.path.length) {
                const pathSegment = dijkstraResult.path.slice(0, pathNodeIndex).map(nodeId => {
                    const node = graph[nodeId];
                    return [node.lat, node.lng];
                });
                
                if (dijkstraPathLine) dijkstraMap.removeLayer(dijkstraPathLine);
                dijkstraPathLine = L.polyline(pathSegment, {color: 'red', weight: 4}).addTo(dijkstraMap);
            }
            
            // Draw A* path
            if (pathNodeIndex <= astarResult.path.length) {
                const pathSegment = astarResult.path.slice(0, pathNodeIndex).map(nodeId => {
                    const node = graph[nodeId];
                    return [node.lat, node.lng];
                });
                
                if (astarPathLine) astarMap.removeLayer(astarPathLine);
                astarPathLine = L.polyline(pathSegment, {color: 'red', weight: 4}).addTo(astarMap);
            }
            
            pathNodeIndex++;
            setTimeout(animateNextStep, Math.max(1, 11 - animationSpeed) * 80);
        }
        else {
            // Animation complete
            animationInProgress = false;
            document.getElementById('playBtn').textContent = '▶ Replay Animation';
        }
    }
    
    // Set up event listeners
    document.getElementById('playBtn').addEventListener('click', animateAlgorithms);
    document.getElementById('resetAnimationBtn').addEventListener('click', resetAnimation);
    
    // Transport mode button handlers
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            transportMode = this.dataset.mode;
            
            // Update active button
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Store the selected mode
            localStorage.setItem('travelMateTransportMode', transportMode);
            
            // Re-run algorithms with new mode
            runAlgorithms();
        });
    });
    
    // Initialize everything
    createGraph();
    runAlgorithms();
});