/**
 * 事件弹窗组件
 * 显示历史事件和选择
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HistoricEvent, EventChoice, EventEffect } from '../data/events';
import './eventModal.css';

interface EventModalProps {
  isOpen: boolean;
  event: HistoricEvent | null;
  onClose: () => void;
  onChoice: (choice: EventChoice) => void;
  canAffordChoice: (choice: EventChoice) => boolean;
}

// 效果描述
function getEffectDescription(effect: EventEffect): string {
  const typeNames: Record<string, string> = {
    resources: '资源',
    prestige: '声望',
    territory: '领土',
    hero: '武将',
    relation: '关系',
    phase: '阶段',
  };

  const resourceNames: Record<string, string> = {
    gold: '金钱',
    food: '粮食',
    wood: '木材',
    iron: '铁矿',
    population: '人口',
  };

  let targetName = effect.target;
  if (effect.type === 'resources') {
    targetName = resourceNames[effect.target] || effect.target;
  }

  const sign = effect.value >= 0 ? '+' : '';
  const duration = effect.duration ? ` (${effect.duration}回合)` : '';

  return `${typeNames[effect.type]}: ${sign}${effect.value} ${targetName}${duration}`;
}

// 事件类型图标
function getEventTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    political: '🏛️',
    military: '⚔️',
    economic: '💰',
    diplomatic: '🤝',
    natural: '🌊',
    hero: '👤',
    historic: '📜',
  };
  return icons[type] || '📌';
}

// 事件类型名称
function getEventTypeName(type: string): string {
  const names: Record<string, string> = {
    political: '政治事件',
    military: '军事事件',
    economic: '经济事件',
    diplomatic: '外交事件',
    natural: '自然灾害',
    hero: '武将事件',
    historic: '历史事件',
  };
  return names[type] || '事件';
}

export function EventModal({
  isOpen,
  event,
  onClose,
  onChoice,
  canAffordChoice,
}: EventModalProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedChoice(null);
      setIsProcessing(false);
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const handleChoice = async (choice: EventChoice) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setSelectedChoice(choice.id);

    // 延迟关闭以显示选择动画
    await new Promise((resolve) => setTimeout(resolve, 500));

    onChoice(choice);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="event-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`event-modal ${event.isHistoric ? 'historic' : ''}`}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          {/* 历史事件标记 */}
          {event.isHistoric && (
            <div className="historic-badge">
              <span className="badge-icon">📜</span>
              <span className="badge-text">历史事件</span>
            </div>
          )}

          {/* 事件头部 */}
          <div className="event-header">
            <div className="event-type-icon">{getEventTypeIcon(event.type)}</div>
            <div className="event-meta">
              <span className="event-type">{getEventTypeName(event.type)}</span>
              {event.triggerYear && (
                <span className="event-year">公元前 {Math.abs(event.triggerYear)} 年</span>
              )}
            </div>
          </div>

          {/* 事件标题 */}
          <motion.h2
            className="event-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {event.title}
          </motion.h2>

          {/* 事件描述 */}
          <motion.p
            className="event-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {event.description}
          </motion.p>

          {/* 选择列表 */}
          <div className="event-choices">
            <h3 className="choices-title">选择行动</h3>
            {event.choices.map((choice, index) => {
              const affordable = canAffordChoice(choice);
              const isSelected = selectedChoice === choice.id;

              return (
                <motion.button
                  key={choice.id}
                  className={`choice-button ${!affordable ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => affordable && handleChoice(choice)}
                  disabled={!affordable || isProcessing}
                  whileHover={affordable ? { scale: 1.02, x: 10 } : {}}
                  whileTap={affordable ? { scale: 0.98 } : {}}
                >
                  <div className="choice-content">
                    <span className="choice-text">{choice.text}</span>
                    <span className="choice-description">{choice.description}</span>

                    {/* 效果预览 */}
                    <div className="choice-effects">
                      {choice.effects.map((effect, i) => (
                        <span
                          key={i}
                          className={`effect-tag ${effect.value >= 0 ? 'positive' : 'negative'}`}
                        >
                          {getEffectDescription(effect)}
                        </span>
                      ))}
                    </div>

                    {/* 需求提示 */}
                    {choice.requirements && !affordable && (
                      <div className="requirements-hint">
                        <span className="hint-icon">⚠️</span>
                        <span>资源不足</span>
                      </div>
                    )}
                  </div>

                  {/* 选中指示器 */}
                  {isSelected && (
                    <motion.div
                      className="selected-indicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* 底部装饰 */}
          <div className="event-footer">
            <div className="footer-line" />
            <span className="footer-text">历史由你选择</span>
            <div className="footer-line" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// 小型事件通知组件
interface EventNotificationProps {
  event: HistoricEvent;
  onClick: () => void;
  onDismiss: () => void;
}

export function EventNotification({ event, onClick, onDismiss }: EventNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 10000); // 10秒后自动消失

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      className={`event-notification ${event.isHistoric ? 'historic' : ''}`}
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="notification-icon">{getEventTypeIcon(event.type)}</div>
      <div className="notification-content">
        <h4 className="notification-title">{event.title}</h4>
        <p className="notification-desc">{event.description.slice(0, 50)}...</p>
      </div>
      {event.isHistoric && <div className="historic-indicator">📜</div>}
      <button
        className="dismiss-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
      >
        ×
      </button>
    </motion.div>
  );
}

export default EventModal;
