# TravelMate

A real-time city-level route planner for Haldwani that implements **Dijkstra’s Algorithm** and **A\*** Search to find the **shortest path** between landmarks. The project visualizes routes on an interactive **Leaflet.js** map using real-world coordinates.

---

## 📌 Features

- 🗺️ Real-time Map Rendering using **Leaflet.js**
- 📍 Start and End location selection with markers
- 📐 Calculates **shortest distance** between two points
- ⚙️ Supports both:
  - **Dijkstra's Algorithm**
  - **A\* Search Algorithm** (with heuristic)
- 🧭 Displays estimated travel **time** and **path**
- 🔄 Route visualization follows **actual roads**, not straight lines
- 🧠 Heuristic for A\*: Euclidean Distance based on lat/lng

---

## 💡 Algorithms Used

### 🔹 Dijkstra’s Algorithm
- Explores all shortest paths in increasing cost order
- Guarantees the shortest path but may be slower

### 🔹 A\* Search Algorithm
- Uses both actual cost and heuristic to target the goal faster
- Faster in practice due to guided exploration

---

## 🧮 Sample Output

### Route: Bhotia Parao Market ➡️ City Heart Hospital

| Algorithm | Distance | Time Estimate | Path Shape |
|-----------|----------|----------------|------------|
| Dijkstra  | 1.70 km  | ~3 minutes     | Slightly curved |
| A\*       | 1.70 km  | ~3 minutes     | Slightly different path |

Both give the **same distance**, but the **paths differ slightly** — showing the difference in how each algorithm explores.

---

## 🔧 Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Map Library:** [Leaflet.js](https://leafletjs.com)
- **Graph Algorithms:** JavaScript implementation of Dijkstra & A\*

---

## 🏗️ How It Works

1. The city graph is modeled with nodes and edges based on real road segments.
2. Each location has `latitude`, `longitude`, and connected neighbors.
3. On selecting source and destination:
   - You can choose to use Dijkstra or A\*
   - The map shows the computed route with polylines
4. The algorithm returns:
   - Shortest distance (in km)
   - Estimated time (based on speed)
   - Route visualization

---

## 🧪 Future Scope

- 🧭 Add more heuristics (Manhattan, road type)
- 🚌 Add real-time bus or cab suggestions
- 📱 Build mobile-friendly UI
- 📊 Show congestion or traffic overlays
- 🗓️ Add multi-day itinerary planner

