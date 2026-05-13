import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{ padding: '2rem 0', textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          &copy; {new Date().getFullYear()} JUST-CODE. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
