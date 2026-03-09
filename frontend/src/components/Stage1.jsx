import './Stage1.css';

export default function Stage1({ responses }) {
  // Safety checks
  if (!responses) return null;
  if (!Array.isArray(responses)) return null;
  if (responses.length === 0) return null;

  return (
    <div className="stage1-container">
      <div className="stage1-header">
        <span className="stage1-title">① Stage 1 — Individual Responses</span>
        <span className="stage1-count">{responses.length} models</span>
      </div>
      <div className="stage1-grid">
        {responses.map((r, i) => {
          if (!r) return null;

          const modelName = r.model || r.name || `Model ${i + 1}`;
          const responseText = r.response || r.content || r.text || '';

          return (
            <div key={i} className="response-card">
              <div className="response-card-header">
                <div className="model-dot"></div>
                <span className="model-name">{modelName}</span>
              </div>
              <div className="response-card-body">
                {typeof responseText === 'string'
                  ? responseText
                  : JSON.stringify(responseText)
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
