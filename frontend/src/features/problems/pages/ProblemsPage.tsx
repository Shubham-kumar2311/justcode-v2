import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/axios';
import { Search, Filter } from 'lucide-react';

interface Problem {
  _id: string;
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const fetchProblems = async (page: number, search: string, difficulty: string) => {
  const params = new URLSearchParams({ page: page.toString(), limit: '20' });
  if (search) params.append('search', search);
  if (difficulty) params.append('difficulty', difficulty);
  
  const response = await api.get('/problems', { params });
  return response.data;
};

export const ProblemsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['problems', page, search, difficulty],
    queryFn: () => fetchProblems(page, search, difficulty),
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return 'var(--success)';
      case 'Medium': return 'var(--warning)';
      case 'Hard': return 'var(--error)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px - 80px)' }}>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Problems</h1>
        
        <div className="flex-center" style={{ gap: '1rem', width: '100%', maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search problems..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          
          <div style={{ position: 'relative', width: '150px' }}>
            <Filter size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <select 
              value={difficulty} 
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
              style={{ paddingLeft: '2.5rem', appearance: 'none' }}
            >
              <option value="">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div className="flex-center" style={{ padding: '4rem' }}>Loading problems...</div>
        ) : isError ? (
          <div className="flex-center" style={{ padding: '4rem', color: 'var(--error)' }}>Failed to load problems.</div>
        ) : data?.data?.length === 0 ? (
          <div className="flex-center" style={{ padding: '4rem', color: 'var(--text-secondary)' }}>No problems found matching your criteria.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Title</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((problem: Problem) => (
                <tr key={problem._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    {/* Placeholder for status icon (solved/attempted). Would need user progress fetched separately or included in list API */}
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <Link to={`/problems/${problem._id}`} style={{ fontWeight: 500 }}>
                      {problem.id}. {problem.title}
                    </Link>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ color: getDifficultyColor(problem.difficulty) }}>
                      {problem.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination controls */}
      {data && data.totalPages > 1 && (
        <div className="flex-center" style={{ marginTop: '2rem', gap: '1rem' }}>
          <button 
            className="btn btn-secondary" 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span style={{ color: 'var(--text-secondary)' }}>
            Page {page} of {data.totalPages}
          </span>
          <button 
            className="btn btn-secondary" 
            disabled={page === data.totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProblemsPage;
