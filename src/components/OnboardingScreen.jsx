import React, { useState } from 'react';
import MascotNickel from './MascotNickel';

export default function OnboardingScreen({ onComplete }) {
  const [nome, setNome]       = useState('');
  const [profilo, setProfilo] = useState(null);

  const canProceed = nome.trim().length > 0 && profilo !== null;

  function handleStart() {
    if (!canProceed) return;
    const soglia = profilo === 'detox' ? 250 : 150;
    onComplete({ nome: nome.trim(), profilo, soglia });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 pb-10"
      style={{ minHeight: '100vh' }}
    >
      {/* Title */}
      <div className="text-center mb-2">
        <h1 className="font-nunito" style={{ fontWeight: 900, fontSize: 28, color: '#2D3A1A', letterSpacing: 1, lineHeight: 1.2 }}>
          DON'T PUMP MY NICKEL
        </h1>
        <p className="font-nunito" style={{ fontSize: 12, color: '#A0B080', marginTop: 2, fontWeight: 400 }}>(DPMN)</p>
      </div>

      {/* Mascot — clipped square */}
      <div className="my-6" style={{
        width: 110,
        height: 110,
        borderRadius: 20,
        overflow: 'hidden',
        background: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        flexShrink: 0,
      }}>
        <img
          src="/mascot/mascot-happy.png"
          alt="Nickel mascot"
          style={{
            width: 160,
            height: 160,
            objectFit: 'cover',
            objectPosition: 'top center',
            display: 'block',
            marginLeft: -25,
          }}
        />
      </div>

      {/* Card */}
      <div
        className="w-full"
        style={{
          background: '#FFFFFF',
          borderRadius: 28,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: 24,
          maxWidth: 380,
        }}
      >
        {/* Name input */}
        <div className="mb-5">
          <label className="block font-nunito text-sm mb-2" style={{ color: '#6B8050', fontWeight: 700 }}>
            Come ti chiami?
          </label>
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value.slice(0, 20))}
            placeholder="Il tuo nome..."
            maxLength={20}
            className="w-full font-nunito text-base outline-none"
            style={{
              background: '#F5F5F5',
              border: '1.5px solid transparent',
              borderRadius: 16,
              padding: '12px 16px',
              color: '#2D3A1A',
              fontWeight: 600,
            }}
            onFocus={e => { e.target.style.border = '2px solid #4CAF50'; e.target.style.background = '#FFFFFF'; }}
            onBlur={e => { e.target.style.border = '1.5px solid transparent'; e.target.style.background = '#F5F5F5'; }}
          />
        </div>

        {/* Profile selection */}
        <div className="mb-5">
          <p className="font-nunito text-sm mb-3" style={{ color: '#6B8050', fontWeight: 700 }}>
            Scegli il tuo profilo:
          </p>
          <div className="flex flex-col gap-3">
            {/* Detox */}
            <button
              onClick={() => setProfilo('detox')}
              className="rounded-2xl p-4 text-left transition-all duration-200"
              style={{
                background: profilo === 'detox' ? '#F0FFF0' : '#F9F9F9',
                border: profilo === 'detox' ? '2px solid #4CAF50' : '2px solid #F0F0F0',
                boxShadow: profilo === 'detox' ? '0 4px 16px rgba(76,175,80,0.15)' : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🟡</span>
                <span className="font-nunito font-bold text-base" style={{ color: '#2D3A1A' }}>Periodo Detox</span>
                <span className="ml-auto font-nunito font-black text-lg" style={{ color: '#FF8C00' }}>250 mcg</span>
              </div>
              <p className="font-nunito text-xs" style={{ color: '#A0B080', fontWeight: 500 }}>
                Voglio ridurre il nichel ma con qualche flessibilità
              </p>
            </button>

            {/* Stretta */}
            <button
              onClick={() => setProfilo('stretta')}
              className="rounded-2xl p-4 text-left transition-all duration-200"
              style={{
                background: profilo === 'stretta' ? '#FFF5F5' : '#F9F9F9',
                border: profilo === 'stretta' ? '2px solid #FF4444' : '2px solid #F0F0F0',
                boxShadow: profilo === 'stretta' ? '0 4px 16px rgba(255,68,68,0.15)' : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🔴</span>
                <span className="font-nunito font-bold text-base" style={{ color: '#2D3A1A' }}>Dieta Low Nichel Stretta</span>
                <span className="ml-auto font-nunito font-black text-lg" style={{ color: '#FF4444' }}>150 mcg</span>
              </div>
              <p className="font-nunito text-xs" style={{ color: '#A0B080', fontWeight: 500 }}>
                Devo mantenere l'intake molto basso, no sgarri
              </p>
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="mb-5 rounded-2xl p-3"
          style={{ background: '#F5FFF5', border: '1px solid #4CAF5020' }}
        >
          <p className="font-nunito text-xs leading-relaxed" style={{ color: '#6B8050', fontWeight: 500 }}>
            ℹ️ Le soglie indicate (250 mcg per il detox, 150 mcg per la dieta stretta) sono stime basate su studi e linee guida nutrizionistiche. Non sostituiscono il parere del medico.
          </p>
        </div>

        {/* CTA button */}
        <button
          onClick={handleStart}
          disabled={!canProceed}
          className="w-full font-nunito text-lg text-white transition-all duration-200 active:scale-95"
          style={{
            background: canProceed
              ? 'linear-gradient(135deg, #FFB347, #FF8C00)'
              : '#F0F0F0',
            color: canProceed ? 'white' : '#A0B080',
            borderRadius: 20,
            padding: '16px 0',
            fontWeight: 900,
            border: 'none',
            boxShadow: canProceed ? '0 6px 20px rgba(255,140,0,0.35)' : 'none',
            fontSize: 18,
          }}
        >
          Inizia →
        </button>
      </div>
    </div>
  );
}
