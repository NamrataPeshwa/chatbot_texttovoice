from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate
import requests
import base64
import tempfile
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()
template = '''
Answer the question below.
Here is the conversation history:
{context}
Question:
{question}
Answer:
'''

model = OllamaLLM(model="phi3:mini")
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
VOICE_ID = os.getenv("VOICE_ID")

context = ""

def text_to_speech(text):
    eleven_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": text,
        "voice_settings": {"stability": 0.7, "similarity_boost": 0.75},
    }
    response = requests.post(eleven_url, headers=headers, json=payload)
    if response.status_code != 200:
        print("TTS request failed:", response.text)
        return None
    return response.content

@app.route("/chat", methods=["POST"])
def chat():
    global context
    data = request.get_json()
    user_input = data.get("question", "")

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    # Get response from model
    result = chain.invoke({"context": context, "question": user_input}).strip()
    context += f"\nUser: {user_input}\nAI: {result}"

    # Get TTS audio
    audio_data = text_to_speech(result)
    audio_base64 = base64.b64encode(audio_data).decode("utf-8") if audio_data else ""

    return jsonify({
        "response": result,
        "audio": audio_base64  # frontend will play it using Audio element
    })

if __name__ == "__main__":
    app.run(debug=True)
