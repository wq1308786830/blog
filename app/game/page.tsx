/**
 * 游戏主页面
 * 春秋战国策略游戏入口
 */

import { Metadata } from 'next';
import { GameClient } from '../../components/Game/GameClient';
import './game.css';

export const metadata: Metadata = {
  title: '春秋战国 - 策略游戏',
  description: '基于春秋战国时期历史背景的策略游戏，从小领主成长为统一天下的霸主',
};

export default function GamePage() {
  return (
    <main className="game-page">
      <GameClient />
    </main>
  );
}
