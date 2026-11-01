# 🩸 RaktaSetu – Real-Time Blood & Organ Matching Network

RaktaSetu is a cloud-native, full-stack emergency response platform designed to bridge the gap between blood/organ recipients and donors. In critical medical situations, finding a compatible donor within the "Golden Hour" is vital. This platform eliminates manual phone calls by using WebSockets for instant alerts and Geospatial indexing for radius-based donor matching.

## 🚀 Live Deployments
*   **Frontend (Vercel):** [https://raktasetu-frontend-git-main-vortex-59b6.vercel.app](https://raktasetu-frontend-git-main-vortex-59b6.vercel.app)
*   **Backend API (Render):** [https://raktasetu-backend-xouv.onrender.com/api/health](https://raktasetu-backend-xouv.onrender.com/api/health)
*(Note: The backend is hosted on Render's free tier. It may take ~30 seconds to "wake up" on the first request).*

---

## 🧠 Data Structures & Algorithms (DSA) Integration
This project goes beyond standard CRUD operations by implementing explicit Data Structures to optimize emergency triage and matching logic. All custom DSA implementations are located in `backend/dsa/`:

1.  **Priority Queue (Min-Heap):** Ensures "Critical" (1A) patients are prioritized over "Moderate" ones in \(O(\log N)\) time.
2.  **Binary Search Tree (BST):** Used for fast \(O(\log N)\) lookup of donors by their specific ID.
3.  **Hash Map:** Provides \(O(1)\) constant-time lookup for blood compatibility matching.
4.  **Merge Sort:** Used to rank donors based on distance and priority in \(O(N \log N)\) time.
5.  **Graphs (BFS):** MongoDB `2dsphere` spatial indexing is used to perform Breadth-First Search equivalents for finding donors within a 10km radius.
6.  **Queues (FIFO):** The Node.js Event Loop handles incoming WebSocket alerts sequentially to prevent server crashes.

---

## 🛠️ Tech Stack
*   **Frontend:** React.js, CSS3
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB Atlas (Cloud)
*   **Real-Time Engine:** Socket.IO (WebSockets)
*   **Deployment:** Vercel (Frontend) & Render (Backend)

---

## 📁 Repository Structure
This is a **Monorepo** containing both the frontend and backend:
```text
RaktaSetu/
├── backend/            # Node.js Express Server
│   ├── dsa/            # Custom Data Structure implementations (MinHeap, BST, etc.)
│   ├── models/         # Mongoose schemas (Donor, Request)
│   ├── routes/         # Express API routes
│   └── index.js        # Main server entry point
│
├── frontend/           # React Application
│   ├── src/            # React components (App.js, App.css)
│   └── package.json
│
└── .gitignore
