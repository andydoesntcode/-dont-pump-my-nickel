import React, { useState } from 'react';

const DAYS_IT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];
const PERIOD_OPTIONS = [1, 3, 7, 14, 30];

function getNextResetLabel(startDay, periodDays) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysBack = (dayOfWeek - startDay + 7) % 7;
  const periodStart = new Date(today);
  periodStart.setDate(today.getDate() - daysBack);
  const nextReset = new Date(periodStart);
  nextReset.setDate(periodStart.getDate() + periodDays);
  return nextReset.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function SettingsScreen({ userData, onSave, onReset }) {
  const [nome, setNome]           = useState(userData.nome);
  const [profilo, setProfilo]     = useState(userData.profilo);
  const [showConfirm, setShowConfirm] = useState(false);

  const savedWeekSettings = (() => {
    try { return JSON.parse(localStorage.getItem('week_settings') || '{"startDay":1,"periodDays":7}'); }
    catch { return { startDay: 1, periodDays: 7 }; }
  })();
  const [startDay, setStartDay]     = useState(savedWeekSettings.startDay);
  const [periodDays, setPeriodDays] = useState(savedWeekSettings.periodDays);
  const [weekSaved, setWeekSaved]   = useState(false);

  function handleSaveWeek() {
    localStorage.setItem('week_settings', JSON.stringify({ startDay, periodDays }));
    setWeekSaved(true);
    setTimeout(() => setWeekSaved(false), 2000);
  }

  function handleSave() {
    const soglia = profilo === 'detox' ? 250 : 150;
    onSave({ ...userData, nome: nome.trim(), profilo, soglia });
  }

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: 20,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  };

  const sectionHeaderStyle = {
    padding: '10px 16px',
    background: '#F8FFF8',
    borderBottom: '1px solid #F0F0F0',
  };

  const labelStyle = { color: '#6B8050', fontWeight: 700, fontSize: 12 };
  const bodyStyle  = { color: '#6B8050', fontWeight: 500, fontSize: 13 };

  return (
    <div className="flex flex-col pb-24 min-h-screen">
      <div className="px-5 pt-safe pt-2 pb-4">
        <h1 className="font-nunito" style={{ fontWeight: 900, fontSize: 24, color: '#2D3A1A' }}>
          Impostazioni
        </h1>
      </div>

      <div className="px-4 flex flex-col gap-4">

        {/* Profile section */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <p className="font-nunito font-extrabold" style={{ color: '#2D3A1A', fontSize: 15 }}>👤 Profilo</p>
          </div>
          <div className="px-4 py-3 flex flex-col gap-3">
            <div>
              <label className="block font-nunito mb-1.5" style={labelStyle}>Nome</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value.slice(0, 20))}
                maxLength={20}
                className="w-full font-nunito outline-none"
                style={{
                  background: '#F5F5F5',
                  border: '1.5px solid transparent',
                  borderRadius: 14,
                  padding: '10px 14px',
                  color: '#2D3A1A',
                  fontWeight: 600,
                  fontSize: 14,
                }}
                onFocus={e => { e.target.style.border = '2px solid #4CAF50'; e.target.style.background = '#FFFFFF'; }}
                onBlur={e => { e.target.style.border = '1.5px solid transparent'; e.target.style.background = '#F5F5F5'; }}
              />
            </div>
            <div>
              <label className="block font-nunito mb-1.5" style={labelStyle}>Profilo dieta</label>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'detox',   label: '🟡 Periodo Detox',  soglia: '250 mcg' },
                  { key: 'stretta', label: '🔴 Dieta Stretta',   soglia: '150 mcg' },
                ].map(p => (
                  <button
                    key={p.key}
                    onClick={() => setProfilo(p.key)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl"
                    style={{
                      background: profilo === p.key ? '#F0FFF0' : '#F9F9F9',
                      border: profilo === p.key ? '2px solid #4CAF50' : '2px solid #F0F0F0',
                    }}
                  >
                    <span className="font-nunito font-bold" style={{ color: '#2D3A1A', fontSize: 13 }}>{p.label}</span>
                    <span className="font-nunito font-black" style={{ color: '#FF8C00', fontSize: 14 }}>{p.soglia}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full font-nunito font-extrabold text-white active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(135deg, #56C96B, #2E9E45)',
                borderRadius: 14,
                padding: '12px 0',
                border: 'none',
                boxShadow: '0 6px 16px rgba(76,175,80,0.35)',
                fontSize: 14,
              }}
            >
              Salva modifiche
            </button>
          </div>
        </div>

        {/* Threshold info */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <p className="font-nunito font-extrabold" style={{ color: '#2D3A1A', fontSize: 15 }}>ℹ️ Informazioni sulle soglie</p>
          </div>
          <div className="px-4 py-3">
            <p className="font-nunito leading-relaxed" style={bodyStyle}>
              Le soglie usate in questa app sono:{'\n\n'}
              • <strong style={{ color: '#2D3A1A' }}>Dieta Detox: 250 mcg/die</strong> — valore di riferimento per ridurre i sintomi nei soggetti sensibili secondo il dossier SSNV (Filippin/SSNV) e la letteratura SNAS italiana{'\n'}
              • <strong style={{ color: '#2D3A1A' }}>Dieta Stretta: 150 mcg/die</strong> — soglia consigliata per soggetti con sensibilità conclamata (adulti); bambini: {'<'}100 mcg/die{'\n'}
              • Introito medio della popolazione: 300–600 mcg/die{'\n\n'}
              I valori nel database provengono dal Dossier SSNV e dalla letteratura scientifica. Esistono discrepanze tra fonti diverse: vedi le note ⚠️ negli alimenti.
            </p>
          </div>
        </div>

        {/* Database info */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <p className="font-nunito font-extrabold" style={{ color: '#2D3A1A', fontSize: 15 }}>📋 Database</p>
          </div>
          <div className="px-4 py-3">
            <p className="font-nunito leading-relaxed mb-3" style={bodyStyle}>
              Il database degli alimenti è statico e aggiornato manualmente. Per segnalare errori, richiedere integrazioni o correzioni:
            </p>
            <a
              href="mailto:dontpumpmynickel@gmail.com"
              className="flex items-center justify-center gap-2 rounded-full py-2 font-nunito font-bold"
              style={{ background: '#F0FFF0', border: '1.5px solid #4CAF5040', color: '#4CAF50', fontSize: 13 }}
            >
              ✉️ dontpumpmynickel@gmail.com
            </a>
          </div>
        </div>

        {/* Period settings */}
        <div style={cardStyle}>
          <div style={sectionHeaderStyle}>
            <p className="font-nunito font-extrabold" style={{ color: '#2D3A1A', fontSize: 15 }}>📅 Imposta il tuo periodo</p>
          </div>
          <div className="px-4 py-3 flex flex-col gap-3">
            {/* Start day */}
            <div>
              <label className="block font-nunito mb-1.5" style={labelStyle}>Giorno di inizio:</label>
              <div className="flex gap-1 flex-wrap">
                {DAYS_IT.map((day, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStartDay(idx)}
                    className="font-nunito font-bold rounded-full transition-all"
                    style={{
                      padding: '6px 10px',
                      fontSize: 12,
                      background: startDay === idx ? '#4CAF50' : '#F5F5F5',
                      color: startDay === idx ? '#FFFFFF' : '#6B8050',
                      border: startDay === idx ? 'none' : '1px solid #E0E0E0',
                    }}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Period duration */}
            <div>
              <label className="block font-nunito mb-1.5" style={labelStyle}>Durata del periodo:</label>
              <div className="flex gap-1 flex-wrap">
                {PERIOD_OPTIONS.map(days => (
                  <button
                    key={days}
                    onClick={() => setPeriodDays(days)}
                    className="font-nunito font-bold rounded-full transition-all"
                    style={{
                      padding: '6px 10px',
                      fontSize: 12,
                      background: periodDays === days ? '#4CAF50' : '#F5F5F5',
                      color: periodDays === days ? '#FFFFFF' : '#6B8050',
                      border: periodDays === days ? 'none' : '1px solid #E0E0E0',
                    }}
                  >
                    {days} gg
                  </button>
                ))}
              </div>
            </div>

            {/* Info text */}
            <p className="font-nunito" style={{ color: '#A0B080', fontWeight: 500, fontSize: 12 }}>
              Il prossimo reset sarà{' '}
              <strong style={{ color: '#6B8050' }}>{getNextResetLabel(startDay, periodDays)}</strong>
            </p>

            {/* Save button */}
            <button
              onClick={handleSaveWeek}
              className="w-full font-nunito font-extrabold text-white active:scale-95 transition-all"
              style={{
                background: weekSaved
                  ? 'linear-gradient(135deg, #56C96B, #2E9E45)'
                  : 'linear-gradient(135deg, #4CAF50, #2E9E45)',
                borderRadius: 14,
                padding: '12px 0',
                border: 'none',
                boxShadow: '0 6px 16px rgba(76,175,80,0.30)',
                fontSize: 14,
              }}
            >
              {weekSaved ? '✓ Salvato!' : 'Salva impostazioni periodo'}
            </button>
          </div>
        </div>

        {/* Reset — last item, visually separated */}
        <div style={{ marginTop: 32, borderTop: '1px solid #F0F0F0', paddingTop: 24 }}>
          <div style={{ ...cardStyle }}>
            <div style={{ ...sectionHeaderStyle, background: '#FFF5F5', borderBottom: '1px solid #FFE0E0' }}>
              <p className="font-nunito font-extrabold" style={{ color: '#2D3A1A', fontSize: 15 }}>⚠️ Reset</p>
            </div>
            <div className="px-4 py-3">
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl py-3 font-nunito font-bold"
                  style={{ background: '#FFF0F0', border: '1.5px solid #FF444440', color: '#FF4444', fontSize: 14 }}
                >
                  🗑️ Cancella tutti i dati
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <p className="font-nunito text-center" style={{ color: '#2D3A1A', fontWeight: 600, fontSize: 13 }}>
                    Sei sicuro? Questa azione cancellerà nome, profilo e tutto il log alimentare.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 rounded-2xl py-2.5 font-nunito font-bold"
                      style={{ background: '#F5F5F5', color: '#6B8050', border: 'none', fontSize: 13 }}
                    >
                      Annulla
                    </button>
                    <button
                      onClick={onReset}
                      className="flex-1 rounded-2xl py-2.5 font-nunito font-bold"
                      style={{ background: 'linear-gradient(135deg, #FF4444, #CC0000)', color: 'white', border: 'none', boxShadow: '0 4px 16px rgba(255,68,68,0.35)', fontSize: 13 }}
                    >
                      Sì, cancella
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
