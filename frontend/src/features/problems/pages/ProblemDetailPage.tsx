import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import { ProblemDescription } from '../components/ProblemDescription';
import { CodeEditor } from '../components/CodeEditor';
import { Terminal } from '../components/Terminal';
import { Stopwatch } from '../components/Stopwatch';
import { Play, Send } from 'lucide-react';

export const ProblemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<any>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['problem', id],
    queryFn: async () => {
      const response = await api.get(`/problems/${id}`);
      return response.data;
    },
  });

  // Default code setup when problem loads
  useEffect(() => {
    if (data?.problem && !code) {
      // In a full implementation, we'd fetch the default code template based on language
      // For now, just set a basic template or leave empty
      if (data.userStatus?.code) {
        setCode(data.userStatus.code);
        setLanguage(data.userStatus.language || 'javascript');
      } else {
        setCode('// Write your code here\n');
      }
    }
  }, [data, code]);

  const handleRunCode = async (submit: boolean = false) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);
    try {
      const endpoint = submit ? '/submissions/submit' : '/execution/run';
      const response = await api.post(endpoint, {
        code,
        language,
        problemId: data.problem._id,
      });
      setExecutionResult(response.data);
    } catch (err: any) {
      setExecutionResult({
        submissionStatus: 'Error',
        testCaseResults: [{
          input: 'N/A',
          expectedOutput: 'N/A',
          actualOutput: null,
          passed: false,
          error: err.response?.data?.message || 'Execution failed due to server error',
        }],
      });
    } finally {
      setIsExecuting(false);
    }
  };

  if (isLoading) return <div className="flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>Loading problem...</div>;
  if (isError || !data?.problem) return <div className="flex-center" style={{ minHeight: 'calc(100vh - 64px)', color: 'var(--error)' }}>Problem not found.</div>;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      
      {/* Left Panel: Description */}
      <div style={{ width: '40%', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
        <ProblemDescription problem={data.problem} />
      </div>

      {/* Right Panel: Editor & Terminal */}
      <div style={{ width: '60%', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
        
        {/* Toolbar */}
        <div className="flex-between" style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
          <div className="flex-center" style={{ gap: '1rem' }}>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              style={{ padding: '0.5rem', background: 'var(--bg-secondary)', width: 'auto' }}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="c">C</option>
            </select>
            
            <Stopwatch />
          </div>

          <div className="flex-center" style={{ gap: '0.5rem' }}>
            <button 
              onClick={() => handleRunCode(false)} 
              disabled={isExecuting}
              className="btn btn-secondary"
            >
              <Play size={16} /> Run Code
            </button>
            <button 
              onClick={() => handleRunCode(true)} 
              disabled={isExecuting}
              className="btn btn-primary"
            >
              <Send size={16} /> Submit
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div style={{ flex: 6, overflow: 'hidden' }}>
          <CodeEditor code={code} language={language} onChange={setCode} />
        </div>

        {/* Terminal Area */}
        <div style={{ flex: 4, overflow: 'hidden' }}>
          <Terminal 
            executionResult={executionResult} 
            isExecuting={isExecuting} 
            code={code}
            language={language}
            problemDescription={data.problem.description}
            inputFormat={data.problem.input_form}
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
