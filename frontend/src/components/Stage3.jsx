import './Stage3.css';
import ReactMarkdown from 'react-markdown';

export default function Stage3({ finalResponse }) {
  if (!finalResponse) return null;
  return (
    <div className="stage3-container">
      <div className="stage3-header">
        <span className="stage3-icon">✨</span>
        <span className="stage3-title">Stage 3 — Final Synthesis</span>
      </div>
      <div className="stage3-body">
        <div className="markdown-content">
          <ReactMarkdown>{finalResponse.response || finalResponse.content || ''}</ReactMarkdown>
        </div>
      </div>
      {finalResponse.model && (
        <div className="stage3-model">Chairman: {finalResponse.model}</div>
      )}
    </div>
  );
}
