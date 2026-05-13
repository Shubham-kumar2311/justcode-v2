import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Zap, Shield, Cpu } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="container flex-center" style={{ flexDirection: 'column', textAlign: 'center', padding: '6rem 1.5rem', minHeight: '80vh' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-surface)', borderRadius: '9999px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600 }}>v2.0 Beta</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Now with AI-powered hints</span>
        </div>
        
        <h1 style={{ fontSize: '4rem', letterSpacing: '-0.025em', marginBottom: '1.5rem', maxWidth: '800px' }}>
          Master algorithms with <span className="gradient-text">JUST-CODE</span>
        </h1>
        
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px' }}>
          Elevate your coding skills with our modern, blazing-fast platform. Solve problems, get real-time feedback, and learn with AI assistance.
        </p>
        
        <div className="flex-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/problems" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Start Coding Now
          </Link>
          <Link to="/signup" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
            Create an Account
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ backgroundColor: 'var(--bg-surface)', padding: '6rem 0', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Why choose JUST-CODE?</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <FeatureCard 
              icon={<Zap size={32} color="var(--accent-primary)" />}
              title="Lightning Fast Execution"
              description="Our optimized backend ensures your code runs and tests evaluate in milliseconds, keeping you in the flow."
            />
            <FeatureCard 
              icon={<Cpu size={32} color="var(--accent-secondary)" />}
              title="AI-Powered Assistance"
              description="Stuck on a tricky problem? Our integrated AI provides hints, reviews code, and analyzes complexity."
            />
            <FeatureCard 
              icon={<Shield size={32} color="var(--success)" />}
              title="Secure Environment"
              description="Execute untrusted code safely. We utilize industry-standard sandboxing (Judge0) to protect our infrastructure."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="glass-card" style={{ padding: '2rem' }}>
    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', display: 'inline-block', borderRadius: '12px' }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{description}</p>
  </div>
);

export default LandingPage;
