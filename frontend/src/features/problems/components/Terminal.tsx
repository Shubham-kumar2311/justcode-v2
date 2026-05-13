import React, { useState } from 'react';
import { Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import { api } from '../../../lib/axios';

interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string | null;
  passed: boolean;
  error: string | null;
}

interface Props {
  executionResult: { testCaseResults: TestCaseResult[], submissionStatus: string } | null;
  isExecuting: boolean;
  code: string;
  language: string;
  problemDescription: string;
  inputFormat: string;
}

export const Terminal: React.FC<Props> = ({ executionResult, isExecuting, code, language, problemDescription, inputFormat }) => {
  const [activeTab, setActiveTab] = useState<'output' | 'ai'>('output');
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const askAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    try {
      const response = await api.post('/ai/hint', {
        code,
        language,
        problemDescription,
        inputFormat,
        query: aiQuery,
      });
      setAiResponse(response.data.suggestion);
    } catch (err: any) {
      setAiResponse(`Error: ${err.response?.data?.message || 'Failed to get AI response'}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
      {/* Terminal Header Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
        <button 
          onClick={() => setActiveTab('output')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'transparent', 
            border: 'none', 
            borderBottom: activeTab === 'output' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'output' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500
          }}
        >
          <TerminalIcon size={16} /> Output
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: 'transparent', 
            border: 'none', 
            borderBottom: activeTab === 'ai' ? '2px solid var(--accent-secondary)' : '2px solid transparent',
            color: activeTab === 'ai' ? 'var(--accent-secondary)' : 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500
          }}
        >
          <Sparkles size={16} /> Ask AI
        </button>
      </div>

      {/* Terminal Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
        {activeTab === 'output' && (
          <div>
            {isExecuting ? (
              <div className="animate-pulse" style={{ color: 'var(--accent-primary)' }}>Executing code...</div>
            ) : !executionResult ? (
              <div style={{ color: 'var(--text-muted)' }}>Run your code to see the output here.</div>
            ) : (
              <div>
                <h4 style={{ color: executionResult.submissionStatus === 'Solved' ? 'var(--success)' : 'var(--error)', marginBottom: '1rem', fontSize: '1rem' }}>
                  Status: {executionResult.submissionStatus}
                </h4>
                
                {executionResult.testCaseResults.map((tc, idx) => (
                  <div key={idx} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', borderLeft: `4px solid ${tc.passed ? 'var(--success)' : 'var(--error)'}` }}>
                    <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Test Case {idx + 1} {tc.passed ? '✅' : '❌'}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <div><strong>Input:</strong> <pre style={{ display: 'inline' }}>{tc.input}</pre></div>
                      <div><strong>Expected:</strong> <pre style={{ display: 'inline' }}>{tc.expectedOutput}</pre></div>
                      <div><strong>Actual:</strong> <pre style={{ display: 'inline', color: tc.passed ? 'inherit' : 'var(--error)' }}>{tc.actualOutput || 'N/A'}</pre></div>
                      {tc.error && (
                        <div style={{ color: 'var(--error)', marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>
                          <strong>Error:</strong> <pre style={{ whiteSpace: 'pre-wrap' }}>{tc.error}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
              {aiResponse ? (
                <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--accent-secondary)' }}>
                  {aiResponse}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>Ask a question about your code or the problem.</div>
              )}
            </div>
            <form onSubmit={askAi} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="e.g., Why is my loop not terminating?"
                style={{ flex: 1, background: 'var(--bg-surface)', fontFamily: 'var(--font-sans)' }}
                disabled={isAiLoading}
              />
              <button type="submit" className="btn btn-primary" style={{ background: 'var(--accent-secondary)' }} disabled={isAiLoading || !aiQuery.trim()}>
                {isAiLoading ? 'Thinking...' : 'Ask'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
