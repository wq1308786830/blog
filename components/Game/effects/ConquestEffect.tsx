/**
 * 征服特效组件
 * 领地占领动画效果
 */

'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './conquestEffect.css';

interface ConquestEffectProps {
  isActive: boolean;
  territoryName: string;
  factionColor: string;
  factionName: string;
  onComplete?: () => void;
}

export function ConquestEffect({
  isActive,
  territoryName,
  factionColor,
  factionName,
  onComplete,
}: ConquestEffectProps) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="conquest-effect-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 背景扫描线效果 */}
        <motion.div
          className="conquest-scanlines"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* 领地征服主效果 */}
        <motion.div
          className="conquest-main"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        >
          {/* 领地名称 */}
          <motion.h2
            className="conquest-territory-name"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ textShadow: `0 0 30px ${factionColor}` }}
          >
            {territoryName}
          </motion.h2>

          {/* 征服动画 */}
          <motion.div
            className="conquest-animation"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.5, 1] }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* 扩散环 */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="conquest-ring"
                style={{ borderColor: factionColor }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: 0.5 + i * 0.3,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* 中心标志 */}
            <motion.div
              className="conquest-icon"
              style={{ backgroundColor: factionColor }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: 0 },
                scale: { duration: 0.5, repeat: 2 },
              }}
            >
              🏴
            </motion.div>
          </motion.div>

          {/* 征服文字 */}
          <motion.div
            className="conquest-text"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="conquest-label">已被</span>
            <motion.span
              className="conquest-faction"
              style={{ color: factionColor }}
              animate={{ textShadow: [`0 0 10px ${factionColor}`, `0 0 30px ${factionColor}`, `0 0 10px ${factionColor}`] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {factionName}
            </motion.span>
            <span className="conquest-label">征服</span>
          </motion.div>

          {/* 粒子效果 */}
          <div className="conquest-particles">
            {[...Array(20)].map((_, i) => (
              <motion.span
                key={i}
                className="conquest-particle"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  opacity: [1, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 0.8 + Math.random() * 0.5,
                }}
                style={{
                  backgroundColor: factionColor,
                }}
              >
                {['✨', '⭐', '🔥', '💫'][i % 4]}
              </motion.span>
            ))}
          </div>

          {/* 领土边界高亮 */}
          <motion.div
            className="territory-highlight"
            style={{ borderColor: factionColor }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 1, 0.5] }}
            transition={{ duration: 2, delay: 1.5 }}
          />
        </motion.div>

        {/* 底部信息 */}
        <motion.div
          className="conquest-info"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <div className="conquest-bonus">
            <span className="bonus-icon">💰</span>
            <span>获得领地控制权</span>
          </div>
          <div className="conquest-bonus">
            <span className="bonus-icon">🏛️</span>
            <span>可建设新建筑</span>
          </div>
          <div className="conquest-bonus">
            <span className="bonus-icon">⚔️</span>
            <span>可招募更多军队</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// 势力扩张特效
interface ExpansionEffectProps {
  isActive: boolean;
  factionName: string;
  factionColor: string;
  newTerritoryCount: number;
  onComplete?: () => void;
}

export function ExpansionEffect({
  isActive,
  factionName,
  factionColor,
  newTerritoryCount,
  onComplete,
}: ExpansionEffectProps) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="expansion-effect-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="expansion-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {/* 扩张标题 */}
          <motion.div
            className="expansion-title"
            style={{ color: factionColor }}
            animate={{
              textShadow: [
                `0 0 20px ${factionColor}`,
                `0 0 40px ${factionColor}`,
                `0 0 20px ${factionColor}`,
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            势力扩张
          </motion.div>

          {/* 势力信息 */}
          <motion.div
            className="expansion-faction"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="faction-emblem"
              style={{ backgroundColor: factionColor }}
            >
              👑
            </div>
            <div className="faction-name-large">{factionName}</div>
          </motion.div>

          {/* 领地数量 */}
          <motion.div
            className="territory-count-display"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <motion.span
              className="count-number"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {newTerritoryCount}
            </motion.span>
            <span className="count-label">领地</span>
          </motion.div>

          {/* 扩张动画 */}
          <div className="expansion-animation">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="expansion-wave"
                style={{ borderColor: factionColor }}
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: i * 0.4,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ConquestEffect;
