import React, { useState } from 'react';
import { STRATEGIES } from '../data/nickelDB';

export default function SuggestionsScreen() {
  const [tab, setTab]             = useState(0);
  const [expandedId, setExpandedId] = useState(null);

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: 20,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    border: 'none',
    borderLeft: '4px solid #4CAF50',
  };

  return (
    <div className="flex flex-col pb-24 min-h-screen">
      <div className="px-5 pt-safe pt-6 pb-4">
        <h1 className="font-nunito" style={{ fontWeight: 900, fontSize: 28, color: '#2D3A1A' }}>
          Suggerimenti 💡
        </h1>
        <p className="font-nunito text-xs mt-1" style={{ color: '#A0B080', fontWeight: 500 }}>
          Strategie per ridurre l'assorbimento del nichel
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-3 px-5 mb-5">
        {['Strategie Anti-Nichel', 'Legumi: come cucinarli'].map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className="flex-1 py-2.5 rounded-full font-nunito font-bold text-sm transition-all"
            style={tab === i ? {
              background: 'linear-gradient(135deg, #FFB347, #FF8C00)',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(255,140,0,0.30)',
              border: 'none',
            } : {
              background: '#FFFFFF',
              color: '#A0B080',
              border: '2px solid #F0F0F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="px-4 flex flex-col gap-3">
          {STRATEGIES.map(s => {
            const isExp = expandedId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setExpandedId(isExp ? null : s.id)}
                className="w-full text-left rounded-2xl overflow-hidden"
                style={cardStyle}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ background: '#F8FFF8' }}
                >
                  <span className="text-xl">{s.icon}</span>
                  <span className="font-nunito font-extrabold text-sm flex-1" style={{ color: '#2D3A1A' }}>
                    {s.title}
                  </span>
                  <span
                    className="font-nunito text-xs"
                    style={{
                      background: s.evidenza === 'forte' ? '#E8F5E9' : '#FFF9E6',
                      color: s.evidenza === 'forte' ? '#4CAF50' : '#FF8C00',
                      borderRadius: 99,
                      padding: '4px 10px',
                      fontWeight: 700,
                    }}
                  >
                    {s.evidenza === 'forte' ? '✅ Forte' : '✅ Moderata'}
                  </span>
                  <span style={{ color: '#A0B080', fontSize: 12 }}>{isExp ? '▲' : '▼'}</span>
                </div>
                {isExp && (
                  <div className="px-4 py-3">
                    <p className="font-nunito text-sm mb-3 leading-relaxed" style={{ color: '#6B8050', fontWeight: 500 }}>
                      {s.comeFunc}
                    </p>
                    <p className="font-nunito font-bold text-xs uppercase mb-1" style={{ color: '#FF8C00' }}>
                      Alimenti protettori
                    </p>
                    <ul className="mb-3">
                      {s.alimenti.map((a, i) => (
                        <li key={i} className="font-nunito text-sm" style={{ color: '#6B8050', fontWeight: 500 }}>• {a}</li>
                      ))}
                    </ul>
                    <p className="font-nunito font-bold text-xs uppercase mb-1" style={{ color: '#FF8C00' }}>
                      Abbinamenti pratici
                    </p>
                    <ul>
                      {s.abbinamenti.map((a, i) => (
                        <li key={i} className="font-nunito text-sm" style={{ color: '#6B8050', fontWeight: 500 }}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {tab === 1 && (
        <div className="px-4 flex flex-col gap-3">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <div className="px-4 py-3" style={{ background: '#F8FFF8', borderBottom: '1px solid #F0F0F0' }}>
              <p className="font-nunito font-extrabold text-base" style={{ color: '#2D3A1A' }}>
                🫘 Come preparare i legumi
              </p>
            </div>
            <div className="px-4 py-4 flex flex-col gap-3">
              {[
                { icon: '❌', label: 'Secchi non ammollati',     desc: 'Evitare (273–330 mcg/100g)',                    color: '#FF4444' },
                { icon: '✅', label: 'Secchi ammollati + bolliti', desc: 'Forma preferibile (~29–47 mcg) — riduzione 80-90%', color: '#4CAF50' },
                { icon: '⚠️', label: 'In lattina',                desc: 'Sconsigliati: contaminazione da metallo',        color: '#FF8C00' },
                { icon: '✅', label: 'In vetro',                  desc: 'Alternativa accettabile — sciacquare bene',       color: '#4CAF50' },
                { icon: '✅', label: 'Surgelati',                 desc: 'Alternativa accettabile',                         color: '#4CAF50' },
              ].map((r, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-2"
                  style={{ borderBottom: i < 4 ? '1px solid #F5F5F5' : 'none' }}
                >
                  <span className="text-xl flex-shrink-0">{r.icon}</span>
                  <div>
                    <p className="font-nunito font-bold text-sm" style={{ color: r.color }}>{r.label}</p>
                    <p className="font-nunito text-xs" style={{ color: '#A0B080', fontWeight: 500 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
              <div
                className="rounded-xl p-3 mt-1"
                style={{ background: '#FFF9E6', border: '1px solid #FFD60040' }}
              >
                <p className="font-nunito font-bold text-sm mb-1" style={{ color: '#FF8C00' }}>Regola pratica</p>
                <p className="font-nunito font-black text-base" style={{ color: '#2D3A1A', letterSpacing: 0.5 }}>
                  VETRO {'>'} BOLLITI CASALINGHI {'>'} SURGELATI {'>>'} LATTINA
                </p>
              </div>
              <div
                className="rounded-xl p-3"
                style={{ background: '#E8F5E9', border: '1px solid #4CAF5030' }}
              >
                <p className="font-nunito text-xs leading-relaxed" style={{ color: '#4CAF50', fontWeight: 600 }}>
                  💡 <strong>Consiglio:</strong> Cuoci i legumi in casa e congelali in porzioni. Hai sempre legumi pronti senza rischio lattina.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
