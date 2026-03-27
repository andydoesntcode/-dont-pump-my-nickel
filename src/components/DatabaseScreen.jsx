import React, { useState } from 'react';
import { NICKEL_DB } from '../data/nickelDB';

function getNichelBadge(nichel) {
  if (nichel === null) return { label: 'N.D.',          bg: '#F5F5F5',   color: '#A0B080' };
  if (nichel <= 50)    return { label: `${nichel} mcg`, bg: '#E8F5E9',   color: '#4CAF50' };
  if (nichel <= 150)   return { label: `${nichel} mcg`, bg: '#FFF9E6',   color: '#FF8C00' };
  return                      { label: `${nichel} mcg`, bg: '#FFF0F0',   color: '#FF4444' };
}

function getBorderColor(nichel) {
  if (nichel === null) return '#A0B080';
  if (nichel <= 50)    return '#4CAF50';
  if (nichel <= 150)   return '#FF8C00';
  return '#FF4444';
}

export default function DatabaseScreen() {
  const [query, setQuery]                   = useState('');
  const [expandedId, setExpandedId]         = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const filtered = query.length >= 1
    ? NICKEL_DB.filter(f => f.nome.toLowerCase().includes(query.toLowerCase()))
    : NICKEL_DB;

  const groups = filtered.reduce((acc, food) => {
    if (!acc[food.gruppo]) acc[food.gruppo] = [];
    acc[food.gruppo].push(food);
    return acc;
  }, {});

  function toggleGroup(g) {
    setCollapsedGroups(prev => ({ ...prev, [g]: !prev[g] }));
  }

  return (
    <div className="flex flex-col pb-24 min-h-screen">
      {/* Header */}
      <div className="px-5 pt-safe pt-6 pb-4">
        <h1 className="font-nunito" style={{ fontWeight: 900, fontSize: 28, color: '#2D3A1A' }}>
          Database Nichel 📋
        </h1>
        {/* Search */}
        <div className="mt-3">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cerca alimento..."
            className="w-full font-nunito text-base outline-none"
            style={{
              background: '#F5F5F5',
              border: '1.5px solid transparent',
              borderRadius: 16,
              padding: '12px 16px',
              color: '#2D3A1A',
              fontWeight: 500,
            }}
            onFocus={e => { e.target.style.border = '2px solid #4CAF50'; e.target.style.background = '#FFFFFF'; }}
            onBlur={e => { e.target.style.border = '1.5px solid transparent'; e.target.style.background = '#F5F5F5'; }}
          />
        </div>
        {/* Legend */}
        <div className="flex gap-3 mt-3">
          {[
            ['🟢 BASSO', '≤50 mcg',  '#4CAF50'],
            ['🟡 MEDIO', '51-150',    '#FF8C00'],
            ['🔴 ALTO',  '>150',      '#FF4444'],
          ].map(([l, v, c]) => (
            <span key={l} className="font-nunito text-xs" style={{ color: c, fontWeight: 700 }}>
              {l} <span style={{ color: '#A0B080', fontWeight: 500 }}>{v}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div className="px-4 flex flex-col gap-2">
        {Object.entries(groups).map(([group, foods]) => (
          <div key={group}>
            {/* Group header */}
            <button
              onClick={() => toggleGroup(group)}
              className="w-full flex items-center justify-between py-2 px-1"
            >
              <span className="font-nunito font-bold text-xs uppercase tracking-wider" style={{ color: '#6B8050' }}>
                {group}
              </span>
              <span style={{ color: '#A0B080', fontSize: 12 }}>
                {collapsedGroups[group] ? '▶' : '▼'} {foods.length}
              </span>
            </button>

            {!collapsedGroups[group] && (
              <div className="flex flex-col gap-2 mb-2">
                {foods.map(food => {
                  const badge     = getNichelBadge(food.nichel);
                  const borderCol = getBorderColor(food.nichel);
                  const isExpanded = expandedId === food.id;
                  return (
                    <button
                      key={food.id}
                      onClick={() => setExpandedId(isExpanded ? null : food.id)}
                      className="w-full text-left rounded-2xl overflow-hidden"
                      style={{
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        borderLeft: `4px solid ${borderCol}`,
                        borderTop: 'none',
                        borderRight: 'none',
                        borderBottom: 'none',
                      }}
                    >
                      <div className="flex items-center gap-3 px-3 py-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-nunito font-bold text-sm truncate" style={{ color: '#2D3A1A' }}>
                            {food.nome}
                          </p>
                          <p className="font-nunito text-xs uppercase tracking-wide" style={{ color: '#A0B080', fontWeight: 600 }}>
                            {food.gruppo}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-nunito font-bold text-xs whitespace-nowrap"
                            style={{
                              background: badge.bg,
                              color: badge.color,
                              borderRadius: 99,
                              padding: '4px 10px',
                            }}
                          >
                            {badge.label}
                          </span>
                          {food.nota && <span style={{ fontSize: 14 }}>⚠️</span>}
                        </div>
                      </div>
                      {isExpanded && food.nota && (
                        <div className="px-3 pb-3">
                          <p
                            className="font-nunito italic text-xs leading-relaxed"
                            style={{
                              color: '#6B8050',
                              background: '#F8FFF8',
                              borderRadius: 8,
                              padding: '8px 10px',
                              fontWeight: 500,
                            }}
                          >
                            {food.nota}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
