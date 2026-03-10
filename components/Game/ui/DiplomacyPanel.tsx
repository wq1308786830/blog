/**
 * 外交面板
 * 处理与其他势力的外交关系
 */
'use client';

import { useState, useMemo } from 'react';
import { useGame } from '../GameProvider';
import { DiplomaticStatus, type Faction } from '../types/gameTypes';
import './diplomacyPanel.css';

interface DiplomacyPanelProps {
  onClose: () => void;
}

export function DiplomacyPanel({ onClose }: DiplomacyPanelProps) {
  const { state, dispatch, playerState } = useGame();
  const [selectedFactionId, setSelectedFactionId] = useState<string | null>(null);
  const [proposalType, setProposalType] = useState<'alliance' | 'trade' | 'war' | 'peace' | null>(null);

  // 获取所有非玩家势力
  const factions = useMemo(() => {
    const factionMap = new Map<string, Faction>();
    state.territories.forEach(t => {
      if (t.ownerId && t.ownerId !== playerState.factionId && !factionMap.has(t.ownerId)) {
        factionMap.set(t.ownerId, {
          id: t.ownerId,
          name: t.ownerId.replace('faction-', '').toUpperCase(),
          leaderName: 'Unknown',
          color: '#ff0000',
          emblem: '',
          description: '',
          territoryIds: [],
          resources: { population: 0, food: 0, gold: 0, wood: 0, iron: 0, prestige: 0 },
          isPlayer: false,
          isAI: true,
          founded: 0
        });
      }
    });
    return Array.from(factionMap.values());
  }, [state.territories, playerState.factionId]);

  // 获取与选中势力的外交关系
  const diplomaticRelations = useMemo(() => {
    if (!selectedFactionId) return [];
    return state.diplomaticRelations.filter(
      r => (r.faction1Id === playerState.factionId && r.faction2Id === selectedFactionId) ||
           (r.faction2Id === playerState.factionId && r.faction1Id === selectedFactionId)
    );
  }, [state.diplomaticRelations, selectedFactionId, playerState.factionId]);

  const getStatusColor = (status: DiplomaticStatus): string => {
    switch (status) {
      case DiplomaticStatus.ALLIED: return '#00ff00';
      case DiplomaticStatus.FRIENDLY: return '#88ff00';
      case DiplomaticStatus.NEUTRAL: return '#ffff00';
      case DiplomaticStatus.HOSTILE: return '#ff8800';
      case DiplomaticStatus.AT_WAR: return '#ff0000';
      case DiplomaticStatus.VASSAL: return '#8800ff';
      default: return '#888888';
    }
  };

  const getStatusText = (status: DiplomaticStatus): string => {
    switch (status) {
      case DiplomaticStatus.ALLIED: return '同盟';
      case DiplomaticStatus.FRIENDLY: return '友好';
      case DiplomaticStatus.NEUTRAL: return '中立';
      case DiplomaticStatus.HOSTILE: return '敌对';
      case DiplomaticStatus.AT_WAR: return '战争';
      case DiplomaticStatus.VASSAL: return '附庸';
      default: return '未知';
    }
  };

  const handleSendProposal = () => {
    if (!selectedFactionId || !proposalType) return;

    let newStatus: DiplomaticStatus;
    switch (proposalType) {
      case 'alliance':
        newStatus = DiplomaticStatus.ALLIED;
        break;
      case 'trade':
        newStatus = DiplomaticStatus.FRIENDLY;
        break;
      case 'peace':
        newStatus = DiplomaticStatus.NEUTRAL;
        break;
      case 'war':
        newStatus = DiplomaticStatus.AT_WAR;
        break;
      default:
        return;
    }

    dispatch({
      type: 'UPDATE_DIPLOMACY',
      payload: {
        faction1Id: playerState.factionId,
        faction2Id: selectedFactionId,
        status: newStatus
      }
    });

    dispatch({
      type: 'ADD_LOG',
      payload: {
        message: `向 ${selectedFactionId} 发送了${proposalType === 'alliance' ? '同盟' : proposalType === 'trade' ? '贸易' : proposalType === 'peace' ? '和平' : '宣战'}提议`,
        type: 'diplomacy'
      }
    });

    setProposalType(null);
  };

  return (
    <div className="diplomacy-panel">
      <div className="diplomacy-header">
        <h2>外交关系</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="diplomacy-content">
        <div className="factions-list">
          <h3>各方势力</h3>
          {factions.map(faction => {
            const relation = diplomaticRelations.find(
              r => r.faction1Id === faction.id || r.faction2Id === faction.id
            );
            const status = relation?.status || DiplomaticStatus.NEUTRAL;

            return (
              <div
                key={faction.id}
                className={`faction-item ${selectedFactionId === faction.id ? 'selected' : ''}`}
                onClick={() => setSelectedFactionId(faction.id)}
              >
                <div className="faction-icon" style={{ backgroundColor: faction.color }}></div>
                <div className="faction-info">
                  <span className="faction-name">{faction.name}</span>
                  <span className="faction-status" style={{ color: getStatusColor(status) }}>
                    {getStatusText(status)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {selectedFactionId && (
          <div className="diplomacy-actions">
            <h3>外交行动</h3>
            <div className="proposal-buttons">
              <button
                className={`proposal-button ${proposalType === 'alliance' ? 'active' : ''}`}
                onClick={() => setProposalType('alliance')}
              >
                <span className="icon">🤝</span>
                <span>同盟</span>
              </button>
              <button
                className={`proposal-button ${proposalType === 'trade' ? 'active' : ''}`}
                onClick={() => setProposalType('trade')}
              >
                <span className="icon">💰</span>
                <span>贸易</span>
              </button>
              <button
                className={`proposal-button ${proposalType === 'peace' ? 'active' : ''}`}
                onClick={() => setProposalType('peace')}
              >
                <span className="icon">🕊️</span>
                <span>求和</span>
              </button>
              <button
                className={`proposal-button war ${proposalType === 'war' ? 'active' : ''}`}
                onClick={() => setProposalType('war')}
              >
                <span className="icon">⚔️</span>
                <span>宣战</span>
              </button>
            </div>

            {proposalType && (
              <button className="send-proposal-button" onClick={handleSendProposal}>
                发送提议
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}