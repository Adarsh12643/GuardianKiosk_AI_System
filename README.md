# Guardian Kiosk AI 🛡️

### Accelerated Emergency Response & Crisis Coordination in Hospitality
**Google Solution Challenge 2026 | Rapid Crisis Response Track**

---

## 📖 Overview
In the hospitality industry, emergency response times are often hampered by fragmented communication. When a crisis occurs, the "human" front desk can be overwhelmed, leaving guests without immediate instructions. 

**Guardian Kiosk AI** transforms a standard virtual receptionist into a **Rapid Crisis Coordinator**. Leveraging the **Gemini 1.5 Flash API**, the system instantly detects emergencies, provides localized life-saving instructions, and alerts the facility's safety team with a data-driven report.

## 🌍 UN SDG Alignment
Our project aligns with the following United Nations Sustainable Development Goals:
* **Goal 11: Sustainable Cities and Communities** - Decreasing the number of people affected by disasters through "smart" infrastructure.
* **Goal 9: Industry, Innovation, and Infrastructure** - Building resilient infrastructure by moving beyond simple automation to life-critical AI assistance.

## 🛠️ Technology Stack
* **Frontend**: React.js 
* **AI Engine**: Google Gemini 1.5 Flash API 
* **Backend**: Firebase Cloud Functions
* **Database**: Cloud Firestore
* **Hosting**: Firebase Hosting 
* **Alerts**: Google Cloud Pub/Sub 

## 🏗️ System Architecture
The system utilizes a high-availability flow to ensure low latency during emergencies:
1.  **Input Layer**: Captures voice/text via React.
2.  **Intelligence Layer**: Gemini API performs "Crisis Triage" to identify emergency type and severity (1-10).
3.  **Action Layer**: Switches the UI to high-contrast "Emergency Mode" and triggers staff alerts via Cloud Pub/Sub.

## 🚀 Getting Started

### Prerequisites
* Node.js & npm
* Firebase CLI
* Google Gemini API Key

### Installation
1.  **Clone the repository**:
    ```bash
    git clone [https://github.com/Adarsh12643/guardian-kiosk.git](https://github.com/Adarsh12643/guardian-kiosk.git)
    cd guardian-kiosk
    ```
2.  **Install dependencies**:
    ```bash
    npm install @google/generative-ai axios firebase lucide-react [cite: 73]
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
This project is licensed under the **MIT License**.
