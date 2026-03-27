import React, { useState, useEffect, useRef } from 'react';
import MascotNickel from './MascotNickel';
import FoodSearch from './FoodSearch';

const MEALS = [
  { key: 'colazione', label: 'Colazione', emoji: '🌅' },
  { key: 'pranzo',    label: 'Pranzo',    emoji: '🍽️' },
  { key: 'spuntini',  label: 'Spuntini',  emoji: '🍎' },
  { key: 'cena',      label: 'Cena',      emoji: '🌙' },
];

const MEAL_STYLE = {
  colazione: { gradient: 'linear-gradient(135deg, #FFB347, #FF8C00)', accent: '#FF8C00' },
  pranzo:    { gradient: 'linear-gradient(135deg, #56C96B, #2E9E45)', accent: '#2E9E45' },
  spuntini:  { gradient: 'linear-gradient(135deg, #FF7675, #E84393)', accent: '#E84393' },
  cena:      { gradient: 'linear-gradient(135deg, #6C5CE7, #a29bfe)', accent: '#6C5CE7' },
};

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getDayStr(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

function formatDayLabel(dateStr) {
  const [, m, d] = dateStr.split('-');
  const months = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
}

function getHistoryColors(val, soglia) {
  if (val === null || val === undefined) return { bg: '#F5F5F5', border: '#E0E0E0', text: '#A0B080' };
  const pct = (val / soglia) * 100;
  if (pct >= 100) return { bg: '#FFE5E5', border: '#FF8080', text: '#CC0000' };
  if (pct >= 70)  return { bg: '#FFF0E0', border: '#FFB366', text: '#CC6600' };
  if (pct >= 40)  return { bg: '#FFFAE0', border: '#FFD966', text: '#CC9900' };
  return { bg: '#E8FFF0', border: '#80CC99', text: '#2E7D4F' };
}

function getWeekBadgeColor(weekTotal, soglia, periodDays) {
  const weekSoglia = soglia * periodDays;
  const pct = (weekTotal / weekSoglia) * 100;
  if (pct >= 100) return { bg: '#FFE5E5', text: '#CC0000' };
  if (pct >= 70)  return { bg: '#FFF0E0', text: '#CC6600' };
  return { bg: '#E8FFF0', text: '#2E7D4F' };
}

export default function HomeScreen({ userData, log, setLog, onOpenSettings }) {
  const [addingMeal, setAddingMeal]     = useState(null);
  const [managingMeal, setManagingMeal] = useState(null);
  const [mascotAnimate, setMascotAnimate] = useState(false);
  const [editingItem, setEditingItem]   = useState(null);
  const [editGrams, setEditGrams]       = useState('');
  const [historyDayIdx, setHistoryDayIdx] = useState(0); // 0 = yesterday
  const [slideClass, setSlideClass]     = useState('');
  const animKeyRef = useRef(0);

  const { nome, soglia } = userData;

  const total = MEALS.reduce((sum, meal) => {
    const items = log[meal.key] || [];
    return sum + items.reduce((s, item) => s + (item.mcg || 0), 0);
  }, 0);

  const totalRounded = Math.round(total * 10) / 10;
  const pct          = (total / soglia) * 100;
  const percentage   = Math.min(pct, 110);

  // History
  const nickelHistory = (() => {
    try { return JSON.parse(localStorage.getItem('nickel_history') || '{}'); } catch { return {}; }
  })();

  // Week settings
  const weekSettings = (() => {
    try { return JSON.parse(localStorage.getItem('week_settings') || '{"startDay":1,"periodDays":7}'); }
    catch { return { startDay: 1, periodDays: 7 }; }
  })();

  // Compute week total
  const weekTotal = (() => {
    const { startDay, periodDays } = weekSettings;
    const today = new Date();
    const todayStr = getTodayStr();
    const dayOfWeek = today.getDay();
    const daysBack = (dayOfWeek - startDay + 7) % 7;
    const periodStart = new Date(today);
    periodStart.setDate(today.getDate() - daysBack);
    let sum = 0;
    for (let i = 0; i < periodDays; i++) {
      const d = new Date(periodStart);
      d.setDate(periodStart.getDate() + i);
      const ds = d.toISOString().slice(0, 10);
      if (ds > todayStr) break;
      if (ds === todayStr) {
        sum += totalRounded;
      } else if (nickelHistory[ds] !== undefined) {
        sum += nickelHistory[ds];
      }
    }
    return Math.round(sum * 10) / 10;
  })();

  const weekBadgeColor = getWeekBadgeColor(weekTotal, soglia, weekSettings.periodDays);

  // History day selection
  const selectedDayStr = getDayStr(historyDayIdx + 1);
  const selectedDayVal = nickelHistory[selectedDayStr];
  const historyColors  = getHistoryColors(selectedDayVal, soglia);

  function navigateHistory(dir) {
    // dir: -1 = go newer (reduce idx), +1 = go older (increase idx)
    const next = historyDayIdx + dir;
    if (next < 0 || next > 6) return;
    setSlideClass(dir > 0 ? 'slide-from-right' : 'slide-from-left');
    animKeyRef.current += 1;
    setHistoryDayIdx(next);
    setTimeout(() => setSlideClass(''), 250);
  }

  function getMealTotal(mealKey) {
    return Math.round((log[mealKey] || []).reduce((s, i) => s + (i.mcg || 0), 0) * 10) / 10;
  }

  function handleAdd(meal, item) {
    setLog(prev => ({
      ...prev,
      [meal]: [...(prev[meal] || []), { ...item, id: Date.now() }],
    }));
    setMascotAnimate(true);
    setTimeout(() => setMascotAnimate(false), 500);
  }

  function handleDelete(mealKey, itemId) {
    setLog(prev => ({
      ...prev,
      [mealKey]: (prev[mealKey] || []).filter(i => i.id !== itemId),
    }));
  }

  function handleEditSave(mealKey, itemId) {
    const g = parseFloat(editGrams);
    if (!g || g <= 0) return;
    setLog(prev => ({
      ...prev,
      [mealKey]: (prev[mealKey] || []).map(i => {
        if (i.id !== itemId) return i;
        const mcg = i.nichel_per_100g !== null
          ? Math.round((i.nichel_per_100g / 100) * g * 10) / 10
          : null;
        return { ...i, grammi: g, mcg };
      }),
    }));
    setEditingItem(null);
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });

  const alertColor = pct >= 100 ? '#FF4444' : pct >= 90 ? '#FF4444' : '#FF8C00';

  return (
    <div className="flex flex-col pb-24" style={{ minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between px-5 pt-safe pt-6 pb-4">
        <div>
          <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 16, color: '#6B8050', margin: 0 }}>
            Ciao,
          </p>
          <h1 className="font-nunito" style={{ fontWeight: 900, fontSize: 32, color: '#2D3A1A', lineHeight: 1.1, margin: 0 }}>
            {nome.toUpperCase()}! 👋
          </h1>
          <p className="font-nunito" style={{ fontWeight: 400, fontSize: 13, color: '#A0B080', marginTop: 2, textTransform: 'capitalize' }}>
            {dateStr}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1" style={{ marginTop: 4, flexShrink: 0 }}>
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center rounded-full"
            style={{
              width: 44, height: 44,
              background: '#FFFFFF',
              boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
              fontSize: 20,
              border: 'none',
              color: '#2D3A1A',
            }}
          >⚙️</button>
          {/* Weekly badge */}
          <div
            className="font-nunito"
            style={{
              background: weekBadgeColor.bg,
              color: weekBadgeColor.text,
              borderRadius: 99,
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Sett: {weekTotal} mcg
          </div>
        </div>
      </div>

      {/* ── Mascot + Total card ── */}
      <div
        className="mx-4 mb-4 p-5"
        style={{
          background: '#FFFFFF',
          borderRadius: 28,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center gap-4">
          {/* Mascot */}
          <MascotNickel percentage={percentage} animate={mascotAnimate} size={130} />

          {/* Total */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-nunito" style={{ fontWeight: 900, fontSize: '3.5rem', color: '#2D3A1A', lineHeight: 1 }}>
                {totalRounded}
              </span>
              <span className="font-nunito" style={{ fontWeight: 700, fontSize: '1rem', color: '#6B8050', marginBottom: 4 }}>
                MCG
              </span>
            </div>

            {/* Progress bar */}
            <div
              className="relative overflow-hidden mb-1"
              style={{ height: 12, background: '#F0F0F0', borderRadius: 99 }}
            >
              <div
                style={{
                  height: '100%',
                  borderRadius: 99,
                  width: `${Math.min(pct, 100)}%`,
                  background: 'linear-gradient(90deg, #4CAF50 0%, #FFD600 65%, #FF4444 100%)',
                  transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>

            <p className="font-nunito" style={{ fontWeight: 600, fontSize: 11, color: '#A0B080', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              su {soglia} mcg
            </p>

            {pct >= 70 && (
              <p className="font-nunito" style={{ fontWeight: 700, fontSize: 12, color: alertColor, marginTop: 4 }}>
                {pct >= 100 ? '🚨 Soglia superata!' : pct >= 90 ? '⚠️ Quasi alla soglia' : '⚡ Attenzione'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Meal sections ── */}
      <div className="px-4 flex flex-col gap-4">
        {MEALS.map(meal => {
          const ms = MEAL_STYLE[meal.key];
          const items = log[meal.key] || [];
          const mealTotal = getMealTotal(meal.key);
          return (
            <div key={meal.key}>
              {/* Meal header row */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="flex items-center gap-2"
                  style={{
                    padding: '12px 24px',
                    background: ms.gradient,
                    borderRadius: 50,
                    boxShadow: '0 6px 16px rgba(0,0,0,0.20)',
                    border: 'none',
                  }}
                >
                  <span>{meal.emoji}</span>
                  <span className="font-nunito" style={{ fontWeight: 800, fontSize: 16, color: '#FFFFFF' }}>
                    {meal.label}
                  </span>
                </div>
                {mealTotal > 0 && (
                  <span className="font-nunito" style={{ fontWeight: 700, fontSize: 12, color: ms.accent }}>
                    {mealTotal} mcg
                  </span>
                )}
                <div className="ml-auto flex gap-2">
                  <button
                    onClick={() => setAddingMeal(meal.key)}
                    className="flex items-center justify-center rounded-full transition-all active:scale-90"
                    style={{
                      width: 44, height: 44,
                      background: '#FFFFFF',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      border: 'none',
                      color: ms.accent,
                      fontSize: 22,
                      fontWeight: 700,
                    }}
                  >+</button>
                  {items.length > 0 && (
                    <button
                      onClick={() => setManagingMeal(meal.key)}
                      className="flex items-center justify-center rounded-full transition-all active:scale-90"
                      style={{
                        width: 44, height: 44,
                        background: '#FFFFFF',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: 'none',
                        color: ms.accent,
                        fontSize: 20,
                      }}
                    >⋯</button>
                  )}
                </div>
              </div>

              {/* Food items */}
              {items.length === 0 ? (
                <p
                  className="font-nunito"
                  style={{ fontSize: 12, color: '#A0B080', paddingLeft: 8, fontStyle: 'italic', opacity: 0.7 }}
                >
                  — Nessun alimento aggiunto
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between"
                      style={{
                        background: 'rgba(255,255,255,0.85)',
                        borderRadius: 12,
                        padding: '10px 14px',
                        margin: '6px 0',
                        border: `1.5px solid rgba(0,0,0,0.08)`,
                        borderLeft: `3px solid ${ms.accent}`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                      }}
                    >
                      <span
                        className="font-nunito truncate flex-1 pr-2"
                        style={{ fontWeight: 600, fontSize: 14, color: '#2D3A1A' }}
                      >
                        {item.nome}
                      </span>
                      <span
                        className="font-nunito whitespace-nowrap"
                        style={{ fontWeight: 700, fontSize: 13, color: '#4CAF50' }}
                      >
                        {item.grammi}g → {item.mcg !== null ? `${item.mcg} mcg` : 'N.D.'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Giorni precedenti ── */}
      <div
        className="mx-4 mt-4"
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          padding: '12px 16px',
        }}
      >
        <p className="font-nunito" style={{ fontWeight: 600, fontSize: 10, color: '#A0B080', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8, textAlign: 'center' }}>
          Giorni precedenti
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigateHistory(1)}
            disabled={historyDayIdx >= 6}
            style={{
              background: 'none', border: 'none', fontSize: 18, color: historyDayIdx >= 6 ? '#D0D0D0' : '#6B8050',
              cursor: historyDayIdx >= 6 ? 'default' : 'pointer', padding: '4px 6px',
            }}
          >←</button>

          <div
            key={animKeyRef.current}
            className={slideClass}
            style={{ textAlign: 'center' }}
          >
            <p className="font-nunito" style={{ fontWeight: 300, fontSize: 12, color: '#6B8050', marginBottom: 6 }}>
              {formatDayLabel(selectedDayStr)}
            </p>
            {/* Compact horizontal pill */}
            <div style={{
              display: 'inline-flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              width: 160,
              height: 64,
              borderRadius: 32,
              background: historyColors.bg,
              border: `1.5px solid ${historyColors.border}`,
            }}>
              {selectedDayVal !== undefined ? (
                <>
                  <span className="font-nunito" style={{ fontWeight: 800, fontSize: '1.6rem', color: historyColors.text, lineHeight: 1 }}>
                    {selectedDayVal}
                  </span>
                  <span className="font-nunito" style={{ fontWeight: 600, fontSize: '0.75rem', color: historyColors.text, opacity: 0.8 }}>
                    mcg
                  </span>
                </>
              ) : (
                <>
                  <span className="font-nunito" style={{ fontWeight: 700, fontSize: '1.4rem', color: '#C0C0C0', lineHeight: 1 }}>—</span>
                  <span className="font-nunito" style={{ fontWeight: 400, fontSize: '0.7rem', color: '#A0B080' }}>nessun dato</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={() => navigateHistory(-1)}
            disabled={historyDayIdx <= 0}
            style={{
              background: 'none', border: 'none', fontSize: 18, color: historyDayIdx <= 0 ? '#D0D0D0' : '#6B8050',
              cursor: historyDayIdx <= 0 ? 'default' : 'pointer', padding: '4px 6px',
            }}
          >→</button>
        </div>
      </div>

      {/* ── Food search bottom sheet ── */}
      {addingMeal && (
        <FoodSearch
          mealName={MEALS.find(m => m.key === addingMeal)?.label || addingMeal}
          onAdd={(item) => handleAdd(addingMeal, item)}
          onClose={() => setAddingMeal(null)}
        />
      )}

      {/* ── Manage meal bottom sheet ── */}
      {managingMeal && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="slide-up flex flex-col"
            style={{
              background: '#FFFFFF',
              borderRadius: '32px 32px 0 0',
              boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
              maxHeight: '70vh',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div style={{ width: 40, height: 5, background: '#E0E0E0', borderRadius: 99 }} />
            </div>
            <div className="flex items-center justify-between px-5 pb-3">
              <h3 className="font-nunito" style={{ fontWeight: 800, fontSize: 16, color: '#2D3A1A' }}>
                {MEALS.find(m => m.key === managingMeal)?.emoji}{' '}
                {MEALS.find(m => m.key === managingMeal)?.label}
              </h3>
              <button
                onClick={() => { setManagingMeal(null); setEditingItem(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{ background: '#F5F5F5', color: '#A0B080', border: 'none' }}
              >✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-5">
              {(log[managingMeal] || []).map(item => {
                const ms = MEAL_STYLE[managingMeal];
                return (
                  <div key={item.id} className="mb-2">
                    {editingItem === item.id ? (
                      <div
                        className="rounded-2xl p-3"
                        style={{ background: '#F8FFF8', border: `1px solid ${ms.accent}40` }}
                      >
                        <p className="font-nunito text-sm mb-2" style={{ color: '#2D3A1A', fontWeight: 600 }}>
                          {item.nome}
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={editGrams}
                            onChange={e => setEditGrams(e.target.value)}
                            placeholder="Grammi"
                            className="flex-1 rounded-xl px-3 py-2 font-nunito text-sm outline-none"
                            style={{ background: '#F5F5F5', border: `1.5px solid ${ms.accent}`, color: '#2D3A1A' }}
                          />
                          <button
                            onClick={() => handleEditSave(managingMeal, item.id)}
                            className="px-4 py-2 rounded-xl font-nunito font-bold text-sm"
                            style={{ background: ms.gradient, color: 'white', border: 'none' }}
                          >
                            Salva
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="px-3 py-2 rounded-xl font-nunito text-sm"
                            style={{ background: '#F5F5F5', color: '#A0B080', border: 'none' }}
                          >✕</button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex items-center gap-2 py-2 px-1"
                        style={{ borderBottom: '1px solid #F0F0F0' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-nunito font-semibold text-sm truncate" style={{ color: '#2D3A1A' }}>
                            {item.nome}
                          </p>
                          <p className="font-nunito text-xs" style={{ color: '#4CAF50', fontWeight: 700 }}>
                            {item.grammi}g → {item.mcg !== null ? `${item.mcg} mcg` : 'N.D.'}
                          </p>
                        </div>
                        <button
                          onClick={() => { setEditingItem(item.id); setEditGrams(String(item.grammi)); }}
                          className="px-3 py-1.5 rounded-xl font-nunito text-xs"
                          style={{ background: '#F0FFF0', color: '#4CAF50', border: '1px solid #4CAF5040', fontWeight: 700 }}
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => handleDelete(managingMeal, item.id)}
                          className="px-3 py-1.5 rounded-xl font-nunito text-xs"
                          style={{ background: '#FFF0F0', color: '#FF4444', border: '1px solid #FF444440', fontWeight: 700 }}
                        >
                          Elimina
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
