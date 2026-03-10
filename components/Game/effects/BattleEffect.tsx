/**
 * 战斗特效组件
 * 赛博朋克风格的战斗动画效果
 */

'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './battleEffect.css';

interface BattleEffectProps {
  isActive: boolean;
  type: 'slash' | 'impact' | 'magic' | 'arrow' | 'explosion';
  position?: { x: number; y: number };
  direction?: 'left' | 'right' | 'up' | 'down';
  onComplete?: () => void;
}

// 斩击特效
function SlashEffect({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  const rotation = direction === 'left' ? -45 : 45;

  return (
    <motion.div
      className="effect-slash"
      initial={{ opacity: 0, scale: 0.5, rotate: rotation }}
      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1], rotate: rotation }}
      transition={{ duration: 0.3 }}
    >
      <svg viewBox="0 0 100 100" className="slash-svg">
        <defs>
          <linearGradient id="slashGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0066" />
            <stop offset="50%" stopColor="#ff00ff" />
            <stop offset="100%" stopColor="#00f5ff" />
          </linearGradient>
          <filter id="slashGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M 10 50 Q 30 20, 50 50 Q 70 80, 90 50"
          stroke="url(#slashGradient)"
          strokeWidth="4"
          fill="none"
          filter="url(#slashGlow)"
          className="slash-path"
        />
      </svg>
    </motion.div>
  );
}

// 冲击特效
function ImpactEffect() {
  return (
    <motion.div
      className="effect-impact"
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: [0, 1.5, 2], opacity: [1, 0.8, 0] }}
      transition={{ duration: 0.4 }}
    >
      <div className="impact-ring ring-1" />
      <div className="impact-ring ring-2" />
      <div className="impact-ring ring-3" />
      <div className="impact-center">💥</div>
    </motion.div>
  );
}

// 箭雨特效
function ArrowEffect({ direction = 'right' }: { direction?: 'left' | 'right' }) {
  const arrows = Array.from({ length: 5 }, (_, i) => i);
  const xOffset = direction === 'left' ? -100 : 100;

  return (
    <div className="effect-arrows">
      {arrows.map((i) => (
        <motion.div
          key={i}
          className="arrow"
          initial={{ x: xOffset, y: (i - 2) * 20, opacity: 0 }}
          animate={{ x: 0, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 0.4,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
        >
          🏹
        </motion.div>
      ))}
    </div>
  );
}

// 爆炸特效
function ExplosionEffect() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 30 * Math.PI) / 180,
    distance: 50 + Math.random() * 30,
  }));

  return (
    <div className="effect-explosion">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="explosion-particle"
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0.5],
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.5 }}
        />
      ))}
      <motion.div
        className="explosion-core"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.5, 0], opacity: [1, 0.8, 0] }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

// 魔法特效
function MagicEffect() {
  const runes = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ'];

  return (
    <div className="effect-magic">
      {runes.map((rune, i) => (
        <motion.span
          key={i}
          className="magic-rune"
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1.2, 0.8],
            rotate: 360,
          }}
          transition={{
            duration: 1,
            delay: i * 0.1,
          }}
          style={{
            position: 'absolute',
            left: `${50 + 30 * Math.cos((i * 60 * Math.PI) / 180)}%`,
            top: `${50 + 30 * Math.sin((i * 60 * Math.PI) / 180)}%`,
          }}
        >
          {rune}
        </motion.span>
      ))}
      <motion.div
        className="magic-circle"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1.5], opacity: [0, 0.6, 0] }}
        transition={{ duration: 1 }}
      />
    </div>
  );
}

// 伤害数字特效
interface DamageNumberProps {
  damage: number;
  isCritical?: boolean;
  isHeal?: boolean;
  onComplete?: () => void;
}

export function DamageNumber({
  damage,
  isCritical = false,
  isHeal = false,
  onComplete,
}: DamageNumberProps) {
  const color = isHeal ? '#00ff66' : isCritical ? '#ff0000' : '#ffcc00';

  return (
    <motion.div
      className={`damage-number ${isCritical ? 'critical' : ''} ${isHeal ? 'heal' : ''}`}
      initial={{ y: 0, opacity: 1, scale: isCritical ? 1.5 : 1 }}
      animate={{
        y: -80,
        opacity: [1, 1, 0],
        scale: isCritical ? [1.5, 1.8, 1] : [1, 1.2, 1],
      }}
      transition={{ duration: 1, ease: 'easeOut' }}
      onAnimationComplete={onComplete}
      style={{ color }}
    >
      {isHeal ? '+' : '-'}{damage}
      {isCritical && <span className="critical-text">暴击!</span>}
    </motion.div>
  );
}

// 主战斗特效组件
export function BattleEffect({
  isActive,
  type,
  position,
  direction,
  onComplete,
}: BattleEffectProps) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="battle-effect-container"
        style={position ? { left: position.x, top: position.y } : undefined}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {type === 'slash' && <SlashEffect direction={direction as 'left' | 'right'} />}
        {type === 'impact' && <ImpactEffect />}
        {type === 'arrow' && <ArrowEffect direction={direction as 'left' | 'right'} />}
        {type === 'explosion' && <ExplosionEffect />}
        {type === 'magic' && <MagicEffect />}
      </motion.div>
    </AnimatePresence>
  );
}

// 连击特效
interface ComboEffectProps {
  combo: number;
  onComplete?: () => void;
}

export function ComboEffect({ combo, onComplete }: ComboEffectProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="combo-effect"
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: [0, 1.2, 1], rotate: [-20, 10, 0] }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <span className="combo-count">{combo}</span>
      <span className="combo-text">连击!</span>
    </motion.div>
  );
}

// 战斗结束特效
interface BattleEndEffectProps {
  isVictory: boolean;
  onComplete?: () => void;
}

export function BattleEndEffect({ isVictory, onComplete }: BattleEndEffectProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className={`battle-end-effect ${isVictory ? 'victory' : 'defeat'}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <motion.div
        className="end-icon"
        animate={isVictory ? { rotate: [0, 360] } : { y: [0, -10, 0] }}
        transition={{ duration: 1, repeat: isVictory ? 0 : Infinity }}
      >
        {isVictory ? '🏆' : '💀'}
      </motion.div>
      <h2 className="end-text">
        {isVictory ? '胜利!' : '失败!'}
      </h2>
      {isVictory && (
        <motion.div
          className="confetti"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span
              key={i}
              className="confetti-piece"
              initial={{ y: -20, x: 0, opacity: 1 }}
              animate={{
                y: 200,
                x: (i - 10) * 20,
                rotate: 720,
                opacity: 0,
              }}
              transition={{ duration: 2, delay: i * 0.05 }}
            >
              {['✨', '🎉', '⭐', '🎊'][i % 4]}
            </motion.span>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default BattleEffect;
