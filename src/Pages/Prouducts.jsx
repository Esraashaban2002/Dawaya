import React, { useState } from 'react';
import { ProuductsOurs } from './Prouducts_ours';
import { ProuductsTheirs } from './Prouducts_theirs';

export default function Prouducts() {
  const [version, setVersion] = useState('ours');

  return (
    <div style={{ position: 'relative' }}>
      {/* Version switch toggler */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: 'rgba(30, 41, 59, 0.9)',
        backdropFilter: 'blur(8px)',
        padding: '6px',
        borderRadius: '30px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        gap: '4px',
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif'
      }}>
        <button
          onClick={() => setVersion('ours')}
          style={{
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: version === 'ours' ? '#1ab5ea' : 'transparent',
            color: '#fff'
          }}
        >
          التصميم الحالي (Ours)
        </button>
        <button
          onClick={() => setVersion('theirs')}
          style={{
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: version === 'theirs' ? '#1ab5ea' : 'transparent',
            color: '#fff'
          }}
        >
          التصميم المقترح (Theirs)
        </button>
      </div>

      {version === 'ours' ? <ProuductsOurs /> : <ProuductsTheirs />}
    </div>
  );
}
