"use client";

/// <reference path="../../types/model-viewer.d.ts" />

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";

// Simple message type
type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  ts: number;
};

// Utility to generate ids
const uid = () => Math.random().toString(36).slice(2);

export default function CleopatraAssistant() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: uid(),
      role: "assistant",
      ts: Date.now(),
      content:
        "Welcome! Ask about fleets, itineraries, schedules, rates, availability, or tailor‑made journeys.",
    },
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for external toggle events from the unified floating dock
  useEffect(() => {
    const handler = () => setOpen((v) => !v);
    window.addEventListener('cleopatra-toggle', handler);
    return () => window.removeEventListener('cleopatra-toggle', handler);
  }, []);

  const scrollRef = useRef<HTMLDivElement>(null);

  const canUseModelViewer = useMemo(() => {
    if (typeof window === "undefined") return false;
    try {
      return !!(window as Window & { customElements?: { get?: (name: string) => unknown } }).customElements?.get?.("model-viewer");
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: uid(), role: "user", content: text, ts: Date.now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-10).map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) throw new Error("Assistant API failed");
      const data = await res.json();
      const assistantText: string = data?.reply || "I couldn't process that request. Please try again.";

      const aiMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: assistantText,
        ts: Date.now(),
      };
      setMessages((m) => [...m, aiMsg]);
    } catch (e) {
      const errMsg: ChatMessage = {
        id: uid(),
        role: "assistant",
        content:
          "I'm having trouble reaching my knowledge source. You can still explore: /dahabiyas, /itineraries, /packages, /schedule-and-rates, or contact us at /contact.",
        ts: Date.now(),
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Panel only: opened via FloatingDock trigger */}
      {open && (
        <div
          role="dialog"
          aria-label="Cleopatra AI Assistant"
          style={{
            position: "fixed",
            right: "1.0rem",
            bottom: "4.75rem",
            zIndex: 60,
            width: "min(90vw, 340px)",
            maxHeight: "min(60vh, 560px)",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(16px)",
            borderRadius: "14px",
            border: "1px solid rgba(0,128,255,0.25)",
            boxShadow: "0 16px 32px rgba(0,0,0,0.18)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header: 3D model only (no title box), compact */}
          <div style={{ 
            padding: "0.5rem 0.75rem", 
            borderBottom: "1px solid rgba(0,128,255,0.15)",
            background: "linear-gradient(135deg, rgba(0,128,255,0.06) 0%, rgba(0,64,160,0.04) 100%)",
            position: "relative",
            overflow: "visible",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            {/* 3D Model Display - circular */}
            <div style={{ 
              position: "relative",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              overflow: "hidden",
              boxShadow: "0 6px 18px rgba(59, 130, 246, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              background: "transparent"
            }}>
              {canUseModelViewer ? (
                React.createElement('model-viewer', {
                  src: "/images/cleopatra_-_egyptian_queen.glb",
                  alt: "Cleopatra 3D",
                  'auto-rotate': true,
                  'rotation-per-second': "30deg",
                  exposure: "1.2",
                  'camera-orbit': "0deg 75deg 2.5m",
                  style: { width: "100%", height: "100%", background: "transparent" }
                })
              ) : (
                <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                  <div className="animate-pulse rounded-full" style={{ width: 18, height: 18, backgroundColor: 'rgba(59,130,246,0.8)' }} />
                </div>
              )}
            </div>

            {/* Close Button */}
            <button
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
              style={{
                width: "1.75rem",
                height: "1.75rem",
                display: "grid",
                placeItems: "center",
                borderRadius: "8px",
                border: "1px solid rgba(59,130,246,0.25)",
                background: "white",
                color: "#1e3a8a",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.6rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
              background: "linear-gradient(180deg, rgba(0,128,255,0.03) 0%, #fff 40%)",
            }}
          >
            {messages.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    maxWidth: "85%",
                    whiteSpace: "pre-wrap",
                    fontSize: ".9rem",
                    lineHeight: 1.4,
                    padding: "0.6rem 0.75rem",
                    borderRadius: "12px",
                    border: "1px solid rgba(0,0,0,0.06)",
                    color: m.role === "user" ? "white" : "#1a202c",
                    background:
                      m.role === "user"
                        ? "linear-gradient(135deg, rgba(0,128,255,0.95), rgba(0,64,160,0.95))"
                        : "#f7fafc",
                    boxShadow: m.role === "user" ? "0 6px 16px rgba(0,128,255,0.25)" : "none",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: ".4rem", alignItems: "center", color: "#2b6cb0", fontSize: ".85rem" }}>
                <Bot size={14} /> Cleopatra is thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              borderTop: "1px solid rgba(0,128,255,0.25)",
              padding: "0.5rem",
              background: "white",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                aria-label="Type your question"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about fleets, itineraries, rates, availability..."
                style={{
                  flex: 1,
                  padding: "0.55rem 0.75rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(0,128,255,0.3)",
                  outline: "none",
                  fontSize: ".9rem",
                }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".35rem",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(0,128,255,0.3)",
                  background: loading || !input.trim() ? "#e2e8f0" : "linear-gradient(135deg, #0080ff, #0040a0)",
                  color: loading || !input.trim() ? "#4a5568" : "#fff",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                }}
              >
                <Send size={16} />
              </button>
            </div>
              <div style={{ marginTop: "0.3rem", fontSize: ".7rem", color: "#718096" }}>
              By using this assistant you agree to our terms at /privacy and /terms.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
