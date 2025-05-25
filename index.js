//index.js//
// ========================================
// GLOBAL VARIABLES
// ========================================
let map;
let graph = {};
let routeLayer;
let sourceMarker = null;
let destinationMarker = null;
let routingAlgorithm = 'api'; // Default routing algorithm
let currentRouteMode = 'driving'; // Default transport mode
let isSelectingSource = true; // Track which location we're selecting

// In-memory storage (replaces localStorage for Claude.ai compatibility)
let storedLocationData = {
    sourceLocation: null,
    destLocation: null,
    transportMode: 'driving'
};

// Map configuration
const HALDWANI_CENTER = [29.2183, 79.5130];
const HALDWANI_ZOOM = 13;

// Marker icons
const markerIcons = {
    source: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    destination: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    })
};

// ========================================
// INITIALIZATION
// ========================================
window.onload = function() {
    console.log('🚀 Initializing Travel Mate Application...');
    
    // Initialize map first
    initMap();
    
    // Load road data from GeoJSON and setup everything else
    loadRoadDataFromGeoJSON();
    
    // Setup event listeners
    setupEventListeners();
    
    // Set default algorithm
    setRoutingAlgorithm('api');
    
    console.log('✅ Initialization complete');
};

function setupEventListeners() {
    // Route calculation buttons
    const findPathBtn = document.getElementById('findPathBtn');
    if (findPathBtn) {
        findPathBtn.addEventListener('click', handleFindPathClick);
    }
    
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetMap);
    }
    
    const showAllBtn = document.getElementById('showAllLocationsBtn');
    if (showAllBtn) {
        showAllBtn.addEventListener('click', showAllLocations);
    }
    
    // Routing algorithm buttons
    const apiBtn = document.getElementById('apiRouteBtn');
    if (apiBtn) {
        apiBtn.addEventListener('click', () => setRoutingAlgorithm('api'));
    }
    
    const dijkstraBtn = document.getElementById('dijkstraRouteBtn');
    if (dijkstraBtn) {
        dijkstraBtn.addEventListener('click', () => setRoutingAlgorithm('dijkstra'));
    }
    
    const astarBtn = document.getElementById('astarRouteBtn');
    if (astarBtn) {
        astarBtn.addEventListener('click', () => setRoutingAlgorithm('astar'));
    }
    
    // Transport mode selection
    setupTransportModeListeners();
}

function setupTransportModeListeners() {
    const routeModeOptions = document.querySelectorAll('.route-mode-option');
    routeModeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            routeModeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update current route mode
            currentRouteMode = this.dataset.mode;
            
            // Recalculate route if both markers exist
            if (sourceMarker && destinationMarker) {
                handleFindPathClick();
            }
        });
    });
}

// ========================================
// MAP INITIALIZATION
// ========================================
function initMap() {
    console.log('🗺️ Initializing map...');
    
    // Create map instance
    map = L.map('map').setView(HALDWANI_CENTER, HALDWANI_ZOOM);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Create route layer
    routeLayer = L.layerGroup().addTo(map);
    
    // Add click event for marker placement with improved UX
    map.on('click', function(event) {
        handleMapClick(event);
    });
    
    // Add cursor styling for better UX
    map.getContainer().style.cursor = 'crosshair';
    
    console.log('✅ Map initialized');
}

