import React, { useState, useRef, useEffect } from 'react';
import { NICKEL_DB } from '../data/nickelDB';

export default function FoodSearch({ mealName, onAdd, onClose }) {
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(null);
  const [grams, setGrams]       = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const results = query.length >= 1
    ? NICKEL_DB.filter(f => f.nome.toLowerCase().includes(query.toLowerCase())).slice(0, 20)
    : [];

  function selectFood(food) {
    setSelected(food);
    setQuery(food.nome);
  }

  function handleAdd() {
    if (!selected || !grams || parseFloat(grams) <= 0) return;
    const g = parseFloat(grams);
    const mcg = selected.nichel !== null
      ? Math.round((selected.nichel / 100) * g * 10) / 10
      : null;
    onAdd({
      foodId: selected.id,
      nome: selected.nome,
      grammi: g,
      mcg,
      nichel_per_100g: selected.nichel,
    });
    onClose();
  }

  const mealEmoji = { colazione: '🌅', pranzo: '🍽️', spuntini: '🍎', cena: '🌙' };
  const emoji = mealEmoji[mealName.toLowerCase()] || '🍴';

  return (
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
          maxHeight: '85vh',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div style={{ width: 40, height: 5, background: '#E0E0E0', borderRadius: 99 }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3">
          <h3 className="font-nunito" style={{ fontWeight: 800, fontSize: 16, color: '#2D3A1A' }}>
            {emoji} Aggiungi a {mealName.charAt(0).toUpperCase() + mealName.slice(1)}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ background: '#F5F5F5', color: '#A0B080', border: 'none' }}
          >✕</button>
        </div>

        {/* Search input */}
        <div className="px-5 pb-3">
          {!selected ? (
            <input
              ref={inputRef}
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
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="flex-1 font-nunito"
                style={{
                  background: '#F0FFF0',
                  border: '1.5px solid #4CAF5050',
                  borderRadius: 16,
                  padding: '12px 16px',
                  color: '#2D3A1A',
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {selected.nome}
              </div>
              <button
                onClick={() => { setSelected(null); setQuery(''); setGrams(''); }}
                className="rounded-full w-9 h-9 flex items-center justify-center"
                style={{ background: '#F5F5F5', color: '#A0B080', border: 'none', fontSize: 12 }}
              >✕</button>
            </div>
          )}
        </div>

        {/* ND warning */}
        {selected && selected.nichel === null && (
          <div
            className="mx-5 mb-3 rounded-2xl px-4 py-2"
            style={{ background: '#FFF9E6', border: '1px solid #FFD60050' }}
          >
            <p className="font-nunito text-xs" style={{ color: '#FF8C00', fontWeight: 600 }}>
              ⚠️ Valore non disponibile: questo alimento non verrà conteggiato nel totale.
            </p>
          </div>
        )}

        {/* Results list */}
        {!selected && results.length > 0 && (
          <div className="flex-1 overflow-y-auto px-5 pb-2">
            {results.map(food => (
              <button
                key={food.id}
                onClick={() => selectFood(food)}
                className="w-full text-left flex items-center justify-between py-3 px-1"
                style={{ borderBottom: '1px solid #F5F5F5' }}
              >
                <span className="font-nunito font-semibold text-sm flex-1 pr-2" style={{ color: '#2D3A1A' }}>
                  {food.nome}
                  {food.nota && <span className="ml-1 text-xs">⚠️</span>}
                </span>
                {food.nichel !== null ? (
                  <span
                    className="font-nunito font-bold text-xs rounded-full px-2 py-1 whitespace-nowrap"
                    style={{ background: '#E8F5E9', color: '#4CAF50', borderRadius: 99 }}
                  >
                    {food.nichel} mcg
                  </span>
                ) : (
                  <span
                    className="font-nunito text-xs rounded-full px-2 py-1"
                    style={{ background: '#F5F5F5', color: '#A0B080', borderRadius: 99 }}
                  >
                    N.D.
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Grams input + Add button */}
        {selected && (
          <div className="px-5 pb-5 flex flex-col gap-3">
            <div>
              <label className="block font-nunito text-sm mb-2" style={{ color: '#6B8050', fontWeight: 600 }}>
                Quantità in grammi
              </label>
              <input
                type="number"
                value={grams}
                onChange={e => setGrams(e.target.value)}
                placeholder="es. 100"
                min="1"
                className="w-full font-nunito text-base outline-none"
                style={{
                  background: '#F5F5F5',
                  border: '1.5px solid transparent',
                  borderRadius: 16,
                  padding: '12px 16px',
                  color: '#2D3A1A',
                }}
                onFocus={e => { e.target.style.border = '2px solid #4CAF50'; e.target.style.background = '#FFFFFF'; }}
                onBlur={e => { e.target.style.border = '1.5px solid transparent'; e.target.style.background = '#F5F5F5'; }}
              />
              {grams && parseFloat(grams) > 0 && selected.nichel !== null && (
                <p className="mt-2 font-nunito text-sm" style={{ color: '#4CAF50', fontWeight: 700 }}>
                  = {Math.round((selected.nichel / 100) * parseFloat(grams) * 10) / 10} mcg di nichel
                </p>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={!grams || parseFloat(grams) <= 0}
              className="w-full font-nunito text-lg text-white transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #56C96B, #2E9E45)',
                borderRadius: 16,
                padding: '16px 0',
                fontWeight: 800,
                border: 'none',
                boxShadow: '0 6px 16px rgba(76,175,80,0.35)',
                opacity: (!grams || parseFloat(grams) <= 0) ? 0.4 : 1,
              }}
            >
              Aggiungi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
