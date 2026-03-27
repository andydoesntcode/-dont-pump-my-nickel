import React, { useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import OnboardingScreen from './components/OnboardingScreen';
import HomeScreen from './components/HomeScreen';
import DatabaseScreen from './components/DatabaseScreen';
import SuggestionsScreen from './components/SuggestionsScreen';
import SettingsScreen from './components/SettingsScreen';

const TABS = [
  { key: 'home',        label: 'HOME',     icon: '🏠' },
  { key: 'database',    label: 'DATABASE', icon: '📋' },
  { key: 'suggerimenti',label: 'CONSIGLI', icon: '💡' },
];

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_LOG = { colazione: [], pranzo: [], spuntini: [], cena: [] };

/* ── Blob background layer ── */
function BlobBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        maxWidth: 430,
        margin: '0 auto',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Blob 1 – verde chiaro, top-left */}
      <div style={{
        position: 'absolute', top: -70, left: -90,
        width: 300, height: 300,
        background: '#C8F0C0',
        borderRadius: '60% 40% 70% 30% / 40% 60% 30% 70%',
        opacity: 0.6,
      }} />
      {/* Blob 2 – giallo, top-right */}
      <div style={{
        position: 'absolute', top: -50, right: -70,
        width: 260, height: 260,
        background: '#FFE680',
        borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%',
        opacity: 0.6,
      }} />
      {/* Blob 3 – pesca, center-left */}
      <div style={{
        position: 'absolute', top: '35%', left: -80,
        width: 220, height: 220,
        background: '#FFD0A0',
        borderRadius: '50% 70% 40% 60% / 30% 50% 70% 40%',
        opacity: 0.5,
      }} />
      {/* Blob 4 – verde chiaro, bottom-right */}
      <div style={{
        position: 'absolute', bottom: 80, right: -90,
        width: 280, height: 280,
        background: '#C8F0C0',
        borderRadius: '70% 30% 50% 50% / 60% 40% 60% 40%',
        opacity: 0.5,
      }} />
      {/* Blob 5 – giallo, bottom-left */}
      <div style={{
        position: 'absolute', bottom: -50, left: -50,
        width: 240, height: 240,
        background: '#FFE680',
        borderRadius: '40% 60% 70% 30% / 70% 30% 60% 40%',
        opacity: 0.45,
      }} />

      {/* Floating food icons */}
      <span className="float-icon-1" style={{
        position: 'absolute', top: '18%', right: 24,
        fontSize: 28, opacity: 0.35, userSelect: 'none',
      }}>🥦</span>
      <span className="float-icon-2" style={{
        position: 'absolute', top: '52%', left: 18,
        fontSize: 24, opacity: 0.30, userSelect: 'none',
      }}>🥕</span>
      <span className="float-icon-3" style={{
        position: 'absolute', top: '72%', right: 32,
        fontSize: 26, opacity: 0.30, userSelect: 'none',
      }}>🍎</span>
      <span className="float-icon-4" style={{
        position: 'absolute', top: '40%', right: 16,
        fontSize: 22, opacity: 0.25, userSelect: 'none',
      }}>🌿</span>
    </div>
  );
}

export default function App() {
  const [userData, setUserData]   = useLocalStorage('dpmn_user', null);
  const [logData, setLogData]     = useLocalStorage('dpmn_log', { date: getTodayStr(), meals: EMPTY_LOG });
  const [activeTab, setActiveTab] = useLocalStorage('dpmn_tab', 'home');
  const [showSettings, setShowSettings] = useLocalStorage('dpmn_settings', false);

  useEffect(() => {
    const today = getTodayStr();
    if (logData.date !== today) {
      // Save the completed day's total to history before resetting
      if (logData.date && logData.meals) {
        const dayTotal = Object.values(logData.meals).flat().reduce((sum, item) => sum + (item.mcg || 0), 0);
        try {
          const history = JSON.parse(localStorage.getItem('nickel_history') || '{}');
          history[logData.date] = Math.round(dayTotal * 10) / 10;
          localStorage.setItem('nickel_history', JSON.stringify(history));
        } catch {}
      }
      setLogData({ date: today, meals: EMPTY_LOG });
    }
  }, []);

  if (!userData) {
    return (
      <>
        <BlobBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <OnboardingScreen onComplete={(data) => {
            setUserData(data);
            setActiveTab('home');
          }} />
        </div>
      </>
    );
  }

  function handleReset() {
    localStorage.removeItem('dpmn_user');
    localStorage.removeItem('dpmn_log');
    localStorage.removeItem('dpmn_tab');
    localStorage.removeItem('dpmn_settings');
    setUserData(null);
    setLogData({ date: getTodayStr(), meals: EMPTY_LOG });
    setActiveTab('home');
    setShowSettings(false);
  }

  function handleSaveSettings(newData) {
    setUserData(newData);
    setShowSettings(false);
  }

  const meals = logData.meals || EMPTY_LOG;

  function setMeals(updater) {
    setLogData(prev => ({
      ...prev,
      meals: typeof updater === 'function' ? updater(prev.meals || EMPTY_LOG) : updater,
    }));
  }

  return (
    <>
      <BlobBackground />
      <div className="relative" style={{ minHeight: '100dvh', zIndex: 1 }}>
        {/* Main content */}
        <div className="overflow-y-auto" style={{ minHeight: '100vh', paddingBottom: 72 }}>
          {showSettings ? (
            <div>
              <div className="flex items-center gap-3 px-5 pt-safe pt-6 pb-2">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex items-center gap-1 font-nunito font-bold text-sm"
                  style={{ color: '#4CAF50' }}
                >
                  ← Indietro
                </button>
              </div>
              <SettingsScreen
                userData={userData}
                onSave={handleSaveSettings}
                onReset={handleReset}
              />
            </div>
          ) : activeTab === 'home' ? (
            <HomeScreen
              userData={userData}
              log={meals}
              setLog={setMeals}
              onOpenSettings={() => setShowSettings(true)}
            />
          ) : activeTab === 'database' ? (
            <DatabaseScreen />
          ) : (
            <SuggestionsScreen />
          )}
        </div>

        {/* Bottom nav */}
        {!showSettings && (
          <div
            className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around"
            style={{
              background: '#FFFFFF',
              borderTop: '2px solid #F0F0F0',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
              height: 72,
              paddingBottom: 'env(safe-area-inset-bottom)',
              maxWidth: 430,
              margin: '0 auto',
            }}
          >
            {TABS.map(tab => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all duration-200"
                  style={{ color: isActive ? '#4CAF50' : '#A0B080' }}
                >
                  <span style={{
                    fontSize: 22,
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    display: 'block',
                    transition: 'all 0.2s',
                  }}>{tab.icon}</span>
                  <span
                    className="font-nunito font-bold uppercase tracking-wide"
                    style={{ fontSize: 10, letterSpacing: '0.5px' }}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <div
                      className="rounded-full"
                      style={{ width: 6, height: 6, background: '#4CAF50', marginTop: 2 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
