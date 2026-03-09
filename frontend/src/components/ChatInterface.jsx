import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Stage1 from './Stage1';
import Stage2 from './Stage2';
import Stage3 from './Stage3';
import { api } from '../api';
import './ChatInterface.css';

const SAP_SUGGESTIONS = [
  '🔧 Configure automatic payment in SAP FI',
  '📊 Explain SAP S/4HANA migration steps',
  '⚡ Fix RABAX_STATE dump in FB60',
  '📋 Write functional spec for MM module',
];

export default function ChatInterface({ conversation, onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [attachedContext, setAttachedContext] = useState('');
  const [attachedLabel, setAttachedLabel] = useState('');
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    let finalMessage = input.trim();
    if (attachedContext) finalMessage = `${attachedContext}\n\n${finalMessage}`;
    if (finalMessage && !isLoading) {
      onSendMessage(finalMessage);
      setInput('');
      setAttachedContext('');
      setAttachedLabel('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsProcessingFile(true);
        try {
          const result = await api.transcribeAudio(audioBlob);
          setInput((prev) => prev + (prev ? ' ' : '') + result.text);
        } catch { alert('Voice transcription failed. Please try again.'); }
        finally { setIsProcessingFile(false); }
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch { alert('Microphone access denied!'); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessingFile(true);
    try {
      const result = await api.analyzeImage(file);
      setAttachedContext(`[Image: ${file.name}]\n${result.description}`);
      setAttachedLabel(`📸 ${file.name}`);
    } catch { alert('Image analysis failed.'); }
    finally { setIsProcessingFile(false); e.target.value = ''; }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessingFile(true);
    try {
      const result = await api.extractDocument(file);
      setAttachedContext(`[Document: ${file.name}]\n${result.text.substring(0, 3000)}`);
      setAttachedLabel(`📄 ${file.name}`);
    } catch { alert('Document extraction failed.'); }
    finally { setIsProcessingFile(false); e.target.value = ''; }
  };

  if (!conversation) {
    return (
      <div className="chat-interface">
        <div className="empty-state">
          <div className="empty-icon">⚖️</div>
          <h2>LLM Council</h2>
          <p>Your personal SAP intelligence panel — 5 AI experts debate every question</p>
          <div className="empty-chips">
            {SAP_SUGGESTIONS.map((s, i) => (
              <div key={i} className="empty-chip">
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const msgCount = conversation.messages.filter(m => m.role === 'user').length;

  return (
    <div className="chat-interface">

      {/* Header */}
      <div className="chat-header">
        <div>
          <div className="chat-title">
            {conversation.title || 'New Session'}
          </div>
          <div className="chat-subtitle">
            {msgCount} question{msgCount !== 1 ? 's' : ''} · 5 council members
          </div>
        </div>
        <div className="stage-badges">
          <span className="stage-badge badge-1">① Responses</span>
          <span className="stage-badge badge-2">② Rankings</span>
          <span className="stage-badge badge-3">③ Synthesis</span>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {conversation.messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h2>Start your session</h2>
            <p>Ask any SAP question — upload a screenshot, document, or use voice</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div key={index} className="message-group">
              {msg.role === 'user' ? (
                <div className="user-message">
                  <div className="message-label">You</div>
                  <div className="user-bubble">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="assistant-message">
                  <div className="assistant-label-row">
                    <div className="council-icon">⚖️</div>
                    <div className="message-label">LLM Council</div>
                  </div>
                  {msg.loading?.stage1 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      Stage 1 — Collecting individual responses...
                    </div>
                  )}
                  {msg.stage1 && <Stage1 responses={msg.stage1} />}
                  {msg.loading?.stage2 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      Stage 2 — Peer review & rankings...
                    </div>
                  )}
                  {msg.stage2 && (
                    <Stage2
                      rankings={msg.stage2}
                      labelToModel={msg.metadata?.label_to_model}
                      aggregateRankings={msg.metadata?.aggregate_rankings}
                    />
                  )}
                  {msg.loading?.stage3 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      Stage 3 — Chairman synthesizing final answer...
                    </div>
                  )}
                  {msg.stage3 && <Stage3 finalResponse={msg.stage3} />}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            Consulting the council...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment bar */}
      {attachedLabel && (
        <div className="attachment-bar">
          <span>📎 {attachedLabel} attached</span>
          <button onClick={() => { setAttachedContext(''); setAttachedLabel(''); }}>×</button>
        </div>
      )}

      {/* Processing bar */}
      {isProcessingFile && (
        <div className="processing-bar">
          <div className="spinner"></div>
          Processing file, please wait...
        </div>
      )}

      {/* Input area */}
      <div className="input-area">
        <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" style={{ display: 'none' }} onChange={handleDocumentUpload} />

        <div className="input-toolbar">
          <button className="tool-btn" onClick={() => imageInputRef.current?.click()} disabled={isLoading || isProcessingFile} title="Upload SAP screenshot">📸</button>
          <button className="tool-btn" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isProcessingFile} title="Upload PDF or Word doc">📄</button>
          <button className={`tool-btn ${isRecording ? 'recording' : ''}`} onClick={isRecording ? stopRecording : startRecording} disabled={isLoading || isProcessingFile} title="Voice input">
            {isRecording ? '⏹️' : '🎤'}
          </button>
          {isRecording
            ? <span className="recording-label">● REC — click ⏹️ to stop</span>
            : <span className="tool-label">📸 Image · 📄 Document · 🎤 Voice</span>
          }
        </div>

        <div className="input-row">
          <textarea
            className="message-input"
            placeholder={attachedLabel ? `File attached — type your question about it...` : `Ask your SAP question... (Enter to send, Shift+Enter for new line)`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={2}
          />
          <button
            className={`send-btn ${isLoading ? 'thinking' : ''}`}
            onClick={handleSubmit}
            disabled={(!input.trim() && !attachedContext) || isLoading}
          >
            {isLoading ? '⏳ Thinking' : 'Send ➤'}
          </button>
        </div>
      </div>
    </div>
  );
}
