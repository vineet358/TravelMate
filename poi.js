
let poiMarkers = [];
let poisVisible = false;
const poiTypes = {
    restaurant: {
        query: `[out:json][timeout:25];(node["amenity"="restaurant"]({{bbox}});node["amenity"="cafe"]({{bbox}});node["amenity"="fast_food"]({{bbox}}););out geom;`,
        icon: '🍽️',
        color: '#e53e3e',
        name: 'Restaurants'
    },
    hospital: {
        query: `[out:json][timeout:25];(node["amenity"="hospital"]({{bbox}});node["amenity"="clinic"]({{bbox}});node["amenity"="doctors"]({{bbox}});node["amenity"="pharmacy"]({{bbox}}););out geom;`,
        icon: '🏥',
        color: '#38a169',
        name: 'Hospitals'
    },
    school: {
        query: `[out:json][timeout:25];(node["amenity"="school"]({{bbox}});node["amenity"="college"]({{bbox}});node["amenity"="university"]({{bbox}});node["amenity"="kindergarten"]({{bbox}}););out geom;`,
        icon: '🏫',
        color: '#3182ce',
        name: 'Schools'
    }
};

async function fetchPOIs(type) {
    const bounds = map.getBounds();
    const bbox = `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`;
    
    const query = poiTypes[type].query.replace(/\{\{bbox\}\}/g, bbox);
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    console.log(`Fetching ${type} POIs with query:`, query);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Found ${data.elements?.length || 0} ${type} POIs`);
        return data.elements || [];
    } catch (error) {
        console.error(`Error fetching ${type} POIs:`, error);
        return [];
    }
}

function createPOIMarker(poi, type) {
    const { icon, color } = poiTypes[type];
    
    const marker = L.marker([poi.lat, poi.lon], {
        icon: L.divIcon({
            html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); cursor: pointer;">${icon}</div>`,
            className: 'poi-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        })
    });
    const name = poi.tags?.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`;
    const address = poi.tags?.['addr:street'] || poi.tags?.['addr:housenumber'] || 'Address not available';
    const phone = poi.tags?.phone || poi.tags?.['contact:phone'] || 'Not available';
    const website = poi.tags?.website || poi.tags?.['contact:website'] || '';
    
   
    let popupContent = `
        <div style="max-width: 250px;">
            <h4 style="margin: 0 0 8px 0; color: #2d3748; font-size: 16px; font-weight: bold;">${name}</h4>
            <p style="margin: 4px 0; font-size: 12px; color: #4a5568;"><strong>📍 Address:</strong> ${address}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #4a5568;"><strong>📞 Phone:</strong> ${phone}</p>
    `;
    
    if (website) {
        popupContent += `<p style="margin: 4px 0; font-size: 12px;"><strong>🌐 Website:</strong> <a href="${website}" target="_blank" style="color: #3182ce;">Visit</a></p>`;
    }
    
    popupContent += `
            <div style="margin-top: 8px;">
                <span style="display: inline-block; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: bold; background: ${color}; color: white;">${type.toUpperCase()}</span>
            </div>
        </div>
    `;

    marker.bindPopup(popupContent);
    return marker;
}


async function showPOIs() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';

    clearPOIs();

    const activeFilters = getActiveFilters();

    try {
        let totalPOIs = 0;
        
        for (const type of activeFilters) {
            const pois = await fetchPOIs(type);
            
            pois.forEach(poi => {
                if (poi.lat && poi.lon) {
                    const marker = createPOIMarker(poi, type);
                    marker.addTo(map);
                    poiMarkers.push({ marker, type });
                    totalPOIs++;
                }
            });
        }
        showPOIFilters();
        poisVisible = true;
        

        const showPoisBtn = document.getElementById('showPoisBtn');
        if (showPoisBtn) {
            showPoisBtn.textContent = 'Hide POIs';
        }
    
        console.log(`Loaded ${totalPOIs} POIs successfully`);
        
    } catch (error) {
        console.error('Error loading POIs:', error);
        alert('Error loading POIs. Please try again.');
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function clearPOIs() {
    poiMarkers.forEach(poiData => {
        map.removeLayer(poiData.marker);
    });
    poiMarkers = [];
}
function getActiveFilters() {
    const activeButtons = document.querySelectorAll('#poiFilters .poi-filter-btn.active');
    return Array.from(activeButtons).map(btn => btn.dataset.type);
}

function showPOIFilters() {
    const filtersContainer = document.getElementById('poiFilters');
    
    if (!filtersContainer.querySelector('.poi-filter-btn')) {
        filtersContainer.innerHTML = '';
        
        Object.keys(poiTypes).forEach(type => {
            const button = document.createElement('button');
            button.className = 'poi-filter-btn active';
            button.dataset.type = type;
            button.innerHTML = `${poiTypes[type].icon} ${poiTypes[type].name}`;
            button.style.cssText = `
                display: inline-block;
                padding: 6px 12px;
                margin: 3px;
                background: #e2e8f0;
                border: none;
                border-radius: 15px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
            `;
            
            button.addEventListener('click', function() {
                this.classList.toggle('active');
                updateFilterStyles();
                if (poisVisible) {
                    showPOIs(); 
                }
            });
            
            filtersContainer.appendChild(button);
        });
        
        updateFilterStyles();
    }
    
    filtersContainer.style.display = 'block';
}


function updateFilterStyles() {
    document.querySelectorAll('.poi-filter-btn').forEach(btn => {
        if (btn.classList.contains('active')) {
            btn.style.background = '#667eea';
            btn.style.color = 'white';
        } else {
            btn.style.background = '#e2e8f0';
            btn.style.color = '#4a5568';
        }
    });
}

function togglePOIs() {
    if (poisVisible) {
        clearPOIs();
        document.getElementById('poiFilters').style.display = 'none';
        poisVisible = false;
        const showPoisBtn = document.getElementById('showPoisBtn');
        if (showPoisBtn) {
            showPoisBtn.textContent = 'Show POIs';
        }
    } else {
        showPOIs();
    }
}

function filterPOIsByType(activeTypes) {
  
    poiMarkers.forEach(poiData => {
        map.removeLayer(poiData.marker);
    });
    

    poiMarkers.forEach(poiData => {
        if (activeTypes.includes(poiData.type)) {
            poiData.marker.addTo(map);
        }
    });
}


function initializePOIs() {

    let showPoisBtn = document.getElementById('showPoisBtn');
    if (!showPoisBtn) {
        showPoisBtn = document.createElement('button');
        showPoisBtn.id = 'showPoisBtn';
        showPoisBtn.textContent = 'Show POIs';
        showPoisBtn.style.cssText = `
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-bottom: 10px;
            background: #805ad5;
            color: white;
        `;
        
        showPoisBtn.addEventListener('mouseenter', function() {
            this.style.background = '#6b46c1';
            this.style.transform = 'translateY(-2px)';
        });
        
        showPoisBtn.addEventListener('mouseleave', function() {
            this.style.background = '#805ad5';
            this.style.transform = 'translateY(0)';
        });
        
       
        const formGroups = document.querySelectorAll('.form-group');
        let targetFormGroup = null;
        
    
        formGroups.forEach(group => {
            const buttons = group.querySelectorAll('button');
            if (buttons.length > 0) {
               
                const hasMainButtons = Array.from(buttons).some(btn => 
                    btn.id === 'findPathBtn' || btn.id === 'resetBtn' || btn.id === 'showAllLocationsBtn'
                );
                if (hasMainButtons) {
                    targetFormGroup = group;
                }
            }
        });
        
        if (targetFormGroup) {
            targetFormGroup.appendChild(showPoisBtn);
        } else {
        
            const routeModeSelector = document.querySelector('.route-mode-selector');
            if (routeModeSelector) {
                const newFormGroup = document.createElement('div');
                newFormGroup.className = 'form-group';
                newFormGroup.appendChild(showPoisBtn);
                routeModeSelector.parentNode.insertBefore(newFormGroup, routeModeSelector.nextSibling);
            }
        }
    }
    

    showPoisBtn.addEventListener('click', togglePOIs);
    
    let filtersContainer = document.getElementById('poiFilters');
    if (!filtersContainer) {
        filtersContainer = document.createElement('div');
        filtersContainer.id = 'poiFilters';
        filtersContainer.style.cssText = `
            margin-bottom: 15px;
            display: none;
        `;
        

        const showPoisButton = document.getElementById('showPoisBtn');
        if (showPoisButton && showPoisButton.parentNode) {
            showPoisButton.parentNode.parentNode.insertBefore(filtersContainer, showPoisButton.parentNode.nextSibling);
        }
    }
}

function enhanceResetFunctionality() {
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
   
        const originalReset = resetBtn.onclick;
        
        resetBtn.addEventListener('click', function() {
            // Clear POIs
            clearPOIs();
            document.getElementById('poiFilters').style.display = 'none';
            poisVisible = false;
            const showPoisBtn = document.getElementById('showPoisBtn');
            if (showPoisBtn) {
                showPoisBtn.textContent = 'Show POIs';
            }
            
           
            document.querySelectorAll('.poi-filter-btn').forEach(btn => {
                btn.classList.add('active');
            });
            updateFilterStyles();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {

    setTimeout(() => {
        if (typeof map !== 'undefined') {
            initializePOIs();
            enhanceResetFunctionality();
            console.log('POI functionality initialized successfully!');
        } else {
            console.error('Map not found. Make sure your map variable is globally accessible.');
        }
    }, 1000);
});

if (typeof map !== 'undefined') {
    initializePOIs();
    enhanceResetFunctionality();
}