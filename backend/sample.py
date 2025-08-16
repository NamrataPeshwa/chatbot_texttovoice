from langchain_ollama import OllamaLLM
from langchain.prompts import ChatPromptTemplate
import requests
import base64
import tempfile
import os
from dotenv import load_dotenv
from playsound import playsound

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
        print("TTS request failed")
        return None
    return response.content

def handle():
    context = ""
    print("Welcome to the chatbot! Type 'exit' to quit.")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            break

        result = chain.invoke({"context": context, "question": user_input}).strip()
        print("Bot:", result)

        audio_data = text_to_speech(result)
        if audio_data:
            # Save audio to temp mp3 file and play
            with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
                tmp.write(audio_data)
                tmp_path = tmp.name
            playsound(str(tmp_path).replace("\\", "/"))
            os.remove(tmp_path)

        context += f"\nUser: {user_input}\nAI: {result}"

if __name__ == "__main__":
    handle()
