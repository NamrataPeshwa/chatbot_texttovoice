# 🧠 Voice-Enabled AI Chatbot

An intelligent chatbot that talks back – literally!  
This project combines the power of **ReactJS**, **Python Flask**, **Ollama Phi-3 Mini**, and **ElevenLabs** to create a conversational assistant that responds with both **text and voice**.

---

## 🔧 Tech Stack

### Frontend
- ⚛️ **ReactJS** – Sleek, responsive, and interactive UI
- 🎧 Audio player for real-time voice replies

### Backend
- 🐍 **Flask (Python)** – Lightweight API for processing messages
- 🧠 **Ollama Phi-3 Mini** – Locally running LLM for generating smart responses
- 🗣️ **ElevenLabs API** – Converts text replies to natural-sounding voice

---

## 🚀 Features

- 🤖 Ask anything, get intelligent responses
- 🔊 Real-time voice replies using ElevenLabs TTS
- ⚡ Fast and responsive frontend built with React
- 🧩 Modular backend powered by Flask
- 🛠️ Local LLM inference via Ollama for privacy and speed

---


## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/voice-chatbot.git
cd chatbot_texttovoice
```
### 2. Backend Setup

```bash
cd backend
```
#### Create a virtual environment
```bash
python -m venv chatbot
```
Install dependencies:
```bash
pip install -r requirements.txt
```

###3. Create a .env file in the backend folder with the following content:
```bash
ELEVEN_API_KEY=your_elevenlabs_api_key
VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

Start the Flask backend server:

python app.py

###3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
