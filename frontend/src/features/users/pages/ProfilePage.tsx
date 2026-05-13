import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/axios';
import { useAuth } from '../../../context/AuthContext';
import { User, Settings, Activity } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'settings'>('stats');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', user?._id],
    queryFn: async () => {
      const response = await api.get('/user/profile');
      return response.data;
    },
    enabled: !!user,
  });

  // Profile Update State
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateMsg({ type: '', text: '' });
    setIsUpdating(true);

    try {
      const payload: any = {};
      if (username !== user?.username) payload.username = username;
      if (email !== user?.email) payload.email = email;
      if (password) payload.password = password;

      if (Object.keys(payload).length === 0) {
        setUpdateMsg({ type: 'warning', text: 'No changes made.' });
        setIsUpdating(false);
        return;
      }

      const response = await api.put('/user/profile', payload);
      if (response.data.success) {
        setUpdateMsg({ type: 'success', text: 'Profile updated successfully!' });
        login(response.data.user); // Update context
        setPassword('');
      }
    } catch (err: any) {
      setUpdateMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="flex-center" style={{ minHeight: 'calc(100vh - 64px)' }}>Loading profile...</div>;
  if (isError || !data) return <div className="flex-center" style={{ minHeight: 'calc(100vh - 64px)', color: 'var(--error)' }}>Failed to load profile.</div>;

  const { stats, totalProblems, submissions } = data;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', minHeight: 'calc(100vh - 64px - 80px)' }}>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Sidebar */}
        <div style={{ flex: '1', minWidth: '250px', maxWidth: '300px' }}>
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', border: '1px solid var(--accent-primary)' }}>
              <User size={40} color="var(--accent-primary)" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{user?.username}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
          </div>

          <div className="glass-card" style={{ padding: '0.5rem' }}>
            <button 
              onClick={() => setActiveTab('stats')}
              style={{ width: '100%', padding: '1rem', background: activeTab === 'stats' ? 'var(--bg-secondary)' : 'transparent', border: 'none', color: activeTab === 'stats' ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
            >
              <Activity size={18} /> Activity & Stats
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              style={{ width: '100%', padding: '1rem', background: activeTab === 'settings' ? 'var(--bg-secondary)' : 'transparent', border: 'none', color: activeTab === 'settings' ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}
            >
              <Settings size={18} /> Settings
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: '3', minWidth: '300px' }}>
          
          {activeTab === 'stats' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Problem Solving Stats</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                <StatCard title="Easy" solved={stats.easy} total={totalProblems.easy} color="var(--success)" />
                <StatCard title="Medium" solved={stats.medium} total={totalProblems.medium} color="var(--warning)" />
                <StatCard title="Hard" solved={stats.hard} total={totalProblems.hard} color="var(--error)" />
              </div>

              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Recent Submissions</h2>
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                {submissions.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No submissions yet.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Time Submitted</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Problem</th>
                        <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.slice(0, 10).map((sub: any, idx: number) => (
                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                            {new Date(sub.submittedAt).toLocaleString()}
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <Link to={`/problems/${sub.problemId._id}`} style={{ fontWeight: 500 }}>
                              {sub.problemId.title}
                            </Link>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', color: sub.status === 'Solved' ? 'var(--success)' : 'var(--error)' }}>
                            {sub.status}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-fade-in glass-card" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Account Settings</h2>
              
              {updateMsg.text && (
                <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: updateMsg.type === 'success' ? 'var(--success-bg)' : updateMsg.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'var(--error-bg)', color: updateMsg.type === 'success' ? 'var(--success)' : updateMsg.type === 'warning' ? 'var(--warning)' : 'var(--error)' }}>
                  {updateMsg.text}
                </div>
              )}

              <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '500px' }}>
                <div>
                  <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                  />
                </div>

                <div>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>New Password (leave blank to keep current)</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={isUpdating} style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, solved, total, color }: { title: string, solved: number, total: number, color: string }) => {
  const percentage = total === 0 ? 0 : Math.round((solved / total) * 100);
  
  return (
    <div className="glass-card" style={{ padding: '1.5rem', borderLeft: `4px solid ${color}` }}>
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 700 }}>{solved}</span>
        <span style={{ color: 'var(--text-secondary)' }}>/ {total}</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'var(--bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${percentage}%`, background: color, transition: 'width 1s ease-out' }}></div>
      </div>
    </div>
  );
};

export default ProfilePage;
