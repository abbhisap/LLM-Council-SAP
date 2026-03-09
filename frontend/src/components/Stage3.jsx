import './Stage3.css';
import ReactMarkdown from 'react-markdown';

export default function Stage3({ finalResponse }) {
  // Safety checks
  if (!finalResponse) return null;
  if (typeof finalResponse !== 'object') return null;

  // Safely extract response text
  const responseText = finalResponse.response
    || finalResponse.content
    || finalResponse.text
    || (typeof finalResponse === 'string' ? finalResponse : '')
    || '';

  const modelName = finalResponse.model || finalResponse.name || '';

  if (!responseText) return null;

  return (
    <div className="stage3-container">
      <div className="stage3-header">
        <span className="stage3-icon">✨</span>
        <span className="stage3-title">③ Stage 3 — Final Synthesis</span>
      </div>
      <div className="stage3-body">
        <div className="markdown-content">
          <ReactMarkdown>{responseText}</ReactMarkdown>
        </div>
      </div>
      {modelName && (
        <div className="stage3-model">Chairman: {modelName}</div>
      )}
    </div>
  );
}