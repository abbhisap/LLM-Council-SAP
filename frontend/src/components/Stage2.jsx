import './Stage2.css';

export default function Stage2({ rankings, labelToModel, aggregateRankings }) {
  if (!rankings || rankings.length === 0) return null;

  const maxScore = aggregateRankings
    ? Math.max(...Object.values(aggregateRankings))
    : 1;

  return (
    <div className="stage2-container">
      <div className="stage2-header">
        <span className="stage2-title">② Stage 2 — Peer Rankings</span>
      </div>
      <div className="stage2-body">
        {rankings.map((r, i) => (
          <div key={i} className="ranking-item">
            <div className={`rank-badge rank-${i < 3 ? i + 1 : 'other'}`}>
              {i + 1}
            </div>
            <div className="rank-content">
              <div className="rank-model">
                {labelToModel?.[r.label] || r.model || r.label || `Model ${i + 1}`}
              </div>
              <div className="rank-text">
                {r.reasoning || r.justification || r.response || ''}
              </div>
            </div>
          </div>
        ))}
      </div>

      {aggregateRankings && Object.keys(aggregateRankings).length > 0 && (
        <div className="aggregate-section">
          <div className="aggregate-title">Aggregate Scores</div>
          <div className="aggregate-bars">
            {Object.entries(aggregateRankings)
              .sort((a, b) => b[1] - a[1])
              .map(([model, score], i) => (
                <div key={i} className="agg-bar-row">
                  <div className="agg-bar-label">{model}</div>
                  <div className="agg-bar-track">
                    <div
                      className="agg-bar-fill"
                      style={{ width: `${(score / maxScore) * 100}%` }}
                    />
                  </div>
                  <div className="agg-bar-score">{score}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}