const haldwaniData = {
    nodes: [
        { id: "n1", name: "Haldwani Railway Station", lat: 29.2152814703471, lng: 79.53398622568368 },
        { id: "n2", name: "Sushila Tiwari Hospital", lat: 29.20439598826212, lng: 79.51602930489526 },
        { id: "n3", name: "Nainital Bank Head Office", lat: 29.2173, lng: 79.5223 }, // Corrected coordinates
        { id: "n4", name: "KMC Sports Ground", lat: 29.2167, lng: 79.5112 }, // Corrected coordinates
        { id: "n5", name: "Nainital Road Bus Stand", lat: 29.2234, lng: 79.5027 }, // Corrected coordinates
        { id: "n6", name: "Haldwani Degree College", lat: 29.22603, lng: 79.52953 },
        { id: "n7", name: "Gaulapar Bus Stand", lat: 29.2296, lng: 79.5058 },
        { id: "n8", name: "Chitrashila Auditorium", lat: 29.2173, lng: 79.5123 },
        { id: "n9", name: "Krishna Super Mart", lat: 29.194773695270282, lng: 79.52392336209574 },
        { id: "n10", name: "Bhotia Parao Market", lat: 29.2173, lng: 79.5228 },
        { id: "n11", name: "Govt. Medical College", lat: 29.2062, lng: 79.5155 }, // Corrected coordinates
        { id: "n12", name: "ISBT Haldwani", lat: 29.216782051984502, lng: 79.53032705092546 },
        { id: "n13", name: "Pacific Mall", lat: 29.219630700528036, lng: 79.49791959325377 },
        { id: "n14", name: "Kathgodam Railway Station", lat: 29.266949897477502, lng: 79.54665518558207 },
        { id: "n15", name: "Gaula River Bridge", lat: 29.2285, lng: 79.5362 }, // Corrected name and coordinates
        { id: "n16", name: "Ranibagh Industrial Area", lat: 29.295930920974744, lng: 79.5553317478087 },
        { id: "n17", name: "Zoo Road", lat: 29.2114, lng: 79.5097 }, // Corrected coordinates
        { id: "n18", name: "Sanjay Nagar", lat: 29.2242, lng: 79.5361 },
        { id: "n19", name: "Mukhani Market", lat: 29.214177690308368, lng: 79.52868091924283 },
        { id: "n20", name: "Mangal Parao", lat: 29.21491969189054, lng: 79.53118780489527 },
        { id: "n21", name: "Chandan Nagar", lat: 29.21540936236098, lng: 79.516878762796 },
        { id: "n22", name: "City Heart Hospital", lat: 29.2042, lng: 79.5168 }, // Corrected coordinates
        { id: "n23", name: "Rampur Road Junction", lat: 29.203551257367593, lng: 79.52175860199802 },
        { id: "n24", name: "Gola Park", lat: 29.2232, lng: 79.5278 }, // Corrected coordinates
        { id: "n25", name: "Ramleela Ground", lat: 29.2288593352952, lng: 79.49698200607511 },
        { id: "n26", name: "Bareilly Road Crossing", lat: 29.2087, lng: 79.5102 }, // Corrected coordinates
        { id: "n27", name: "Lalkuan Chowk", lat: 29.193884150446884, lng: 79.50827518467044 },
        { id: "n28", name: "Durga City Center", lat: 29.232743253600123, lng: 79.52776922180708 },
        { id: "n29", name: "Delhi Sweets Junction", lat: 29.2194, lng: 79.5209 },
        { id: "n30", name: "Sanjay Van", lat: 29.2141, lng: 79.5050 }, // Corrected coordinates
        { id: "n31", name: "Subhash Nagar", lat: 29.227361416468128, lng: 79.53262432905538 },
        { id: "n32", name: "Heera Nagar", lat: 29.221742572931515, lng: 79.52051765552872 },
        { id: "n33", name: "Indira Colony", lat: 29.2227, lng: 79.4806 }, // Corrected coordinates
        { id: "n34", name: "Gaujajali Bridge", lat: 29.212060307313532, lng: 79.53912145689432 },
        { id: "n35", name: "Damuadhunga College", lat: 29.241024164775318, lng: 79.52712868451057 },
        { id: "n36", name: "Chota Haldwani", lat: 29.2748, lng: 79.5412 }, // Corrected coordinates
        { id: "n37", name: "Kusumkhera Chowk", lat: 29.228736212321923, lng: 79.50932418141586 },
        { id: "n38", name: "Transport Nagar", lat: 29.18159206549047, lng: 79.52711739437464 },
        { id: "n39", name: "Halduchaur", lat: 29.2422, lng: 79.5436 }, // Corrected coordinates
        { id: "n40", name: "Haripur Sukha", lat: 29.202536500059065, lng: 79.51433267058007 },
        { id: "n41", name: "Nai Basti", lat: 29.2273, lng: 79.5444 },
        { id: "n42", name: "Gandhi Nagar", lat: 29.218484448327807, lng: 79.51296060674622 },
        { id: "n43", name: "Golapar Crossroads", lat: 29.2315, lng: 79.5101 },
        { id: "n44", name: "Patel Chowk", lat: 29.214506785137655, lng: 79.52920543373108 },
        { id: "n45", name: "Banphoolpura", lat: 29.21069096069445, lng: 79.533489342572 },
        { id: "n46", name: "Malla Gorakhpur", lat: 29.219516486372566, lng: 79.52707539179767 },
        { id: "n47", name: "Tallital Bus Station", lat: 29.2234, lng: 79.5027 },
        { id: "n48", name: "Shivlok Colony", lat: 29.2140, lng: 79.5318 },
        { id: "n49", name: "Tikonia Park", lat: 29.22435659519164, lng: 79.53043023273145 },
        { id: "n50", name: "Aavas Vikas Colony", lat: 29.237795130843004, lng: 79.53644376626886 },
        { id: "n51", name: "KVGC College", lat: 29.2271, lng: 79.5329 },
        { id: "n52", name: "Shiva Talkies Crossing", lat: 29.2172, lng: 79.5056 },
        { id: "n53", name: "Haripur Kalan", lat: 29.1925, lng: 79.5092 },
        { id: "n54", name: "Ambedkar Stadium", lat: 29.2287, lng: 79.5185 },
        { id: "n55", name: "Anand Vatika", lat: 29.2089, lng: 79.5252 },
        { id: "n56", name: "Damua Dhunga Temple", lat: 29.2421083188601, lng: 79.52921595943756 },
        { id: "n57", name: "Talli Bamori", lat: 29.2401, lng: 79.5205 },
        { id: "n58", name: "Naveen Nagar", lat: 29.2195, lng: 79.4893 },
        { id: "n59", name: "Teenpani Bypass", lat: 29.184297923089215, lng: 79.51414877976133 },
        { id: "n60", name: "Kaladhungi Road", lat: 29.2205, lng: 79.5044 } // Corrected coordinates
    ],
    
    // Improved edges based on geographical proximities
    edges: [
        // Railway Station Connections
        { source: "n1", target: "n12", distance: 0.4 }, // Railway Station to ISBT
        { source: "n1", target: "n19", distance: 0.5 }, // Railway Station to Mukhani Market
        { source: "n1", target: "n20", distance: 0.3 }, // Railway Station to Mangal Parao
        { source: "n1", target: "n44", distance: 0.3 }, // Railway Station to Patel Chowk
        { source: "n1", target: "n45", distance: 0.5 }, // Railway Station to Banphoolpura
        { source: "n1", target: "n3", distance: 0.6 },  // Railway Station to Nainital Bank
        { source: "n1", target: "n29", distance: 0.5 }, // Railway Station to Delhi Sweets
        
        // ISBT Connections
        { source: "n12", target: "n19", distance: 0.4 }, // ISBT to Mukhani Market
        { source: "n12", target: "n20", distance: 0.3 }, // ISBT to Mangal Parao
        { source: "n12", target: "n44", distance: 0.4 }, // ISBT to Patel Chowk
        { source: "n12", target: "n46", distance: 0.5 }, // ISBT to Malla Gorakhpur
        { source: "n12", target: "n48", distance: 0.5 }, // ISBT to Shivlok Colony
        { source: "n12", target: "n15", distance: 0.5 }, // ISBT to Gaula River Bridge
        { source: "n12", target: "n31", distance: 0.6 }, // ISBT to Subhash Nagar
        
        // Central Area Connections
        { source: "n3", target: "n8", distance: 0.3 }, // Nainital Bank to Chitrashila Auditorium
        { source: "n3", target: "n10", distance: 0.1 }, // Nainital Bank to Bhotia Parao Market
        { source: "n3", target: "n29", distance: 0.3 }, // Nainital Bank to Delhi Sweets Junction
        { source: "n3", target: "n4", distance: 0.4 },  // Nainital Bank to KMC Sports Ground
        { source: "n3", target: "n19", distance: 0.5 }, // Nainital Bank to Mukhani Market
        { source: "n8", target: "n10", distance: 0.2 }, // Chitrashila to Bhotia Parao
        { source: "n8", target: "n17", distance: 0.3 }, // Chitrashila to Zoo Road
        { source: "n8", target: "n29", distance: 0.4 }, // Chitrashila to Delhi Sweets
        { source: "n10", target: "n29", distance: 0.3 }, // Bhotia Parao to Delhi Sweets
        { source: "n10", target: "n32", distance: 0.4 }, // Bhotia Parao to Heera Nagar
        { source: "n29", target: "n32", distance: 0.3 }, // Delhi Sweets to Heera Nagar
        { source: "n29", target: "n42", distance: 0.4 }, // Delhi Sweets to Gandhi Nagar
        { source: "n29", target: "n46", distance: 0.5 }, // Delhi Sweets to Malla Gorakhpur
        
        // Bus Stands Connections
        { source: "n5", target: "n7", distance: 0.3 }, // Nainital Road Bus Stand to Gaulapar Bus Stand
        { source: "n5", target: "n47", distance: 0.1 }, // Nainital Road Bus Stand to Tallital Bus Station
        { source: "n5", target: "n52", distance: 0.3 }, // Nainital Road Bus Stand to Shiva Talkies
        { source: "n5", target: "n60", distance: 0.3 }, // Nainital Road Bus Stand to Kaladhungi Road
        { source: "n5", target: "n13", distance: 0.5 }, // Nainital Road Bus Stand to Pacific Mall
        { source: "n7", target: "n25", distance: 0.3 }, // Gaulapar Bus Stand to Ramleela Ground
        { source: "n7", target: "n43", distance: 0.5 }, // Gaulapar Bus Stand to Golapar Crossroads
        { source: "n7", target: "n47", distance: 0.3 }, // Gaulapar Bus Stand to Tallital Bus Station
        { source: "n7", target: "n37", distance: 0.4 }, // Gaulapar Bus Stand to Kusumkhera Chowk
        
        // Mall Area
        { source: "n13", target: "n33", distance: 0.5 }, // Pacific Mall to Indira Colony
        { source: "n13", target: "n58", distance: 0.3 }, // Pacific Mall to Naveen Nagar
        { source: "n13", target: "n60", distance: 0.5 }, // Pacific Mall to Kaladhungi Road
        { source: "n13", target: "n47", distance: 0.4 }, // Pacific Mall to Tallital Bus Station
        { source: "n13", target: "n25", distance: 0.5 }, // Pacific Mall to Ramleela Ground
        
        // Medical Facilities
        { source: "n2", target: "n11", distance: 0.4 }, // Sushila Tiwari Hospital to Govt. Medical College
        { source: "n2", target: "n22", distance: 0.5 }, // Sushila Tiwari Hospital to City Heart Hospital
        { source: "n2", target: "n40", distance: 0.5 }, // Sushila Tiwari Hospital to Haripur Sukha
        { source: "n2", target: "n9", distance: 0.6 },  // Sushila Tiwari Hospital to Krishna Super Mart
        { source: "n2", target: "n23", distance: 0.4 }, // Sushila Tiwari Hospital to Rampur Road Junction
        { source: "n11", target: "n22", distance: 0.4 }, // Govt. Medical College to City Heart Hospital
        { source: "n11", target: "n26", distance: 0.5 }, // Govt. Medical College to Bareilly Road
        { source: "n11", target: "n40", distance: 0.4 }, // Govt. Medical College to Haripur Sukha
        { source: "n11", target: "n21", distance: 0.5 }, // Govt. Medical College to Chandan Nagar
        
        // Northern Areas
        { source: "n14", target: "n16", distance: 0.7 }, // Kathgodam Railway Station to Ranibagh Industrial Area
        { source: "n14", target: "n36", distance: 0.5 }, // Kathgodam Railway Station to Chota Haldwani
        { source: "n14", target: "n39", distance: 0.8 }, // Kathgodam Railway Station to Halduchaur
        { source: "n14", target: "n15", distance: 0.9 }, // Kathgodam Railway Station to Gaula River Bridge
        { source: "n14", target: "n50", distance: 1.0 }, // Kathgodam Railway Station to Aavas Vikas Colony
        { source: "n16", target: "n36", distance: 0.6 }, // Ranibagh to Chota Haldwani
        { source: "n16", target: "n39", distance: 0.7 }, // Ranibagh to Halduchaur
        { source: "n16", target: "n50", distance: 0.8 }, // Ranibagh to Aavas Vikas Colony
        { source: "n36", target: "n39", distance: 0.6 }, // Chota Haldwani to Halduchaur
        { source: "n36", target: "n35", distance: 0.7 }, // Chota Haldwani to Damuadhunga College
        
        // Eastern Areas
        { source: "n15", target: "n18", distance: 0.3 }, // Gaula River Bridge to Sanjay Nagar
        { source: "n15", target: "n31", distance: 0.4 }, // Gaula River Bridge to Subhash Nagar
        { source: "n15", target: "n34", distance: 0.5 }, // Gaula River Bridge to Gaujajali Bridge
        { source: "n15", target: "n41", distance: 0.6 }, // Gaula River Bridge to Nai Basti
        { source: "n15", target: "n49", distance: 0.5 }, // Gaula River Bridge to Tikonia Park
        { source: "n18", target: "n31", distance: 0.2 }, // Sanjay Nagar to Subhash Nagar
        { source: "n18", target: "n41", distance: 0.5 }, // Sanjay Nagar to Nai Basti
        { source: "n18", target: "n6", distance: 0.6 },  // Sanjay Nagar to Haldwani Degree College
        { source: "n31", target: "n41", distance: 0.3 }, // Subhash Nagar to Nai Basti
        { source: "n31", target: "n49", distance: 0.3 }, // Subhash Nagar to Tikonia Park
        { source: "n31", target: "n51", distance: 0.2 }, // Subhash Nagar to KVGC College
        { source: "n31", target: "n6", distance: 0.5 },  // Subhash Nagar to Haldwani Degree College
        
        // North-Eastern Areas
        { source: "n35", target: "n50", distance: 0.5 }, // Damuadhunga College to Aavas Vikas
        { source: "n35", target: "n56", distance: 0.4 }, // Damuadhunga College to Damua Dhunga Temple
        { source: "n35", target: "n57", distance: 0.5 }, // Damuadhunga College to Talli Bamori
        { source: "n35", target: "n39", distance: 0.6 }, // Damuadhunga College to Halduchaur
        { source: "n35", target: "n41", distance: 0.7 }, // Damuadhunga College to Nai Basti
        { source: "n50", target: "n56", distance: 0.3 }, // Aavas Vikas to Damua Dhunga Temple
        { source: "n50", target: "n39", distance: 0.5 }, // Aavas Vikas to Halduchaur
        { source: "n50", target: "n41", distance: 0.6 }, // Aavas Vikas to Nai Basti
        { source: "n56", target: "n57", distance: 0.5 }, // Damua Dhunga Temple to Talli Bamori
        { source: "n56", target: "n41", distance: 0.8 }, // Damua Dhunga Temple to Nai Basti
        
        // Western Areas
        { source: "n25", target: "n33", distance: 0.5 }, // Ramleela Ground to Indira Colony
        { source: "n25", target: "n37", distance: 0.4 }, // Ramleela Ground to Kusumkhera Chowk
        { source: "n25", target: "n54", distance: 0.3 }, // Ramleela Ground to Ambedkar Stadium
        { source: "n25", target: "n58", distance: 0.6 }, // Ramleela Ground to Naveen Nagar
        { source: "n25", target: "n43", distance: 0.5 }, // Ramleela Ground to Golapar Crossroads
        { source: "n33", target: "n58", distance: 0.4 }, // Indira Colony to Naveen Nagar
        { source: "n33", target: "n54", distance: 0.6 }, // Indira Colony to Ambedkar Stadium
        { source: "n33", target: "n37", distance: 0.5 }, // Indira Colony to Kusumkhera Chowk
        { source: "n37", target: "n43", distance: 0.4 }, // Kusumkhera to Golapar Crossroads
        { source: "n37", target: "n54", distance: 0.3 }, // Kusumkhera to Ambedkar Stadium
        { source: "n37", target: "n60", distance: 0.5 }, // Kusumkhera to Kaladhungi Road
        
        // Southern Areas
        { source: "n9", target: "n23", distance: 0.5 }, // Krishna Super Mart to Rampur Road Junction
        { source: "n9", target: "n27", distance: 0.5 }, // Krishna Super Mart to Lalkuan Chowk
        { source: "n9", target: "n38", distance: 0.3 }, // Krishna Super Mart to Transport Nagar
        { source: "n9", target: "n59", distance: 0.6 }, // Krishna Super Mart to Teenpani Bypass
        { source: "n9", target: "n40", distance: 0.5 }, // Krishna Super Mart to Haripur Sukha
        { source: "n23", target: "n27", distance: 0.4 }, // Rampur Road to Lalkuan Chowk
        { source: "n23", target: "n38", distance: 0.5 }, // Rampur Road to Transport Nagar
        { source: "n23", target: "n40", distance: 0.4 }, // Rampur Road to Haripur Sukha
        { source: "n23", target: "n55", distance: 0.5 }, // Rampur Road to Anand Vatika
        { source: "n27", target: "n53", distance: 0.5 }, // Lalkuan Chowk to Haripur Kalan
        { source: "n27", target: "n59", distance: 0.5 }, // Lalkuan Chowk to Teenpani Bypass
        { source: "n27", target: "n38", distance: 0.4 }, // Lalkuan Chowk to Transport Nagar
        { source: "n38", target: "n59", distance: 0.4 }, // Transport Nagar to Teenpani Bypass
        { source: "n38", target: "n53", distance: 0.5 }, // Transport Nagar to Haripur Kalan
        
        // Additional connections for better connectivity
        { source: "n4", target: "n8", distance: 0.2 }, // KMC Sports Ground to Chitrashila
        { source: "n4", target: "n17", distance: 0.3 }, // KMC Sports Ground to Zoo Road
        { source: "n4", target: "n30", distance: 0.3 }, // KMC Sports Ground to Sanjay Van
        { source: "n4", target: "n21", distance: 0.4 }, // KMC Sports Ground to Chandan Nagar
        { source: "n4", target: "n42", distance: 0.5 }, // KMC Sports Ground to Gandhi Nagar
        { source: "n6", target: "n28", distance: 0.4 }, // Haldwani Degree College to Durga City Center
        { source: "n6", target: "n49", distance: 0.5 }, // Haldwani Degree College to Tikonia Park
        { source: "n6", target: "n51", distance: 0.3 }, // Haldwani Degree College to KVGC College
        { source: "n6", target: "n24", distance: 0.4 }, // Haldwani Degree College to Gola Park
        { source: "n17", target: "n30", distance: 0.3 }, // Zoo Road to Sanjay Van
        { source: "n17", target: "n55", distance: 0.4 }, // Zoo Road to Anand Vatika
        { source: "n17", target: "n26", distance: 0.3 }, // Zoo Road to Bareilly Road Crossing
        { source: "n17", target: "n21", distance: 0.4 }, // Zoo Road to Chandan Nagar
        { source: "n21", target: "n30", distance: 0.4 }, // Chandan Nagar to Sanjay Van
        { source: "n21", target: "n26", distance: 0.5 }, // Chandan Nagar to Bareilly Road Crossing
        { source: "n21", target: "n40", distance: 0.4 }, // Chandan Nagar to Haripur Sukha
        { source: "n26", target: "n30", distance: 0.4 }, // Bareilly Road Crossing to Sanjay Van
        { source: "n26", target: "n40", distance: 0.5 }, // Bareilly Road Crossing to Haripur Sukha
        { source: "n26", target: "n42", distance: 0.4 }, // Bareilly Road Crossing to Gandhi Nagar
        { source: "n30", target: "n42", distance: 0.3 }, // Sanjay Van to Gandhi Nagar
        { source: "n30", target: "n55", distance: 0.5 }, // Sanjay Van to Anand Vatika
        { source: "n42", target: "n52", distance: 0.3 }, // Gandhi Nagar to Shiva Talkies Crossing
        { source: "n42", target: "n60", distance: 0.6 }, // Gandhi Nagar to Kaladhungi Road
        { source: "n24", target: "n28", distance: 0.3 }, // Gola Park to Durga City Center
        { source: "n24", target: "n49", distance: 0.4 }, // Gola Park to Tikonia Park
        { source: "n24", target: "n54", distance: 0.5 }, // Gola Park to Ambedkar Stadium
        { source: "n28", target: "n49", distance: 0.3 }, // Durga City Center to Tikonia Park
        { source: "n28", target: "n51", distance: 0.5 }, // Durga City Center to KVGC College
        { source: "n28", target: "n54", distance: 0.4 }, // Durga City Center to Ambedkar Stadium
        { source: "n43", target: "n47", distance: 0.4 }, // Golapar Crossroads to Tallital Bus Station
        { source: "n43", target: "n54", distance: 0.3 }, // Golapar Crossroads to Ambedkar Stadium
        { source: "n43", target: "n60", distance: 0.6 }, // Golapar Crossroads to Kaladhungi Road
        { source: "n47", target: "n52", distance: 0.5 }, // Tallital Bus Station to Shiva Talkies
        { source: "n47", target: "n60", distance: 0.3 }, // Tallital Bus Station to Kaladhungi Road
        { source: "n52", target: "n60", distance: 0.4 }, // Shiva Talkies to Kaladhungi Road
        { source: "n53", target: "n59", distance: 0.6 }, // Haripur Kalan to Teenpani Bypass
        { source: "n55", target: "n40", distance: 0.5 }, // Anand Vatika to Haripur Sukha
    ]
};