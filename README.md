# Guardian Kiosk AI 🛡️

### Accelerated Emergency Response & Crisis Coordination in Hospitality
**Google Solution Challenge 2026 | Rapid Crisis Response Track**

---

## 📖 Overview
[cite_start]In the hospitality industry, emergency response times are often hampered by fragmented communication[cite: 37]. [cite_start]When a crisis occurs, the "human" front desk can be overwhelmed, leaving guests without immediate instructions[cite: 38]. 

[cite_start]**Guardian Kiosk AI** transforms a standard virtual receptionist into a **Rapid Crisis Coordinator**[cite: 39]. [cite_start]Leveraging the **Gemini 1.5 Flash API**, the system instantly detects emergencies, provides localized life-saving instructions, and alerts the facility's safety team with a data-driven report[cite: 40].

## 🌍 UN SDG Alignment
Our project aligns with the following United Nations Sustainable Development Goals:
* [cite_start]**Goal 11: Sustainable Cities and Communities** - Decreasing the number of people affected by disasters through "smart" infrastructure[cite: 48, 49, 50].
* [cite_start]**Goal 9: Industry, Innovation, and Infrastructure** - Building resilient infrastructure by moving beyond simple automation to life-critical AI assistance[cite: 52, 53, 54].

## 🛠️ Technology Stack
* [cite_start]**Frontend**: React.js [cite: 34]
* [cite_start]**AI Engine**: Google Gemini 1.5 Flash API [cite: 92]
* [cite_start]**Backend**: Firebase Cloud Functions [cite: 59]
* [cite_start]**Database**: Cloud Firestore [cite: 67]
* [cite_start]**Hosting**: Firebase Hosting [cite: 104]
* [cite_start]**Alerts**: Google Cloud Pub/Sub [cite: 67]

## 🏗️ System Architecture
[cite_start]The system utilizes a high-availability flow to ensure low latency during emergencies[cite: 56]:
1.  [cite_start]**Input Layer**: Captures voice/text via React[cite: 58].
2.  [cite_start]**Intelligence Layer**: Gemini API performs "Crisis Triage" to identify emergency type and severity (1-10)[cite: 60, 63].
3.  [cite_start]**Action Layer**: Switches the UI to high-contrast "Emergency Mode" and triggers staff alerts via Cloud Pub/Sub[cite: 65, 67].

## 🚀 Getting Started

### Prerequisites
* Node.js & npm
* Firebase CLI
* Google Gemini API Key

### Installation
1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/YOUR_USERNAME/guardian-kiosk.git](https://github.com/YOUR_USERNAME/guardian-kiosk.git)
    cd guardian-kiosk
    ```
2.  **Install dependencies**:
    ```bash
    [cite_start]npm install @google/generative-ai axios firebase lucide-react [cite: 73]
    ```
3.  **Set up Environment Variables**:
    Create a `.env` file and add your key:
    ```env
    REACT_APP_GEMINI_KEY=your_api_key_here
    ```
4.  **Run the project**:
    ```bash
    npm start
    ```

## ⚖️ License
[cite_start]This project is licensed under the **MIT License**[cite: 126].
