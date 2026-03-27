import React from 'react';

export default function MascotNickel({ percentage = 0, animate = false, size = 140 }) {
  const getSrc = (pct) => {
    if (pct >= 100) return '/mascot/mascot-dead.png';
    if (pct >= 90)  return '/mascot/mascot-suffering.png';
    if (pct >= 70)  return '/mascot/mascot-worried.png';
    if (pct >= 40)  return '/mascot/mascot-neutral.png';
    return '/mascot/mascot-happy.png';
  };

  const isPulsing = percentage >= 90 && percentage < 100;
  const isShaking = percentage >= 100;
  const animClass = animate
    ? 'pop-anim'
    : isShaking
    ? 'shake-anim'
    : isPulsing
    ? 'pulse-anim'
    : 'float-anim';

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <div
        className={animClass}
        style={{ width: size, height: size }}
      >
        <img
          src={getSrc(percentage)}
          alt="Nickel mascot"
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            display: 'block',
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          }}
        />
      </div>
      {/* Soft ground shadow */}
      <div style={{
        position: 'absolute',
        bottom: -8,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 80,
        height: 20,
        background: 'rgba(0,0,0,0.12)',
        borderRadius: '50%',
        filter: 'blur(6px)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
