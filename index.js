        const HALDWANI_CENTER = [29.2183, 79.5130]; // Default center coordinates for Haldwani
        const HALDWANI_ZOOM = 14; // Default zoom level
        
        // API Keys for services
        const OPENROUTE_API_KEY = "5b3ce3597851110001cf624810c776dba3264d8f9bc9f5bb8c9fc2c5"; // Replace with your actual API key
        
        // Global variables
        let map;
        let routeLayer;
        let markers = [];
        let sourceMarker = null;
        let destinationMarker = null;
        let graph; // For storing the graph representation of the road network
        let activePOITypes = []; // For tracking active POI filters
        let currentRouteMode = "driving"; // Default route mode
        let useApiRouting=true;
        let routingAlgorithm = 'api'; // Default to API routing
        
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
            }),
            poi: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        };
        
        // POI type icons
        const poiTypeIcons = {
            restaurant: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            cafe: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            hotel: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            atm: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            hospital: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            school: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            shop: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-purple.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            place_of_worship: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            fuel: L.icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            })
        };

 // Update your window.onload function to include setupComparisonNavigation
window.onload = function() {
    console.log('Window loaded, initializing...');
    
    initMap();
    createGraph();
    populateLocationDropdowns();
    
    // Set up event listeners
    document.getElementById('findPathBtn').addEventListener('click', handleFindPathClick);
    document.getElementById('resetBtn').addEventListener('click', resetMap);
    document.getElementById('showAllLocationsBtn').addEventListener('click', showAllLocations);
    
    // Fix the routing algorithm button event listeners
    document.getElementById('apiRouteBtn').addEventListener('click', function() {
        setRoutingAlgorithm('api');
    });
    
    document.getElementById('dijkstraRouteBtn').addEventListener('click', function() {
        setRoutingAlgorithm('dijkstra');
    });
    
    // Fix the A* button ID (make sure the HTML is updated too)
    document.getElementById('astarRouteBtn').addEventListener('click', function() {
        setRoutingAlgorithm('astar');
    });

    // Location selectors change handlers
    document.getElementById('sourceLocation').addEventListener('change', function() {
        updateSelectedLocation('source', this.value);
    });
    
    document.getElementById('destinationLocation').addEventListener('change', function() {
        updateSelectedLocation('destination', this.value);
    });
    
    // Setup route mode selector
    const routeModeOptions = document.querySelectorAll('.route-mode-option');
    routeModeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            routeModeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update current route mode
            currentRouteMode = this.dataset.mode;
            
            // Recalculate route if both source and destination are set
            if (sourceMarker && destinationMarker) {
                handleFindPathClick();
            }
        });
    });
    
    // Setup POI category filters
    setupPOIFilters();
    
    // Set the default routing algorithm
    setRoutingAlgorithm('api'); // Set default algorithm on load
    
    // *** IMPORTANT: Setup comparison navigation here ***
    setupComparisonNavigation();
    
    console.log('Initialization complete');
};

// Add a backup function to automatically store data when markers are updated
function storeLocationData() {
    if (sourceMarker && destinationMarker) {
        try {
            const sourceLat = sourceMarker.getLatLng().lat;
            const sourceLng = sourceMarker.getLatLng().lng;
            const destLat = destinationMarker.getLatLng().lat;
            const destLng = destinationMarker.getLatLng().lng;
            
            localStorage.setItem('travelMateSourceLocation', 
                JSON.stringify({lat: sourceLat, lng: sourceLng}));
            localStorage.setItem('travelMateDestLocation', 
                JSON.stringify({lat: destLat, lng: destLng}));
            localStorage.setItem('travelMateTransportMode', currentRouteMode || 'driving');
            
            console.log('Location data automatically stored');
        } catch (error) {
            console.error('Error auto-storing location data:', error);
        }
    }
}


// Enhanced setRoutingAlgorithm function to fix toggling issues
function setRoutingAlgorithm(algorithm) {
    console.log('Setting routing algorithm to:', algorithm);
    
    // Update the global variable
    routingAlgorithm = algorithm;
    
    // Update UI to show active button - fix the A* button ID
    document.getElementById('apiRouteBtn').classList.remove('active');
    document.getElementById('dijkstraRouteBtn').classList.remove('active');
    document.getElementById('astarRouteBtn').classList.remove('active');
    
    // Add active class only to the selected algorithm button
    if (algorithm === 'api') {
        document.getElementById('apiRouteBtn').classList.add('active');
    } else if (algorithm === 'dijkstra') {
        document.getElementById('dijkstraRouteBtn').classList.add('active');
    } else if (algorithm === 'astar') {
        document.getElementById('astarRouteBtn').classList.add('active');
    }
    
    // Clear existing route display
    if (routeLayer) {
        routeLayer.clearLayers();
    }
    
    // Recalculate route if both source and destination are set
    if (sourceMarker && destinationMarker) {
        console.log('Recalculating route with algorithm:', algorithm);
        handleFindPathClick();
    }
}

