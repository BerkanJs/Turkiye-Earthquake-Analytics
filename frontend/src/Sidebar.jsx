import React from 'react';

const charts = [
  { id: 'mag-over-time', name: 'Bölge - Magnitüd', icon: '📈' },
  { id: 'count-by-region', name: 'Bölge - Deprem Frekansı', icon: '📊' },
  { id: 'depth-histogram', name: 'Genel Magnitüd Dağılımı', icon: '📉' },
  { id: 'scatter-plot', name: 'Derinlik-Büyüklük İlişkisi', icon: '🗺️' },
];

export default function Sidebar({ onSelect }) {
  return (
    <div style={{
      width: '220px',
      backgroundColor: '#2d3748',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      height: '100vh',
      overflowY: 'auto',
    }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>📊 Grafikler</h2>

      {charts.map(({ id, name, icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1rem',
            fontSize: '1rem',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: '6px',
            cursor: 'pointer',
            color: 'white',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#63b3ed')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}
        >
          <span style={{ fontSize: '1.3rem' }}>{icon}</span>
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
}
