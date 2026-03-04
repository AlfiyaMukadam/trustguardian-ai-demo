# TrustGuardian AI

**Embedded Trust Intelligence for DigiCert TLM**

TrustGuardian AI is a single-page React application that simulates a DigiCert TLM-style Certificates dashboard with an embedded AI intelligence layer.
Instead of creating a separate AI product, this prototype enhances the existing certificate inventory workflow with contextual, explainable, and actionable risk intelligence.
<img width="1727" height="993" alt="image" src="https://github.com/user-attachments/assets/29fbdc53-5d51-4387-b5cf-1a15aa83dc00" />

---

## 🚀 Overview

This project transforms a traditional certificate inventory dashboard into a proactive, risk-aware decision system.
It:
* Detects high-risk certificates dynamically
* Calculates explainable risk and confidence scores
* Simulates outage and remediation scenarios
* Provides AI-powered workflow suggestions
* Maintains enterprise-grade UI consistency

All within a single page — no navigation, no context switching.

---

## 🏗 Architecture

* **Frontend:** React + Vite
* **Styling:** TailwindCSS (TLM-aligned enterprise styling)
* **State Management:** Internal React state (no routing)
* **Data Source:** Mock JSON dataset
* **Backend:** None (fully simulated intelligence layer)
The intelligence layer is modular and can integrate with backend telemetry or automation engines.

---

## 🧠 Core Features

### 1️⃣ Trust Intelligence Mode

* Toggle to enhance the existing inventory page
* Risk-based sorting and filtering
* High-risk production detection
* Dynamic KPI cards
* Explainable confidence tooltips

### 2️⃣ Risk Scoring Engine

Per certificate risk score is calculated dynamically:
* +40 if expiry < 7 days
* +30 if expiry < 15 days
* +20 if expiry < 30 days
* +30 if revenue critical
* +20 if no redundancy
* +10 if RSA-2048
* Capped at 100

Risk levels:
* High ≥ 80
* Medium ≥ 50
* Low < 50
 
### 3️⃣ Simulation Mode

* Preview impact if high-risk certificates fail
* Highlights affected dependency chains
* Updates projected risk reduction KPI
  
  <img width="1525" height="327" alt="image" src="https://github.com/user-attachments/assets/d0f04677-ecee-4bfe-b2ae-54cf6ca65209" />

### 4️⃣ Quantum Readiness Mode

* Subtle readiness indicators
* Migration priority suggestions
* Controlled enterprise-safe visual cues
  
  <img width="1535" height="401" alt="image" src="https://github.com/user-attachments/assets/f98d2e82-4b8d-47f1-ad0b-ba7440f50e25" />

### 5️⃣ Service Impact Path

* Visual dependency chain
* Revenue impact context
* Simulation-aware highlighting
  <img width="1726" height="942" alt="image" src="https://github.com/user-attachments/assets/de10c200-b4e1-4a3a-b023-351c63111814" />


### 6️⃣ AI Copilot Panel

* Context-aware suggestions
* Strategy modes (Conservative / Balanced / Aggressive)
* Preview Fix / Apply Fix / Auto-Fix
* Activity timeline
* Recalculation feedback

  <img width="902" height="1014" alt="image" src="https://github.com/user-attachments/assets/674f5974-43f0-4208-95d2-9cb354954aca" />
---

## 📊 Dynamic Capabilities

* Search, filter, sort
* Saved views
* Executive mode toggle
* CSV export
* Recalculation microinteractions
* Role-based UI (Analyst / Admin)
* Context-sensitive KPIs

All KPIs and projections update based on the currently visible inventory scope.

---

## 🎯 Business Value

* Proactive risk prioritization
* Reduced outage probability
* Executive-ready decision intelligence
* Workflow-native AI
* Scalable foundation for backend integration

---

## ▶️ Running Locally

```bash
npm install
npm run dev
```

App runs on:
```
http://localhost:5173
```

---

## 🧩 Future Enhancements

* Backend telemetry integration
* Real remediation APIs
* Predictive expiry modeling
* Certificate lifecycle automation
* ML-driven risk weighting
* Real-time data streaming

---

## 🏆 Hackathon Vision

TrustGuardian AI demonstrates how AI can be embedded directly into DigiCert TLM workflows — transforming operational tooling into strategic, business-aware intelligence.
Not a new product.
A smarter evolution of the existing one.

---