// Enhanced handleFindPathClick function with better debugging
function handleFindPathClick() {
    // Make sure we have both source and destination
    if (!sourceMarker || !destinationMarker) {
        alert('Please select both source and destination locations');
        return;
    }
    
    // Show loading indicator
    document.getElementById('loadingIndicator').style.display = 'block';
    
    // Get source and destination positions
    const sourcePos = sourceMarker.getLatLng();
    const destPos = destinationMarker.getLatLng();
    
    console.log('Calculating route using algorithm:', routingAlgorithm);
    console.log('From:', sourcePos, 'To:', destPos);
    
    // Clear previous route
    routeLayer.clearLayers();
    
    // Use appropriate routing method based on user selection
    switch (routingAlgorithm) {
        case 'api':
            console.log('Using API routing with mode:', currentRouteMode);
            calculateRouteWithAPI(sourcePos, destPos, currentRouteMode);
            break;
        case 'dijkstra':
            console.log('Using Dijkstra algorithm');
            calculateRouteWithDijkstra(sourcePos, destPos);
            break;
        case 'astar':
            console.log('Using A* algorithm');
            calculateRouteWithAStar(sourcePos, destPos);
            break;
        default:
            // Default to API routing
            console.log('Using default API routing');
            calculateRouteWithAPI(sourcePos, destPos, currentRouteMode);
    }
}
        // Initialize the Leaflet Map centered on Haldwani
        function initMap() {
            // Create map instance
            map = L.map('map').setView(HALDWANI_CENTER, HALDWANI_ZOOM);
            
            // Add OpenStreetMap tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(map);
            
            // Create a layer group for routes
            routeLayer = L.layerGroup().addTo(map);
            
            // Add click event to the map for custom location selection
            map.on('click', function(event) {
                // If no source is selected, set it as source
                if (!sourceMarker) {
                    placeMarker(event.latlng, 'source');
                } 
                // If source is selected but no destination, set it as destination
                else if (!destinationMarker) {
                    placeMarker(event.latlng, 'destination');
                    handleFindPathClick();
                } 
                // If both are selected, reset and start over with this as source
                else {
                    resetMap();
                    placeMarker(event.latlng, 'source');
                }
            });
        }

        // Create a graph representation of the road network from haldwaniData
        function createGraph() {
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
       


// Display selected location details below the dropdowns
function displaySelectedLocationInfo(type, locationId) {
    // Get the container element for location info
    const locationInfoContainer = document.getElementById(`${type}LocationInfo`);
    
    if (!locationId || locationId === "") {
        // Clear the location info if no location is selected
        locationInfoContainer.innerHTML = "";
        locationInfoContainer.style.display = "none";
        return;
    }
    
    // Find the selected location in our data
    const selectedLocation = haldwaniData.nodes.find(loc => loc.id === locationId);
    
    if (selectedLocation) {
        // Create and display location information
        locationInfoContainer.innerHTML = `
            <div class="location-info-card">
                <h4>${selectedLocation.name}</h4>
                <p>
                    <strong>Coordinates:</strong> 
                    ${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}
                </p>
            </div>
        `;
        locationInfoContainer.style.display = "block";
    }
}

function updateSelectedLocation(type, locationId) {
    if (!locationId) return;
    
    // Find the selected location in our data
    const selectedLocation = haldwaniData.nodes.find(loc => loc.id === locationId);
    
    if (selectedLocation) {
        const position = { 
            lat: selectedLocation.lat, 
            lng: selectedLocation.lng 
        };
        
        // Place marker based on type
        placeMarker(position, type);
        
        // Center map on the selected location
        map.setView([position.lat, position.lng], 15);
        
        // Display location information below dropdown
        displaySelectedLocationInfo(type, locationId);
        
        // *** ADD THIS: Store location data automatically ***
        storeLocationData();
        
        // If both source and destination are selected, calculate route
        if (sourceMarker && destinationMarker) {
            handleFindPathClick();
        }
    }
}

// Update both dropdown event listeners to call displaySelectedLocationInfo
function setupLocationDropdowns() {
    // Source dropdown event listener
    document.getElementById('sourceLocation').addEventListener('change', function() {
        const selectedLocationId = this.value;
        updateSelectedLocation('source', selectedLocationId);
    });
    
    // Destination dropdown event listener
    document.getElementById('destinationLocation').addEventListener('change', function() {
        const selectedLocationId = this.value;
        updateSelectedLocation('destination', selectedLocationId);
    });
}

// Modify the populateLocationDropdowns function to also create info containers
function populateLocationDropdowns() {
    const sourceDropdown = document.getElementById('sourceLocation');
    const destinationDropdown = document.getElementById('destinationLocation');
    
    // Clear existing options
    sourceDropdown.innerHTML = '<option value="">Select Source Location</option>';
    destinationDropdown.innerHTML = '<option value="">Select Destination Location</option>';
    
    // Add locations from the data file
    haldwaniData.nodes.forEach(location => {
        // Create options for source dropdown
        const sourceOption = document.createElement('option');
        sourceOption.value = location.id;
        sourceOption.textContent = location.name;
        sourceDropdown.appendChild(sourceOption);
        
        // Create options for destination dropdown
        const destOption = document.createElement('option');
        destOption.value = location.id;
        destOption.textContent = location.name;
        destinationDropdown.appendChild(destOption);
    });
    
    // Create containers for location information if they don't exist
    if (!document.getElementById('sourceLocationInfo')) {
        const sourceInfoContainer = document.createElement('div');
        sourceInfoContainer.id = 'sourceLocationInfo';
        sourceInfoContainer.className = 'location-info-container';
        sourceInfoContainer.style.display = 'none';
        sourceDropdown.parentNode.insertBefore(sourceInfoContainer, sourceDropdown.nextSibling);
    }
    
    if (!document.getElementById('destinationLocationInfo')) {
        const destInfoContainer = document.createElement('div');
        destInfoContainer.id = 'destinationLocationInfo';
        destInfoContainer.className = 'location-info-container';
        destInfoContainer.style.display = 'none';
        destinationDropdown.parentNode.insertBefore(destInfoContainer, destinationDropdown.nextSibling);
    }
    
    // Setup event listeners for dropdowns
    setupLocationDropdowns();
}

// Modify placeMarker to update location info when a marker is placed or dragged
function placeMarker(position, type) {
    // Remove previous marker of the same type if it exists
    if (type === 'source' && sourceMarker) {
        map.removeLayer(sourceMarker);
        sourceMarker = null;
    } else if (type === 'destination' && destinationMarker) {
        map.removeLayer(destinationMarker);
        destinationMarker = null;
    }
    
    // Create the marker with appropriate icon
    const marker = L.marker([position.lat, position.lng], {
        icon: markerIcons[type],
        draggable: true // Make markers draggable
    }).addTo(map);
    
    const popupContent = document.createElement('div');
    popupContent.className = 'info-window';
    
    // Add content based on type
    if (type === 'source') {
        popupContent.innerHTML = `
            <h3>Source Location</h3>
            <p>Latitude: ${position.lat.toFixed(6)}</p>
            <p>Longitude: ${position.lng.toFixed(6)}</p>
        `;
        
        // Find nearest known location
        const nearestNode = findNearestNode(position);
        if (nearestNode) {
            popupContent.innerHTML += `
                <p>Nearest location: ${nearestNode.name}</p>
                <button class="snap-to-location" data-id="${nearestNode.id}" data-type="source">Snap to ${nearestNode.name}</button>
            `;
        }
    } else {
        popupContent.innerHTML = `
            <h3>Destination Location</h3>
            <p>Latitude: ${position.lat.toFixed(6)}</p>
            <p>Longitude: ${position.lng.toFixed(6)}</p>
        `;
        
        // Find nearest known location
        const nearestNode = findNearestNode(position);
        if (nearestNode) {
            popupContent.innerHTML += `
                <p>Nearest location: ${nearestNode.name}</p>
                <button class="snap-to-location" data-id="${nearestNode.id}" data-type="destination">Snap to ${nearestNode.name}</button>
            `;
        }
        setTimeout(storeLocationData, 100);
    }
    
    // Bind the popup to the marker
    marker.bindPopup(popupContent);
    
    // Add event listener for the snap button (will be added when popup is opened)
    marker.on('popupopen', function() {
        const snapButton = document.querySelector('.snap-to-location');
        if (snapButton) {
            snapButton.addEventListener('click', function() {
                const nodeId = this.dataset.id;
                const markerType = this.dataset.type;
                const node = haldwaniData.nodes.find(n => n.id === nodeId);
                
                // Update dropdown selection
                document.getElementById(`${markerType}Location`).value = nodeId;
                
                // Update marker position
                updateSelectedLocation(markerType, nodeId);
                
                // Close popup
                marker.closePopup();
            });
        }
    });
    
    // Handle marker drag end event
    marker.on('dragend', function() {
        const newPos = marker.getLatLng();
        
        // Update location info with custom coordinates
        const locationInfoContainer = document.getElementById(`${type}LocationInfo`);
        locationInfoContainer.innerHTML = `
            <div class="location-info-card">
                <h4>Custom Location</h4>
                <p>
                    <strong>Coordinates:</strong> 
                    ${newPos.lat.toFixed(6)}, ${newPos.lng.toFixed(6)}
                </p>
            </div>
        `;
        locationInfoContainer.style.display = "block";
        
        // Clear dropdown selection
        document.getElementById(`${type}Location`).value = '';
        
        // Recalculate route if both markers are present
        if (sourceMarker && destinationMarker) {
            handleFindPathClick();
        }
    });
    
    // Store the marker in appropriate variable
    if (type === 'source') {
        sourceMarker = marker;
        
        // If custom location (not from dropdown), show custom location info
        if (document.getElementById('sourceLocation').value === '') {
            const locationInfoContainer = document.getElementById('sourceLocationInfo');
            locationInfoContainer.innerHTML = `
                <div class="location-info-card">
                    <h4>Custom Location</h4>
                    <p>
                        <strong>Coordinates:</strong> 
                        ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}
                    </p>
                </div>
            `;
            locationInfoContainer.style.display = "block";
        }
    } else {
        destinationMarker = marker;
        
        // If custom location (not from dropdown), show custom location info
        if (document.getElementById('destinationLocation').value === '') {
            const locationInfoContainer = document.getElementById('destinationLocationInfo');
            locationInfoContainer.innerHTML = `
                <div class="location-info-card">
                    <h4>Custom Location</h4>
                    <p>
                        <strong>Coordinates:</strong> 
                        ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}
                    </p>
                </div>
            `;
            locationInfoContainer.style.display = "block";
        }
    }
}

        // Find the nearest node in our data to the given position
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

        // Calculate distance between two points in km using the Haversine formula
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
        function calculateRouteWithAPI(sourcePos, destPos, mode) {
    // API endpoint
    const apiUrl = 'https://api.openrouteservice.org/v2/directions/';
    
    // Map route modes to ORS profiles
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
    
    console.log(`Requesting route from OpenRouteService: ${profile} mode`);

    // Make the API request
    fetch(requestUrl)
        .then(response => {
            if (!response.ok) {
                console.error(`API responded with status: ${response.status}`);
                return response.text().then(text => {
                    console.error(`API error response: ${text}`);
                    throw new Error(`HTTP error! Status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Successfully received route data from API');
            // Display the route on the map
            displayRouteFromAPI(data);
        })
        .catch(error => {
            console.error('Error fetching route:', error);
            alert(`Failed to get route: ${error.message}. Falling back to local calculation.`);
            
                // Determine which algorithm to use as fallback
                if (routingAlgorithm === 'astar') {
                    calculateRouteWithAStar(sourcePos, destPos);
                } else {
                    calculateRouteWithDijkstra(sourcePos, destPos);
                }
            })
        .finally(() => {
            // Hide loading indicator if any
            const loader = document.getElementById('loadingIndicator');
            if (loader) loader.style.display = 'none';
        });
}


function displayRouteFromAPI(routeData) {
    // Clear previous route
    routeLayer.clearLayers();
    
    try {
        console.log('Route data:', routeData);
        
        if (!routeData.features || !routeData.features[0] || !routeData.features[0].geometry) {
            throw new Error('Invalid route data structure received from API');
        }
        
        // Extract route geometry from the response
        const geometry = routeData.features[0].geometry.coordinates;
        
        console.log(`Route has ${geometry.length} coordinate points`);
        
        // Convert to Leaflet format (swap lat and lng)
        const routePoints = geometry.map(coord => [coord[1], coord[0]]);
        
        // Create polyline with route
        const routePolyline = L.polyline(routePoints, {
            color: '#4285F4',
            weight: 6,
            opacity: 0.7
        }).addTo(routeLayer);
        
        // Zoom map to fit the route
        map.fitBounds(routePolyline.getBounds(), {
            padding: [50, 50]
        });
        
        // Extract route summary
        const summary = routeData.features[0].properties.summary;
        
        // Display route information
        displayRouteInfo({
            distance: summary.distance / 1000, // Convert to km
            duration: summary.duration / 60,   // Convert to minutes
            points: routePoints
        });
        
        // Fetch POIs along the route
        fetchPOIsAlongRoute(routePoints);
        
    } catch (error) {
        console.error('Error processing route data:', error);
        alert('Error processing route data. Please try again.');
    }
}

        function displayRoute(routeData) {
            // Clear previous route
            routeLayer.clearLayers();
            
            // Create polyline from route points
            const routePolyline = L.polyline(routeData.points, {
                color: '#4285F4',
                weight: 6,
                opacity: 0.7
            }).addTo(routeLayer);
            
            // Zoom map to fit the route
            map.fitBounds(routePolyline.getBounds(), {
                padding: [50, 50]
            });
            
            // Display route information
            displayRouteInfo(routeData);
            
            // Fetch POIs along the route
            fetchPOIsAlongRoute(routeData.points);
        }

        // Display route information in the sidebar
        function displayRouteInfo(routeData) {
            const routeInfoDiv = document.getElementById('routeInfo');
            
            // Format distance and duration
            const distance = routeData.distance.toFixed(2);
            
            // Get hours and minutes from duration (in minutes)
            const hours = Math.floor(routeData.duration / 60);
            const minutes = Math.round(routeData.duration % 60);
            let durationStr = '';
            
            if (hours > 0) {
                durationStr += `${hours} hour${hours > 1 ? 's' : ''} `;
            }
            
            if (minutes > 0 || hours === 0) {
                durationStr += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
            }
            
            // Get travel mode
            const modeStr = currentRouteMode.charAt(0).toUpperCase() + currentRouteMode.slice(1);
            
            // Create HTML for route info
            routeInfoDiv.innerHTML = `
                <div class="route-detail">
                    <h3>Route Information</h3>
                    <p><strong>Distance:</strong> ${distance} km</p>
                    <p><strong>Estimated Duration:</strong> ${durationStr}</p>
                    <p><strong>Travel Mode:</strong> ${modeStr}</p>
                </div>
            `;
        }

   



// Add the synthetic POI generation function back as a fallback
function generateSyntheticPOIs(routePoints, poiTypes) {
    const pois = [];
    const numPOIs = Math.floor(Math.random() * 10) + 5; // Generate 5-15 POIs
    
    // POI name templates based on type
    const poiNameTemplates = {
        restaurant: ['Tasty', 'Spicy', 'Royal', 'Delicious', 'Golden'],
        cafe: ['Coffee', 'Chai', 'Tea', 'Mountain', 'Cozy'],
        hotel: ['Comfort', 'Luxury', 'Grand', 'Royal', 'Paradise'],
        atm: ['State Bank', 'ICICI', 'HDFC', 'PNB', 'Axis'],
        hospital: ['City', 'General', 'Memorial', 'Care', 'Medical'],
        school: ['Public', 'International', 'Modern', 'St. Mary', 'Central'],
        shop: ['Mega', 'Super', 'City', 'Grand', 'Discount'],
        place_of_worship: ['Temple', 'Church', 'Mosque', 'Gurudwara', 'Shrine'],
        fuel: ['HP', 'Indian Oil', 'Bharat', 'Reliance', 'Essar']
    };
    
    // POI suffix templates based on type
    const poiSuffixTemplates = {
        restaurant: ['Restaurant', 'Dhaba', 'Food Corner', 'Kitchen', 'Eatery'],
        cafe: ['Cafe', 'Coffee House', 'Tea House', 'Bistro', 'Lounge'],
        hotel: ['Hotel', 'Inn', 'Resort', 'Lodge', 'Homestay'],
        atm: ['ATM', 'Bank ATM', 'Cash Point', 'Money Center', 'Banking Point'],
        hospital: ['Hospital', 'Clinic', 'Medical Center', 'Healthcare', 'Nursing Home'],
        school: ['School', 'Academy', 'Institute', 'College', 'Education Center'],
        shop: ['Store', 'Mart', 'Market', 'Shop', 'Emporium'],
        place_of_worship: ['Temple', 'Church', 'Mosque', 'Gurudwara', 'Shrine'],
        fuel: ['Petrol Pump', 'Gas Station', 'Fuel Station', 'Petrol Station', 'Filling Station']
    };
    
    // Generate POIs
    for (let i = 0; i < numPOIs; i++) {
        // Pick a random POI type from the list
        const poiType = poiTypes[Math.floor(Math.random() * poiTypes.length)];
        
        // Pick a random point along the route
        const routePoint = routePoints[Math.floor(Math.random() * routePoints.length)];
        
        // Add some random offset
        const lat = routePoint[0] + (Math.random() - 0.5) * 0.01;
        const lng = routePoint[1] + (Math.random() - 0.5) * 0.01;
        
        // Generate a random name
        const prefix = (poiNameTemplates[poiType] || ['Local'])[Math.floor(Math.random() * (poiNameTemplates[poiType] || ['Local']).length)];
        const suffix = (poiSuffixTemplates[poiType] || ['Place'])[Math.floor(Math.random() * (poiSuffixTemplates[poiType] || ['Place']).length)];
        
        // Create POI object
        pois.push({
            id: `poi-synthetic-${i}`,
            name: `${prefix} ${suffix}`,
            type: poiType,
            lat: lat,
            lng: lng,
            address: `${Math.floor(Math.random() * 100) + 1} ${['Main Road', 'Mall Road', 'Nainital Road', 'Railway Road', 'MG Road'][Math.floor(Math.random() * 5)]}, Nearby`,
            rating: (Math.random() * 2 + 3).toFixed(1) // Random rating between 3.0 and 5.0
        });
    }
    
    return pois;
}
     // Fetch POIs along the route
function fetchPOIsAlongRoute(routePoints) {
    // Clear previous POIs
    document.getElementById('poiContainer').innerHTML = '<div class="poi-loading">Loading nearby points of interest...</div>';
    
    // Remove previous POI markers
    markers.forEach(marker => {
        if (marker !== sourceMarker && marker !== destinationMarker) {
            map.removeLayer(marker);
        }
    });
    
    // Keep only source and destination markers
    markers = markers.filter(marker => marker === sourceMarker || marker === destinationMarker);
    
    // Define POI types to search for - limit to only the 5 specific types we want
    const poiTypesToSearch = ['restaurant', 'cafe', 'hotel', 'hospital', 'school', 'atm'];
    
    // Get source and destination positions for proximity filtering later
    const sourcePos = sourceMarker.getLatLng();
    const destPos = destinationMarker.getLatLng();
    
    // Find min and max coordinates to define the search area
    // Create a tighter bounding box by using route points plus source and destination
    let minLat = Math.min(sourcePos.lat, destPos.lat);
    let maxLat = Math.max(sourcePos.lat, destPos.lat);
    let minLng = Math.min(sourcePos.lng, destPos.lng);
    let maxLng = Math.max(sourcePos.lng, destPos.lng);
    
    // Include route points in the bounding box
    routePoints.forEach(point => {
        minLat = Math.min(minLat, point[0]);
        maxLat = Math.max(maxLat, point[0]);
        minLng = Math.min(minLng, point[1]);
        maxLng = Math.max(maxLng, point[1]);
    });
    
    // Add a smaller buffer (in degrees) to keep POIs closer to route
    const buffer = 0.001; // Roughly 100-200m - smaller than before
    minLat -= buffer;
    maxLat += buffer;
    minLng -= buffer;
    maxLng += buffer;
    
    // Create Overpass API query
    const overpassQuery = buildOverpassQuery(minLat, minLng, maxLat, maxLng, poiTypesToSearch);
    
    console.log("Overpass Query:", overpassQuery);
    
    // Store route and endpoints for filtering
    const routeData = {
        route: routePoints,
        sourcePos: sourcePos,
        destPos: destPos
    };
    
    // Fetch data from Overpass API
    fetchOverpassData(overpassQuery)
        .then(pois => {
            console.log("Retrieved POIs:", pois);
            // Filter POIs by proximity to route before displaying
            const filteredPois = filterPOIsByProximity(pois, routeData);
            displayPOIs(filteredPois);
        })
        .catch(error => {
            console.error('Error fetching POIs:', error);
            document.getElementById('poiContainer').innerHTML = 
                '<div class="poi-loading">Error loading points of interest. Please try again.</div>';
            
            // Fallback to synthetic POIs for demo purposes
            console.log("Falling back to synthetic POIs for demo");
            const syntheticPois = generateSyntheticPOIs(routePoints, poiTypesToSearch);
            const filteredSyntheticPois = filterPOIsByProximity(syntheticPois, routeData);
            displayPOIs(filteredSyntheticPois);
        });
}

// Filter POIs by proximity to route or source/destination
function filterPOIsByProximity(pois, routeData) {
    // Maximum distance (in km) a POI can be from the route to be included
    const MAX_DISTANCE_TO_ROUTE = 0.08; 
    
    // Maximum distance (in km) a POI can be from source/destination
    const MAX_DISTANCE_TO_ENDPOINT = 0.08; 
    
    return pois.filter(poi => {
        // First check if this is one of our desired POI types
        const allowedTypes = ['restaurant', 'cafe', 'hotel', 'hospital', 'school', 'atm'];
        if (!allowedTypes.includes(poi.type)) {
            return false;
        }
        
        // Check if POI is near source or destination
        const sourceDistance = calculateDistance(
            poi.lat, poi.lng, 
            routeData.sourcePos.lat, routeData.sourcePos.lng
        );
        
        const destDistance = calculateDistance(
            poi.lat, poi.lng, 
            routeData.destPos.lat, routeData.destPos.lng
        );
        
        // If close to source or destination, include it
        if (sourceDistance <= MAX_DISTANCE_TO_ENDPOINT || destDistance <= MAX_DISTANCE_TO_ENDPOINT) {
            return true;
        }
        
        // Otherwise, check distance to route
        let minDistanceToRoute = Infinity;
        
        // For each segment of the route, calculate distance to the POI
        for (let i = 0; i < routeData.route.length - 1; i++) {
            const segmentStart = routeData.route[i];
            const segmentEnd = routeData.route[i + 1];
            
            const distance = distanceToSegment(
                poi.lat, poi.lng,
                segmentStart[0], segmentStart[1],
                segmentEnd[0], segmentEnd[1]
            );
            
            minDistanceToRoute = Math.min(minDistanceToRoute, distance);
        }
        
        return minDistanceToRoute <= MAX_DISTANCE_TO_ROUTE;
    });
}

// Helper function to calculate distance between two points in km (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

// Calculate distance from point to a line segment
function distanceToSegment(pointLat, pointLng, lineLat1, lineLng1, lineLat2, lineLng2) {
    // Convert to x,y coordinates for easier math
    const x = pointLat;
    const y = pointLng;
    const x1 = lineLat1;
    const y1 = lineLng1;
    const x2 = lineLat2;
    const y2 = lineLng2;
    
    // Calculate the squared length of the line segment
    const lengthSquared = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    
    // If segment is just a point, return distance to that point
    if (lengthSquared === 0) return calculateDistance(pointLat, pointLng, lineLat1, lineLng1);
    
    // Calculate projection scalar parameter t
    const t = Math.max(0, Math.min(1, (
        ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / lengthSquared
    )));
    
    // Calculate nearest point on segment
    const projX = x1 + t * (x2 - x1);
    const projY = y1 + t * (y2 - y1);
    
    // Return distance from point to this projection point
    return calculateDistance(pointLat, pointLng, projX, projY);
}


// Build the Overpass API query based on bounding box and POI types
function buildOverpassQuery(minLat, minLng, maxLat, maxLng, poiTypes) {
    // Create the bounding box string
    const bbox = `${minLat},${minLng},${maxLat},${maxLng}`;
    
    // Start building the query parts
    let queryParts = [];
    
    // Convert our application POI types to Overpass tags
    // Only include the specific types we want
    poiTypes.forEach(type => {
        switch(type) {
            case 'restaurant':
                queryParts.push('node["amenity"="restaurant"](' + bbox + ');');
                queryParts.push('way["amenity"="restaurant"](' + bbox + ');');
                break;
            case 'cafe':
                queryParts.push('node["amenity"="cafe"](' + bbox + ');');
                queryParts.push('way["amenity"="cafe"](' + bbox + ');');
                break;
            case 'hotel':
                queryParts.push('node["tourism"="hotel"](' + bbox + ');');
                queryParts.push('way["tourism"="hotel"](' + bbox + ');');
                break;
            case 'atm':
                queryParts.push('node["amenity"="atm"](' + bbox + ');');
                break;
            case 'hospital':
                queryParts.push('node["amenity"="hospital"](' + bbox + ');');
                queryParts.push('way["amenity"="hospital"](' + bbox + ');');
                break;
            case 'school':
                queryParts.push('node["amenity"="school"](' + bbox + ');');
                queryParts.push('way["amenity"="school"](' + bbox + ');');
                break;
        }
    });
    
    // Construct the complete Overpass query
    return `
        [out:json][timeout:60];
        (
            ${queryParts.join('\n            ')}
        );
        out body;
        >;
        out skel qt;
    `;
}

// Fetch data from Overpass API
async function fetchOverpassData(query) {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    
    try {
        const response = await fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'data=' + encodeURIComponent(query)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Process the Overpass API response into our POI format
        return processOverpassResponse(data);
    } catch (error) {
        console.error('Error fetching data from Overpass API:', error);
        throw error;
    }
}

// Process Overpass API response into our POI format
function processOverpassResponse(data) {
    const pois = [];
    
    if (data && data.elements) {
        console.log(`Received ${data.elements.length} elements from Overpass API`);
        
        // First, process all nodes
        const nodes = {};
        data.elements.forEach(element => {
            if (element.type === 'node') {
                nodes[element.id] = {
                    lat: element.lat,
                    lon: element.lon,
                    tags: element.tags || {}
                };
            }
        });
        
        // Then, process all elements to extract POIs
        data.elements.forEach((element, index) => {
            // Only process elements with tags
            if (!element.tags) return;
            
            // Determine coordinates based on element type
            let lat, lng;
            let validGeometry = false;
            
            if (element.type === 'node') {
                lat = element.lat;
                lng = element.lon;
                validGeometry = true;
            } else if (element.type === 'way' && element.nodes && element.nodes.length > 0) {
                // For ways, use the first node's coordinates if available
                const firstNodeId = element.nodes[0];
                if (nodes[firstNodeId]) {
                    lat = nodes[firstNodeId].lat;
                    lng = nodes[firstNodeId].lon;
                    validGeometry = true;
                }
            }
            
            // Skip elements without valid geometry
            if (!validGeometry) return;
            
            // Determine POI type - only include our desired types
            let poiType = null; // Default to null, will be filtered out
            
            if (element.tags.amenity === 'restaurant') {
                poiType = 'restaurant';
            } else if (element.tags.amenity === 'cafe') {
                poiType = 'cafe';
            } else if (element.tags.tourism === 'hotel') {
                poiType = 'hotel';
            } else if (element.tags.amenity === 'atm') {
                poiType = 'atm';
            } else if (element.tags.amenity === 'hospital') {
                poiType = 'hospital';
            } else if (element.tags.amenity === 'school') {
                poiType = 'school';
            }
            
            // Skip if not one of our desired POI types
            if (!poiType) return;
            
            // Get name (or generate a default if missing)
            const name = element.tags.name || 
                         element.tags['name:en'] || 
                         `${poiType.charAt(0).toUpperCase() + poiType.slice(1)} #${index + 1}`;
            
            // Extract address components
            const street = element.tags['addr:street'] || '';
            const housenumber = element.tags['addr:housenumber'] || '';
            const city = element.tags['addr:city'] || element.tags.city || 'Nearby';
            
            // Create address string
            let address = '';
            if (housenumber && street) {
                address = `${housenumber} ${street}, ${city}`;
            } else if (street) {
                address = `${street}, ${city}`;
            } else {
                address = city;
            }
            
            // Add a default rating for display
            const rating = element.tags.rating || ((Math.random() * 2) + 3).toFixed(1);
            
            // Create POI object
            pois.push({
                id: `poi-${element.type}-${element.id}`,
                name: name,
                type: poiType,
                lat: lat,
                lng: lng,
                address: address,
               
            });
        });
    }
    
    console.log(`Processed ${pois.length} POIs from API response`);
    return pois;
}

// Display POIs on the map and in the sidebar
function displayPOIs(pois) {
    const poiContainer = document.getElementById('poiContainer');
    
    // Clear previous content
    poiContainer.innerHTML = '';
    
    // If no POIs found
    if (pois.length === 0) {
        poiContainer.innerHTML = '<div class="poi-loading">No points of interest found near your route.</div>';
        return;
    }
    
    // Add heading
    poiContainer.innerHTML = `<h3>Points of Interest (${pois.length})</h3>`;
    
    // Create POI list
    const poiList = document.createElement('ul');
    poiList.className = 'poi-list';
    
    // Add POIs to list and map
    pois.forEach(poi => {
        // Create list item for sidebar
        const poiItem = document.createElement('li');
        poiItem.className = 'poi-item';
        poiItem.dataset.poiId = poi.id;
        
        poiItem.innerHTML = `
            <div class="poi-name">${poi.name}</div>
            <div class="poi-address">${poi.address}</div>
          
            <div class="poi-type">${poi.type.charAt(0).toUpperCase() + poi.type.slice(1)}</div>
            <button class="poi-directions-btn">Get Directions</button>
        `;
        
        // Add event listener for clicking on the POI item
        poiItem.addEventListener('click', function() {
            // Remove selected class from all POIs
            document.querySelectorAll('.poi-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Add selected class to clicked POI
            this.classList.add('selected');
            
            // Center map on POI
            map.setView([poi.lat, poi.lng], 17);
            
            // Open the popup for this POI
            const marker = markers.find(m => m.poiId === poi.id);
            if (marker) {
                marker.openPopup();
            }
        });
        
        // Add event listener for directions button
        poiItem.querySelector('.poi-directions-btn').addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the parent's click event
            
            // Set as destination
            document.getElementById('destinationLocation').value = '';
            placeMarker({ lat: poi.lat, lng: poi.lng }, 'destination');
            
            // Calculate route if source is already set
            if (sourceMarker) {
                handleFindPathClick();
            } else {
                alert('Please select a source location first');
            }
        });
        
        // Add to list
        poiList.appendChild(poiItem);
        
        // Create marker for the map
        const marker = L.marker([poi.lat, poi.lng], {
            icon: poiTypeIcons[poi.type] || markerIcons.poi
        }).addTo(map);
        
        // Add ID to marker for reference
        marker.poiId = poi.id;
        
        // Create popup for the marker
        const popupContent = document.createElement('div');
        popupContent.className = 'poi-info-window';
        popupContent.innerHTML = `
            <h3>${poi.name}</h3>
            <p>${poi.address}</p>
            <p>Type: ${poi.type.charAt(0).toUpperCase() + poi.type.slice(1)}</p>
            <button class="set-as-destination">Set as Destination</button>
        `;
        
        // Bind popup to marker
        marker.bindPopup(popupContent);
        
        // Add event listener for popup open
        marker.on('popupopen', function() {
            // Add click handler for 'Set as Destination' button
            document.querySelector('.set-as-destination').addEventListener('click', function() {
                // Set as destination
                document.getElementById('destinationLocation').value = '';
                placeMarker({ lat: poi.lat, lng: poi.lng }, 'destination');
                
                // Calculate route if source is already set
                if (sourceMarker) {
                    handleFindPathClick();
                } else {
                    alert('Please select a source location first');
                }
                
                // Close popup
                marker.closePopup();
            });
        });
        
        // Add marker to global array
        markers.push(marker);
    });
    
    // Add POI list to container
    poiContainer.appendChild(poiList);
}
        // Reset the map
        function resetMap() {
            // Clear route
            routeLayer.clearLayers();
            
            // Remove markers
            markers.forEach(marker => {
                map.removeLayer(marker);
            });
            
            // Reset markers array
            markers = [];
            sourceMarker = null;
            destinationMarker = null;
            
            // Clear route info
            document.getElementById('routeInfo').innerHTML = '';
            
            // Clear POI container
            document.getElementById('poiContainer').innerHTML = '';
            
            // Reset dropdowns
            document.getElementById('sourceLocation').value = '';
            document.getElementById('destinationLocation').value = '';
            
            // Reset center and zoom
            map.setView(HALDWANI_CENTER, HALDWANI_ZOOM);
        }

        // Fix the setupComparisonNavigation function with correct variable names
function setupComparisonNavigation() {
    const compareBtn = document.getElementById('compareBtn');
    console.log('Setting up comparison navigation, button found:', !!compareBtn);
    
    if (compareBtn) {
        // Remove any existing event listeners by cloning the button
        const newCompareBtn = compareBtn.cloneNode(true);
        compareBtn.parentNode.replaceChild(newCompareBtn, compareBtn);
        
        newCompareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Compare button clicked!');
            console.log('sourceMarker:', !!sourceMarker);
            console.log('destinationMarker:', !!destinationMarker);
            
            // Check if we have both source and destination
            if (sourceMarker && destinationMarker) {
                try {
                    // Get coordinates
                    const sourceLat = sourceMarker.getLatLng().lat;
                    const sourceLng = sourceMarker.getLatLng().lng;
                    const destLat = destinationMarker.getLatLng().lat;
                    const destLng = destinationMarker.getLatLng().lng;
                    
                    // Use currentRouteMode (not currentTransportMode) as that's what your code uses
                    const transportMode = currentRouteMode || 'driving';
                    
                    // Store in localStorage for comparison page to access
                    const sourceData = JSON.stringify({lat: sourceLat, lng: sourceLng});
                    const destData = JSON.stringify({lat: destLat, lng: destLng});
                    
                    localStorage.setItem('travelMateSourceLocation', sourceData);
                    localStorage.setItem('travelMateDestLocation', destData);
                    localStorage.setItem('travelMateTransportMode', transportMode);
                    
                    // Debug: Log what we're storing
                    console.log('Storing source:', sourceData);
                    console.log('Storing destination:', destData);
                    console.log('Storing transport mode:', transportMode);
                    
                    // Verify storage immediately
                    console.log('Verification:');
                    console.log('Source stored:', localStorage.getItem('travelMateSourceLocation'));
                    console.log('Dest stored:', localStorage.getItem('travelMateDestLocation'));
                    console.log('Mode stored:', localStorage.getItem('travelMateTransportMode'));
                    
                    // Navigate to compare page
                    console.log('Navigating to compare.html...');
                    window.location.href = 'compare.html';
                    
                } catch (error) {
                    console.error('Error storing data:', error);
                    alert('Error preparing comparison data: ' + error.message);
                }
            } else {
                console.log('Missing markers - showing alert');
                alert('Please select both source and destination locations first.');
            }
        });
        
        console.log('Compare button event listener attached successfully');
    } else {
        console.error('Compare button not found in DOM!');
    }
}
// Your showAllLocations function (REMOVE the setupComparisonNavigation from inside this function)
function showAllLocations() {
    // Clear previous markers (except source and destination)
    markers.forEach(marker => {
        if (marker !== sourceMarker && marker !== destinationMarker) {
            map.removeLayer(marker);
        }
    });
    
    // Keep only source and destination markers
    markers = markers.filter(marker => marker === sourceMarker || marker === destinationMarker);
    
    // Add markers for all nodes
    haldwaniData.nodes.forEach(node => {
        // Create marker
        const marker = L.marker([node.lat, node.lng], {
            icon: markerIcons.poi
        }).addTo(map);
        
        // Create popup
        const popupContent = document.createElement('div');
        popupContent.className = 'location-info-window';
        popupContent.innerHTML = `
            <h3>${node.name}</h3>
            <p>Latitude: ${node.lat.toFixed(6)}</p>
            <p>Longitude: ${node.lng.toFixed(6)}</p>
            <button class="set-as-source">Set as Source</button>
            <button class="set-as-destination">Set as Destination</button>
        `;
        
        // Bind popup to marker
        marker.bindPopup(popupContent);
        
        // Add event listener for popup open
        marker.on('popupopen', function() {
            // Add click handler for 'Set as Source' button
            document.querySelector('.set-as-source').addEventListener('click', function() {
                document.getElementById('sourceLocation').value = node.id;
                updateSelectedLocation('source', node.id);
                marker.closePopup();
            });
            
            // Add click handler for 'Set as Destination' button
            document.querySelector('.set-as-destination').addEventListener('click', function() {
                document.getElementById('destinationLocation').value = node.id;
                updateSelectedLocation('destination', node.id);
                marker.closePopup();
            });
        });
        
        // Add to markers array
        markers.push(marker);
    });
    
    // Create bounds to fit all markers
    const bounds = L.latLngBounds(haldwaniData.nodes.map(node => [node.lat, node.lng]));
    
    // Fit map to bounds
    map.fitBounds(bounds, {
        padding: [50, 50]
    });
}

// Call setupComparisonNavigation() in your main initialization code
// This should be called once when the page loads, typically in your DOMContentLoaded event or similar
document.addEventListener('DOMContentLoaded', function() {
    // ... your other initialization code ...
    
    // Initialize comparison navigation
    setupComparisonNavigation();
    
   
});