import './Stage1.css';

export default function Stage1({ responses }) {
  if (!responses || responses.length === 0) return null;
  return (
    <div className="stage1-container">
      <div className="stage1-header">
        <span className="stage1-title">① Stage 1 — Individual Responses</span>
        <span className="stage1-count">{responses.length} models</span>
      </div>
      <div className="stage1-grid">
        {responses.map((r, i) => (
          <div key={i} className="response-card">
            <div className="response-card-header">
              <div className="model-dot"></div>
              <span className="model-name">{r.model || r.name || `Model ${i + 1}`}</span>
            </div>
            <div className="response-card-body">
              {r.response || r.content || ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}