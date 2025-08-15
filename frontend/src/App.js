import React, { useState, useRef, useEffect } from "react";

export default function ChatbotImproved() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]); // Array of { sender: "user"|"bot", text: string }
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { sender: "bot", text: data.response || "No response" }]);

        if (data.audio) {
          const audioBlob = base64ToBlob(data.audio, "audio/mpeg");
          const audioUrl = URL.createObjectURL(audioBlob);
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.play();
          }
        }
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: data.error || "Error from server" }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Network error" }]);
      console.error(err);
    }

    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) sendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        border: "1px solid #ccc",
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "#f9f9f9",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      <header
        style={{
          padding: 16,
          borderBottom: "1px solid #ddd",
          fontSize: 20,
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
          background: "#4a90e2",
        
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          userSelect: "none",
        }}
      >
        AI Chatbot
      </header>

      <main
        style={{
          flexGrow: 1,
          padding: 16,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "white",
          borderRadius: "0 0 12px 12px",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "#666", textAlign: "center", marginTop: 20 }}>
            Start the conversation by asking a question below.
          </p>
        )}

        {messages.map(({ sender, text }, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: sender === "user" ? "flex-end" : "flex-start",
              background: sender === "user" ? "#4a90e2" : "#e1e1e1",
              color: sender === "user" ? "white" : "#333",
              padding: "10px 16px",
              borderRadius: 20,
              maxWidth: "80%",
              whiteSpace: "pre-wrap",
              boxShadow:
                sender === "user"
                  ? "0 2px 8px rgba(74,144,226,0.3)"
                  : "0 2px 8px rgba(0,0,0,0.1)",
              fontSize: 16,
              lineHeight: 1.4,
            }}
          >
            {text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: 12,
          borderTop: "1px solid #ddd",
          display: "flex",
          gap: 8,
          background: "#fafafa",
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        }}
      >
        <textarea
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          disabled={loading}
          style={{
            flexGrow: 1,
            resize: "none",
            borderRadius: 20,
            border: "1px solid #ccc",
            padding: "8px 12px",
            fontSize: 16,
            fontFamily: "inherit",
            outline: "none",
            boxShadow: "inset 0 1px 3px rgb(0 0 0 / 0.1)",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#4a90e2")}
          onBlur={(e) => (e.target.style.borderColor = "#ccc")}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? "#a0c4ff" : "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: 20,
            padding: "0 20px",
            fontSize: 16,
            cursor: loading ? "not-allowed" : "pointer",
            userSelect: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Send message"
        >
          {loading ? (
            <svg
              style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }}
              viewBox="0 0 50 50"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="90 150"
                strokeDashoffset="0"
              />
            </svg>
          ) : (
            "Send"
          )}
        </button>
      </form>

      <audio ref={audioRef} style={{ display: "none" }} />
      <style>{`
        @keyframes spin {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 240; }
        }
      `}</style>
    </div>
  );
}
