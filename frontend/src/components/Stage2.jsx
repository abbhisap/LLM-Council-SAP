import './Stage2.css';

export default function Stage2({ rankings, labelToModel, aggregateRankings }) {
  if (!rankings || !Array.isArray(rankings) || rankings.length === 0) return null;

  // Handle aggregateRankings whether it's an object OR array of objects
  let safeAggregate = [];
  try {
    if (Array.isArray(aggregateRankings)) {
      // Backend sends array: [{model, average_rank, rankings_count}]
      safeAggregate = aggregateRankings
        .filter(item => item && item.model)
        .sort((a, b) => (a.average_rank || 0) - (b.average_rank || 0));
    } else if (aggregateRankings && typeof aggregateRankings === 'object') {
      // Backend sends object: {modelName: score}
      safeAggregate = Object.entries(aggregateRankings)
        .map(([model, score]) => ({ model, average_rank: score }))
        .sort((a, b) => a.average_rank - b.average_rank);
    }
  } catch (e) {
    safeAggregate = [];
  }

  const maxRank = safeAggregate.length > 0
    ? Math.max(...safeAggregate.map(x => x.average_rank || 1))
    : 1;

  return (
    <div className="stage2-container">
      <div className="stage2-header">
        <span className="stage2-title">② Stage 2 — Peer Rankings</span>
      </div>

      <div className="stage2-body">
        {rankings.map((r, i) => {
          if (!r) return null;

          const modelName = (labelToModel && r.label && labelToModel[r.label])
            || r.model || r.label || `Model ${i + 1}`;

          const reasonText = r.reasoning || r.justification
            || r.response || r.content || '';

          return (
            <div key={i} className="ranking-item">
              <div className={`rank-badge rank-${i < 3 ? i + 1 : 'other'}`}>
                {i + 1}
              </div>
              <div className="rank-content">
                <div className="rank-model">{String(modelName)}</div>
                <div className="rank-text">
                  {typeof reasonText === 'string'
                    ? reasonText.substring(0, 300)
                    : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {safeAggregate.length > 0 && (
        <div className="aggregate-section">
          <div className="aggregate-title">Aggregate Scores</div>
          <div className="aggregate-bars">
            {safeAggregate.map((item, i) => (
              <div key={i} className="agg-bar-row">
                <div className="agg-bar-label">
                  {String(item.model || `Model ${i + 1}`)}
                </div>
                <div className="agg-bar-track">
                  <div
                    className="agg-bar-fill"
                    style={{
                      width: `${Math.round(
                        ((maxRank - (item.average_rank || 0) + 1) / maxRank) * 100
                      )}%`
                    }}
                  />
                </div>
                <div className="agg-bar-score">
                  {typeof item.average_rank === 'number'
                    ? item.average_rank.toFixed(1)
                    : String(item.average_rank || 0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
