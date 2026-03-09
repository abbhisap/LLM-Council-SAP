import './Sidebar.css';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}) {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="brand-icon">⚖️</div>
          <div className="brand-text">
            <h1>LLM Council</h1>
            <span>SAP Intelligence</span>
          </div>
        </div>
        <button className="new-chat-btn" onClick={onNewConversation}>
          ＋ New Session
        </button>
      </div>

      <div className="sidebar-section-label">Recent Sessions</div>

      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div style={{ padding: '16px', color: 'var(--text-dim)', fontSize: '12px', textAlign: 'center' }}>
            No sessions yet
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${conv.id === currentConversationId ? 'active' : ''}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-title">
                {conv.title || 'Untitled Session'}
              </div>
              <div className="conversation-meta">
                <span>{formatDate(conv.created_at)}</span>
                <span>·</span>
                <span>{conv.message_count} msg{conv.message_count !== 1 ? 's' : ''}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="status-indicator">
          <div className="status-dot"></div>
          5 Models Active · Groq API
        </div>
      </div>
    </div>
  );
}