function handleMapClick(event) {
    const clickedLocation = {
        lat: event.latlng.lat,
        lng: event.latlng.lng
    };
    
    // Find nearest road node
    const nearestNode = findNearestNode(clickedLocation);
    
    if (!nearestNode) {
        alert('No nearby roads found. Please click closer to a road.');
        return;
    }
    
    // Use the nearest node coordinates for better routing
    const nodeLocation = {
        lat: nearestNode.lat,
        lng: nearestNode.lng
    };
    
    if (!sourceMarker) {
        // Place source marker
        placeMarker(nodeLocation, 'source');
        updateDropdownSelection('sourceLocation', nearestNode);
        showLocationNotification('Source location set: ' + nearestNode.name, 'success');
        
        // Update map cursor for destination selection
        map.getContainer().style.cursor = 'crosshair';
        
    } else if (!destinationMarker) {
        // Place destination marker
        placeMarker(nodeLocation, 'destination');
        updateDropdownSelection('destinationLocation', nearestNode);
        showLocationNotification('Destination location set: ' + nearestNode.name, 'success');
        
        // Reset cursor
        map.getContainer().style.cursor = 'grab';
        
        // Automatically calculate route
        setTimeout(() => {
            handleFindPathClick();
        }, 500);
        
    } else {
        // Both markers exist, reset and start over
        resetMap();
        placeMarker(nodeLocation, 'source');
        updateDropdownSelection('sourceLocation', nearestNode);
        showLocationNotification('Reset map. Source location set: ' + nearestNode.name, 'info');
        
        // Update cursor for destination selection
        map.getContainer().style.cursor = 'crosshair';
    }
}

function showLocationNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `location-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ========================================
// GEOJSON LOADING AND CONVERSION
// ========================================
function loadRoadDataFromGeoJSON() {
    console.log('📥 Loading road data from roads.geojson...');
    
    fetch('roads.geojson')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('📊 GeoJSON loaded successfully');
            console.log(`📈 Processing ${data.features.length} road features...`);
            
            // Convert GeoJSON to graph format
            const { nodes, edges } = convertGeoJSONToGraph(data);
            
            // Store globally
            window.haldwaniData = { nodes, edges };
            console.log(`✅ Road network processed: ${nodes.length} nodes, ${edges.length} edges`);
            
            // Initialize graph and UI
            createGraph();
            populateLocationDropdowns();
            
            // Show success message
            showLocationNotification(`Loaded ${nodes.length} locations from Haldwani road network`, 'success');
            
        })
        .catch(error => {
            console.error('❌ Failed to load roads.geojson:', error);
            
            // Create empty fallback data
            window.haldwaniData = { nodes: [], edges: [] };
            console.log('⚠️ Using empty fallback data');
            
            createGraph();
            populateLocationDropdowns();
            
            showLocationNotification('Failed to load road data. Please check roads.geojson file.', 'error');
        });
}

function convertGeoJSONToGraph(geojson) {
    console.log(`🔄 Converting GeoJSON with ${geojson.features.length} features...`);
    
    const nodes = [];
    const edges = [];
    const coordToId = new Map();
    let nodeIdCounter = 1;
    
    // Process each feature (road segment)
    for (const feature of geojson.features) {
        if (feature.geometry.type === "LineString") {
            const coords = feature.geometry.coordinates;
            const properties = feature.properties || {};
            
            // Extract road name from various possible properties
            const roadName = properties.name || 
                           properties.highway || 
                           properties.ref || 
                           properties.addr_street ||
                           properties.tiger_name_base ||
                           "Unnamed Road";

            // Process each coordinate pair in the linestring
            for (let i = 0; i < coords.length; i++) {
                const [lng, lat] = coords[i];
                const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;

                // Add node if it doesn't exist
                if (!coordToId.has(key)) {
                    const id = "n" + nodeIdCounter++;
                    coordToId.set(key, id);
                    nodes.push({ 
                        id, 
                        name: roadName, 
                        lat: parseFloat(lat.toFixed(6)), 
                        lng: parseFloat(lng.toFixed(6)),
                        properties: properties
                    });
                }

                // Add edge to next coordinate (if exists)
                if (i < coords.length - 1) {
                    const [lng2, lat2] = coords[i + 1];
                    const key2 = `${lat2.toFixed(6)},${lng2.toFixed(6)}`;

                    // Ensure next node exists
                    if (!coordToId.has(key2)) {
                        const id = "n" + nodeIdCounter++;
                        coordToId.set(key2, id);
                        nodes.push({ 
                            id, 
                            name: roadName, 
                            lat: parseFloat(lat2.toFixed(6)), 
                            lng: parseFloat(lng2.toFixed(6)),
                            properties: properties
                        });
                    }

                    const source = coordToId.get(key);
                    const target = coordToId.get(key2);
                    const distance = haversineDistance(lat, lng, lat2, lng2);

                    // Add bidirectional edges for better routing
                    edges.push({ 
                        source, 
                        target, 
                        distance: parseFloat(distance.toFixed(3)),
                        roadName: roadName
                    });
                }
            }
        }
    }

    console.log(`✅ Conversion complete: ${nodes.length} nodes, ${edges.length} edges`);
    return { nodes, edges };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ========================================
// GRAPH CREATION
// ========================================
function createGraph() {
    if (!window.haldwaniData) {
        console.warn('⚠️ Road data not available, skipping graph creation');
        return;
    }
    
    console.log('🔗 Creating graph structure...');
    graph = {};
    
    // Initialize nodes
    haldwaniData.nodes.forEach(node => {
        graph[node.id] = {
            name: node.name,
            lat: node.lat,
            lng: node.lng,
            neighbors: []
        };
    });
    
    // Add edges (bidirectional for road networks)
    haldwaniData.edges.forEach(edge => {
        if (graph[edge.source] && graph[edge.target]) {
            // Add forward edge
            graph[edge.source].neighbors.push({
                id: edge.target,
                distance: edge.distance
            });
            
            // Add reverse edge for bidirectional roads
            graph[edge.target].neighbors.push({
                id: edge.source,
                distance: edge.distance
            });
        }
    });
    
    console.log(`✅ Graph created with ${Object.keys(graph).length} nodes`);
    
    // Make graph globally available for algorithms
    window.roadGraph = graph;
}

// ========================================
// UI POPULATION
// ========================================
function populateLocationDropdowns() {
    console.log('📋 Populating location dropdowns...');
    
    const sourceDropdown = document.getElementById('sourceLocation');
    const destinationDropdown = document.getElementById('destinationLocation');
    
    if (!sourceDropdown || !destinationDropdown) {
        console.warn('⚠️ Location dropdowns not found in DOM');
        return;
    }
    
    if (!haldwaniData || !haldwaniData.nodes || haldwaniData.nodes.length === 0) {
        console.warn('⚠️ No road data available for dropdowns');
        sourceDropdown.innerHTML = '<option value="">No locations available</option>';
        destinationDropdown.innerHTML = '<option value="">No locations available</option>';
        return;
    }
    
    // Clear existing options
    sourceDropdown.innerHTML = '<option value="">Click map to select or choose from list</option>';
    destinationDropdown.innerHTML = '<option value="">Click map to select or choose from list</option>';
    
    // Group nodes by name to avoid duplicates and get unique roads
    const uniqueLocations = new Map();
    haldwaniData.nodes.forEach(node => {
        const key = node.name.toLowerCase();
        if (!uniqueLocations.has(key) || uniqueLocations.get(key).name === "Unnamed Road") {
            uniqueLocations.set(key, node);
        }
    });
    
    // Sort locations alphabetically
    const sortedLocations = Array.from(uniqueLocations.values())
        .filter(location => location.name !== "Unnamed Road")
        .sort((a, b) => a.name.localeCompare(b.name));
    
    // Add named roads to dropdowns
    sortedLocations.forEach(location => {
        // Source dropdown
        const sourceOption = document.createElement('option');
        sourceOption.value = location.id;
        sourceOption.textContent = location.name;
        sourceDropdown.appendChild(sourceOption);
        
        // Destination dropdown
        const destOption = document.createElement('option');
        destOption.value = location.id;
        destOption.textContent = location.name;
        destinationDropdown.appendChild(destOption);
    });
    
    // Setup event listeners
    setupLocationDropdownListeners();
    
    console.log(`✅ Dropdowns populated with ${sortedLocations.length} unique roads`);
}

function setupLocationDropdownListeners() {
    const sourceDropdown = document.getElementById('sourceLocation');
    const destDropdown = document.getElementById('destinationLocation');
    
    if (sourceDropdown) {
        sourceDropdown.addEventListener('change', function() {
            if (this.value) {
                updateSelectedLocation('source', this.value);
            }
        });
    }
    
    if (destDropdown) {
        destDropdown.addEventListener('change', function() {
            if (this.value) {
                updateSelectedLocation('destination', this.value);
            }
        });
    }
}

function updateDropdownSelection(dropdownId, node) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown && node) {
        // Try to find exact match first
        for (let option of dropdown.options) {
            if (option.value === node.id) {
                dropdown.value = node.id;
                return;
            }
        }
        
        // If no exact match, try to find by name
        for (let option of dropdown.options) {
            const optionNode = haldwaniData.nodes.find(n => n.id === option.value);
            if (optionNode && optionNode.name === node.name) {
                dropdown.value = option.value;
                return;
            }
        }
    }
}

// ========================================
// LOCATION SELECTION
// ========================================
function updateSelectedLocation(type, locationId) {
    if (!locationId || !haldwaniData) return;
    
    const selectedLocation = haldwaniData.nodes.find(loc => loc.id === locationId);
    
    if (selectedLocation) {
        const position = { 
            lat: selectedLocation.lat, 
            lng: selectedLocation.lng 
        };
        
        // Place marker
        placeMarker(position, type);
        
        // Center map on selected location
        map.setView([position.lat, position.lng], 15);
        
        // Store data
        storeLocationData();
        
        // Calculate route if both markers exist
        if (sourceMarker && destinationMarker) {
            setTimeout(() => {
                handleFindPathClick();
            }, 500);
        }
        
        // Update map cursor
        updateMapCursor();
    }
}

function updateMapCursor() {
    if (!sourceMarker) {
        map.getContainer().style.cursor = 'crosshair';
    } else if (!destinationMarker) {
        map.getContainer().style.cursor = 'crosshair';
    } else {
        map.getContainer().style.cursor = 'grab';
    }
}

// ========================================
// MARKER MANAGEMENT
// ========================================
function placeMarker(position, type) {
    // Remove existing marker of same type
    if (type === 'source' && sourceMarker) {
        map.removeLayer(sourceMarker);
        sourceMarker = null;
    } else if (type === 'destination' && destinationMarker) {
        map.removeLayer(destinationMarker);
        destinationMarker = null;
    }
    
    // Create new marker
    const marker = L.marker([position.lat, position.lng], {
        icon: markerIcons[type],
        draggable: true
    }).addTo(map);
    
    // Create popup content
    const nearestNode = findNearestNode(position);
    const popupContent = createMarkerPopup(position, type, nearestNode);
    marker.bindPopup(popupContent);
    
    // Handle drag end event
    marker.on('dragend', function() {
        handleMarkerDrag(marker, type);
    });
    
    // Store marker reference
    if (type === 'source') {
        sourceMarker = marker;
    } else {
        destinationMarker = marker;
    }
    
    // Store location data
    storeLocationData();
    
    // Update cursor
    updateMapCursor();
}

function createMarkerPopup(position, type, nearestNode) {
    const popupContent = document.createElement('div');
    popupContent.className = 'info-window';
    
    const title = type === 'source' ? 'Source Location' : 'Destination Location';
    
    popupContent.innerHTML = `
        <h3>${title}</h3>
        <p><strong>Coordinates:</strong> ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</p>
    `;
    
    if (nearestNode) {
        popupContent.innerHTML += `
            <p><strong>Nearest Road:</strong> ${nearestNode.name}</p>
            <p><strong>Distance to Road:</strong> ${(getDistance(position, nearestNode) * 1000).toFixed(0)}m</p>
        `;
    }
    
    return popupContent;
}

function handleMarkerDrag(marker, type) {
    const newPos = marker.getLatLng();
    const nearestNode = findNearestNode(newPos);
    
    if (nearestNode) {
        // Snap to nearest road node for better routing
        marker.setLatLng([nearestNode.lat, nearestNode.lng]);
        
        // Update dropdown
        updateDropdownSelection(`${type}Location`, nearestNode);
        
        // Update popup
        const popupContent = createMarkerPopup(nearestNode, type, nearestNode);
        marker.setPopupContent(popupContent);
        
        showLocationNotification(`${type} snapped to: ${nearestNode.name}`, 'info');
    }
    
    // Store data and recalculate route
    storeLocationData();
    
    if (sourceMarker && destinationMarker) {
        setTimeout(() => {
            handleFindPathClick();
        }, 500);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function findNearestNode(position) {
    if (!haldwaniData || !haldwaniData.nodes) return null;
    
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

// ========================================
// DATA STORAGE (In-Memory)
// ========================================
function storeLocationData() {
    if (sourceMarker && destinationMarker) {
        try {
            const sourceLat = sourceMarker.getLatLng().lat;
            const sourceLng = sourceMarker.getLatLng().lng;
            const destLat = destinationMarker.getLatLng().lat;
            const destLng = destinationMarker.getLatLng().lng;
            
            storedLocationData.sourceLocation = {lat: sourceLat, lng: sourceLng};
            storedLocationData.destLocation = {lat: destLat, lng: destLng};
            storedLocationData.transportMode = currentRouteMode || 'driving';
            
            console.log('📄 Location data stored:', storedLocationData);
        } catch (error) {
            console.error('❌ Error storing location data:', error);
        }
    }
}

function getStoredLocationData() {
    return storedLocationData;
}

// ========================================
// ROUTING ALGORITHM SELECTION
// ========================================
function setRoutingAlgorithm(algorithm) {
    console.log(`🔧 Setting routing algorithm to: ${algorithm}`);
    
    routingAlgorithm = algorithm;
    
    // Update UI
    document.getElementById('apiRouteBtn')?.classList.remove('active');
    document.getElementById('dijkstraRouteBtn')?.classList.remove('active');
    document.getElementById('astarRouteBtn')?.classList.remove('active');
    
    const activeBtn = document.getElementById(`${algorithm}RouteBtn`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Clear existing route
    if (routeLayer) {
        routeLayer.clearLayers();
    }
    
    // Recalculate route if both markers exist
    if (sourceMarker && destinationMarker) {
        console.log(`🔄 Recalculating route with ${algorithm}`);
        handleFindPathClick();
    }
}

// ========================================
// ROUTE CALCULATION
// ========================================
function handleFindPathClick() {
    if (!sourceMarker || !destinationMarker) {
        alert('Please select both source and destination locations by clicking on the map or using the dropdowns');
        return;
    }
    
    // Show loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'block';
    }
    
    const sourcePos = sourceMarker.getLatLng();
    const destPos = destinationMarker.getLatLng();
    
    console.log(`🚗 Calculating route: ${routingAlgorithm} algorithm`);
    console.log(`📍 From: ${sourcePos.lat}, ${sourcePos.lng}`);
    console.log(`📍 To: ${destPos.lat}, ${destPos.lng}`);
    
    // Clear previous route
    routeLayer.clearLayers();
    
    // Calculate route based on selected algorithm
    switch (routingAlgorithm) {
        case 'api':
            calculateRouteWithAPI(sourcePos, destPos, currentRouteMode);
            break;
        case 'dijkstra':
            calculateRouteWithDijkstra(sourcePos, destPos);
            break;
        case 'astar':
            calculateRouteWithAStar(sourcePos, destPos);
            break;
        default:
            calculateRouteWithAPI(sourcePos, destPos, currentRouteMode);
    }
}

function calculateRouteWithAPI(sourcePos, destPos, mode) {
    const apiUrl = 'https://api.openrouteservice.org/v2/directions/';
    
    const profileMap = {
        'driving': 'driving-car',
        'walking': 'foot-walking',
        'cycling': 'cycling-regular'
    };
    
    const profile = profileMap[mode] || 'driving-car';
    const OPENROUTE_API_KEY = '5b3ce3597851110001cf62483af92f8f1bc04a3fae4b61c61b1a43e1';

    const originalUrl = `${apiUrl}${profile}?api_key=${OPENROUTE_API_KEY}&start=${sourcePos.lng},${sourcePos.lat}&end=${destPos.lng},${destPos.lat}`;
    const corsProxyUrl = 'http://localhost:8080/';
    const requestUrl = corsProxyUrl + originalUrl;
    
    console.log(`🌐 Requesting route from API: ${profile} mode`);

    fetch(requestUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ Route data received from API');
            displayRouteFromAPI(data);
        })
        .catch(error => {
            console.error('❌ API route calculation failed:', error);
            showLocationNotification(`API routing failed: ${error.message}. Using local algorithms.`, 'error');
            
            // Fallback to local algorithms
            if (routingAlgorithm === 'astar') {
                calculateRouteWithAStar(sourcePos, destPos);
            } else {
                calculateRouteWithDijkstra(sourcePos, destPos);
            }
        })
        .finally(() => {
            const loader = document.getElementById('loadingIndicator');
            if (loader) loader.style.display = 'none';
        });
}

function displayRouteFromAPI(routeData) {
    routeLayer.clearLayers();
    
    try {
        if (!routeData.features?.[0]?.geometry) {
            throw new Error('Invalid route data structure');
        }
        
        const geometry = routeData.features[0].geometry.coordinates;
        const routePoints = geometry.map(coord => [coord[1], coord[0]]);
        
        // Create route polyline
        const routePolyline = L.polyline(routePoints, {
            color: '#4285F4',
            weight: 6,
            opacity: 0.7
        }).addTo(routeLayer);
        
        // Fit map to route
        map.fitBounds(routePolyline.getBounds(), { padding: [20, 20] });
        
        // Extract route information
        const properties = routeData.features[0].properties;
        const summary = properties.summary || {};
        
        // Display route information
        displayRouteInfo({
            distance: (summary.distance / 1000).toFixed(2), // Convert to km
            duration: Math.round(summary.duration / 60), // Convert to minutes
            algorithm: 'OpenRouteService API',
            mode: currentRouteMode
        });
        
        console.log(`✅ API route displayed: ${(summary.distance / 1000).toFixed(2)}km, ${Math.round(summary.duration / 60)}min`);
        
    } catch (error) {
        console.error('❌ Error displaying API route:', error);
        showLocationNotification('Error displaying route. Using fallback algorithm.', 'error');
        
        // Fallback to local algorithms
        calculateRouteWithDijkstra(sourcePos, destPos);
    }
}

function calculateRouteWithDijkstra(sourcePos, destPos) {
    console.log('🔍 Calculating route with Dijkstra algorithm...');
    
    if (!graph || Object.keys(graph).length === 0) {
        console.error('❌ Graph not available for Dijkstra');
        showLocationNotification('Road network not loaded. Cannot calculate route.', 'error');
        hideLoadingIndicator();
        return;
    }
    
    // Find nearest nodes
    const sourceNode = findNearestNode(sourcePos);
    const destNode = findNearestNode(destPos);
    
    if (!sourceNode || !destNode) {
        console.error('❌ Could not find nearest nodes');
        showLocationNotification('Could not find nearby roads for routing.', 'error');
        hideLoadingIndicator();
        return;
    }
    
    // Run Dijkstra algorithm
    const result = dijkstra(graph, sourceNode.id, destNode.id);
    
    if (result.path.length === 0) {
        console.warn('⚠️ No path found with Dijkstra');
        showLocationNotification('No route found between selected locations.', 'error');
        hideLoadingIndicator();
        return;
    }
    
    // Display route
    displayLocalRoute(result, 'Dijkstra');
    
    console.log(`✅ Dijkstra route calculated: ${result.distance.toFixed(2)}km`);
    hideLoadingIndicator();
}

function calculateRouteWithAStar(sourcePos, destPos) {
    console.log('⭐ Calculating route with A* algorithm...');
    
    if (!graph || Object.keys(graph).length === 0) {
        console.error('❌ Graph not available for A*');
        showLocationNotification('Road network not loaded. Cannot calculate route.', 'error');
        hideLoadingIndicator();
        return;
    }
    
    // Find nearest nodes
    const sourceNode = findNearestNode(sourcePos);
    const destNode = findNearestNode(destPos);
    
    if (!sourceNode || !destNode) {
        console.error('❌ Could not find nearest nodes');
        showLocationNotification('Could not find nearby roads for routing.', 'error');
        hideLoadingIndicator();
        return;
    }
    
    // Run A* algorithm
    const result = aStar(graph, sourceNode.id, destNode.id);
    
    if (result.path.length === 0) {
        console.warn('⚠️ No path found with A*');
        showLocationNotification('No route found between selected locations.', 'error');
        hideLoadingIndicator();
        return;
    }
    
    // Display route
    displayLocalRoute(result, 'A* (A-Star)');
    
    console.log(`✅ A* route calculated: ${result.distance.toFixed(2)}km`);
    hideLoadingIndicator();
}

function displayLocalRoute(routeResult, algorithmName) {
    routeLayer.clearLayers();
    
    if (!routeResult.path || routeResult.path.length === 0) {
        console.warn('⚠️ Empty route path received');
        return;
    }
    
    // Convert node IDs to coordinates
    const routeCoordinates = routeResult.path.map(nodeId => {
        const node = graph[nodeId];
        return node ? [node.lat, node.lng] : null;
    }).filter(coord => coord !== null);
    
    if (routeCoordinates.length < 2) {
        console.warn('⚠️ Insufficient route coordinates');
        return;
    }
    
    // Create route polyline
    const routePolyline = L.polyline(routeCoordinates, {
        color: algorithmName.includes('A*') ? '#FF6B6B' : '#4ECDC4',
        weight: 5,
        opacity: 0.8
    }).addTo(routeLayer);
    
    // Add route markers for intermediate waypoints
    routeResult.path.forEach((nodeId, index) => {
        const node = graph[nodeId];
        if (node && index > 0 && index < routeResult.path.length - 1) {
            // Add small waypoint markers
            L.circleMarker([node.lat, node.lng], {
                color: '#FFF',
                fillColor: algorithmName.includes('A*') ? '#FF6B6B' : '#4ECDC4',
                weight: 2,
                radius: 4,
                fillOpacity: 0.8
            }).addTo(routeLayer);
        }
    });
    
    // Fit map to route
    map.fitBounds(routePolyline.getBounds(), { padding: [20, 20] });
    
    // Calculate estimated duration (assuming average speed)
    const avgSpeed = currentRouteMode === 'walking' ? 5 : 
                    currentRouteMode === 'cycling' ? 15 : 50; // km/h
    const estimatedDuration = Math.round((routeResult.distance / avgSpeed) * 60);
    
    // Display route information
    displayRouteInfo({
        distance: routeResult.distance.toFixed(2),
        duration: estimatedDuration,
        algorithm: algorithmName,
        mode: currentRouteMode,
        nodesVisited: routeResult.nodesVisited || routeResult.path.length
    });
}

function displayRouteInfo(routeInfo) {
    const routeInfoDiv = document.getElementById('routeInfo');
    if (!routeInfoDiv) {
        console.warn('⚠️ Route info div not found');
        return;
    }
    
    const modeEmoji = {
        'driving': '🚗',
        'walking': '🚶',
        'cycling': '🚴'
    };
    
    routeInfoDiv.innerHTML = `
        <div class="route-info-content">
            <h3>${modeEmoji[routeInfo.mode] || '🚗'} Route Information</h3>
            <div class="route-stats">
                <div class="stat-item">
                    <span class="stat-label">Distance:</span>
                    <span class="stat-value">${routeInfo.distance} km</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Duration:</span>
                    <span class="stat-value">${routeInfo.duration} min</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Algorithm:</span>
                    <span class="stat-value">${routeInfo.algorithm}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Mode:</span>
                    <span class="stat-value">${routeInfo.mode}</span>
                </div>
                ${routeInfo.nodesVisited ? `
                <div class="stat-item">
                    <span class="stat-label">Nodes:</span>
                    <span class="stat-value">${routeInfo.nodesVisited}</span>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    routeInfoDiv.style.display = 'block';
}

function hideLoadingIndicator() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }
}





// ========================================
// UTILITY FUNCTIONS
// ========================================
function resetMap() {
    console.log('🔄 Resetting map...');
    
    // Clear markers
    if (sourceMarker) {
        map.removeLayer(sourceMarker);
        sourceMarker = null;
    }
    
    if (destinationMarker) {
        map.removeLayer(destinationMarker);
        destinationMarker = null;
    }
    
    // Clear route
    if (routeLayer) {
        routeLayer.clearLayers();
    }
    
    // Clear dropdowns
    const sourceDropdown = document.getElementById('sourceLocation');
    const destDropdown = document.getElementById('destinationLocation');
    
    if (sourceDropdown) sourceDropdown.value = '';
    if (destDropdown) destDropdown.value = '';
    
    // Hide route info
    const routeInfoDiv = document.getElementById('routeInfo');
    if (routeInfoDiv) {
        routeInfoDiv.style.display = 'none';
    }
    
    // Reset cursor
    map.getContainer().style.cursor = 'crosshair';
    
    // Clear stored data
    storedLocationData = {
        sourceLocation: null,
        destLocation: null,
        transportMode: 'driving'
    };
    
    // Hide loading indicator
    hideLoadingIndicator();
    
    showLocationNotification('Map reset. Click to select new locations.', 'info');
    console.log('✅ Map reset complete');
}

function showAllLocations() {
    console.log('📍 Showing all locations on map...');
    
    if (!haldwaniData || !haldwaniData.nodes || haldwaniData.nodes.length === 0) {
        showLocationNotification('No location data available to display.', 'error');
        return;
    }
    
    // Clear existing route to show locations better
    if (routeLayer) {
        routeLayer.clearLayers();
    }
    
    // Create a temporary layer for location markers
    const locationLayer = L.layerGroup().addTo(map);
    
    // Get unique locations by name
    const uniqueLocations = new Map();
    haldwaniData.nodes.forEach(node => {
        const key = node.name.toLowerCase();
        if (!uniqueLocations.has(key) && node.name !== "Unnamed Road") {
            uniqueLocations.set(key, node);
        }
    });
    
    // Add markers for unique locations
    const locations = Array.from(uniqueLocations.values()).slice(0, 50); // Limit to 50 for performance
    
    locations.forEach(location => {
        const marker = L.circleMarker([location.lat, location.lng], {
            color: '#2196F3',
            fillColor: '#4CAF50',
            weight: 2,
            radius: 6,
            fillOpacity: 0.7
        }).addTo(locationLayer);
        
        marker.bindPopup(`
            <div class="location-popup">
                <h4>${location.name}</h4>
                <p><strong>Coordinates:</strong><br>${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}</p>
                <button onclick="selectLocationFromPopup('${location.id}', 'source')" class="popup-btn">Set as Source</button>
                <button onclick="selectLocationFromPopup('${location.id}', 'destination')" class="popup-btn">Set as Destination</button>
            </div>
        `);
    });
    
    // Fit map to show all locations
    if (locations.length > 0) {
        const group = new L.featureGroup(locationLayer.getLayers());
        map.fitBounds(group.getBounds().pad(0.1));
    }
    
    showLocationNotification(`Showing ${locations.length} unique locations. Click markers to select.`, 'success');
    
    // Auto-hide markers after 10 seconds
    setTimeout(() => {
        map.removeLayer(locationLayer);
        showLocationNotification('Location markers hidden.', 'info');
    }, 10000);
}

// Global function for popup buttons
window.selectLocationFromPopup = function(locationId, type) {
    updateSelectedLocation(type, locationId);
    
    // Close all popups
    map.eachLayer(layer => {
        if (layer.getPopup && layer.getPopup()) {
            layer.closePopup();
        }
    });
};

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .popup-btn {
        background: #2196F3;
        color: white;
        border: none;
        padding: 5px 10px;
        margin: 2px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
    }
    
    .popup-btn:hover {
        background: #1976D2;
    }
    
    .location-popup h4 {
        margin: 0 0 8px 0;
        color: #333;
    }
    
    .location-popup p {
        margin: 8px 0;
        font-size: 12px;
        color: #666;
    }
`;
document.head.appendChild(style);

console.log('🎯 Travel Mate JavaScript loaded successfully');