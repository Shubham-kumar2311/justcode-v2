import React from 'react';

interface Problem {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  examples: { input: string; output: string }[];
  constraints: string;
}

interface Props {
  problem: Problem;
}

export const ProblemDescription: React.FC<Props> = ({ problem }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'var(--success)';
      case 'Medium': return 'var(--warning)';
      case 'Hard': return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div style={{ padding: '1.5rem', overflowY: 'auto', height: '100%' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{problem.title}</h1>
      <div style={{ 
        display: 'inline-block', 
        padding: '0.25rem 0.75rem', 
        borderRadius: '9999px', 
        fontSize: '0.875rem', 
        fontWeight: 500,
        color: getDifficultyColor(problem.difficulty),
        backgroundColor: `color-mix(in srgb, ${getDifficultyColor(problem.difficulty)} 15%, transparent)`,
        marginBottom: '1.5rem'
      }}>
        {problem.difficulty}
      </div>

      <div style={{ lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: '2rem', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: problem.description }} />

      <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Examples</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {problem.examples.map((ex, idx) => (
          <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Input:</span>
              <pre style={{ margin: '0.5rem 0', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{ex.input}</pre>
            </div>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Output:</span>
              <pre style={{ margin: '0.5rem 0', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{ex.output}</pre>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Constraints</h3>
      <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
        {problem.constraints}
      </div>
    </div>
  );
};
