import React, { useState, useRef } from "react";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.response || "No response");

        if (data.audio) {
          // Create a blob from base64
          const audioBlob = base64ToBlob(data.audio, "audio/mpeg");
          const audioUrl = URL.createObjectURL(audioBlob);

          // Play the audio
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
          }
        }
      } else {
        setResponse(data.error || "Error from server");
      }
    } catch (err) {
      setResponse("Network error");
      console.error(err);
    }

    setLoading(false);
  };

  // Helper: convert base64 to Blob
  function base64ToBlob(base64, type = "application/octet-stream") {
    const binary = atob(base64);
    const len = binary.length;
    const buffer = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    return new Blob([buffer], { type });
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "sans-serif" }}>
      <h2>Chatbot</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask me anything..."
          disabled={loading}
          style={{ width: "80%", padding: 8, fontSize: 16 }}
        />
        <button type="submit" disabled={loading} style={{ padding: "8px 16px", marginLeft: 8 }}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </form>

      <div style={{ marginTop: 20, minHeight: 50 }}>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>

      <audio ref={audioRef} controls style={{ width: "100%" }} />
    </div>
  );
}
