import { useState } from 'react';
import { useGameState } from './hooks/useGameState';
import Navigation from './components/Navigation';
import IntroScreen from './screens/IntroScreen';
import SetupScreen from './screens/SetupScreen';
import PlacementQuizScreen from './screens/PlacementQuizScreen';
import DashboardScreen from './screens/DashboardScreen';
import WorldMapScreen from './screens/WorldMapScreen';
import WorldDetailScreen from './screens/WorldDetailScreen';
import MissionScreen from './screens/MissionScreen';
import MissionResultsScreen from './screens/MissionResultsScreen';
import BossBattleScreen from './screens/BossBattleScreen';
import ProfileScreen from './screens/ProfileScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProgressScreen from './screens/ProgressScreen';
import SettingsScreen from './screens/SettingsScreen';
import type { MissionResult, Screen } from './types';
import { checkAchievements } from './game/achievements';

export default function App() {
  const game = useGameState();
  const { state, navigate, setPlayer, setPlacementLevel, completeMission, completeBoss, unlockAchievement, updateSettings, resetGame } = game;
  const [missionResult, setMissionResult] = useState<MissionResult | null>(null);

  const hasSave = state.player.nickname !== '';

  const handleNavigate = (screen: Screen, worldId?: string, missionId?: string) => {
    navigate(screen, worldId, missionId);
  };

  const handleMissionComplete = (result: MissionResult, worldId: string) => {
    setMissionResult(result);
    completeMission(result, worldId);
    // Check achievements after state update
    const newAchs = checkAchievements(state);
    newAchs.forEach((id) => unlockAchievement(id));
    navigate('missionResults');
  };

  const handleBossVictory = () => {
    if (state.currentMissionId) {
      completeBoss(state.currentMissionId);
    }
  };

  const handleReset = () => {
    resetGame();
    navigate('intro');
  };

  const { currentScreen } = state;

  return (
    <div className="app-screen">
      <a href="#main" className="skip-link">Skip to main content</a>
      <main id="main">
        {currentScreen === 'intro' && (
          <IntroScreen
            hasSave={hasSave}
            onStart={() => navigate('setup')}
            onContinue={() => {
              if (hasSave && state.placementDone) {
                navigate('dashboard');
              } else if (hasSave) {
                navigate('placement');
              } else {
                navigate('setup');
              }
            }}
          />
        )}

        {currentScreen === 'setup' && (
          <SetupScreen
            onComplete={(nickname, avatarId) => {
              setPlayer(nickname, avatarId);
              navigate('placement');
            }}
          />
        )}

        {currentScreen === 'placement' && (
          <PlacementQuizScreen
            nickname={state.player.nickname || 'Explorer'}
            onComplete={(level) => {
              setPlacementLevel(level);
              navigate('dashboard');
            }}
          />
        )}

        {currentScreen === 'dashboard' && (
          <DashboardScreen state={state} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'worldMap' && (
          <WorldMapScreen state={state} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'worldDetail' && (
          <WorldDetailScreen state={state} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'mission' && (
          <MissionScreen
            state={state}
            onComplete={handleMissionComplete}
            onBack={() => navigate('worldDetail', state.currentWorldId)}
          />
        )}

        {currentScreen === 'missionResults' && missionResult && (
          <MissionResultsScreen
            result={missionResult}
            state={state}
            onContinue={() => {
              const worldData = state.worlds.find((w) => w.id === state.currentWorldId);
              const nextMission = worldData?.missions.find((m) => !m.completed);
              if (nextMission) {
                navigate('mission', state.currentWorldId, nextMission.id);
              } else {
                navigate('worldMap');
              }
            }}
            onReturnToMap={() => navigate('worldMap')}
          />
        )}

        {currentScreen === 'bossBattle' && (
          <BossBattleScreen
            state={state}
            onVictory={handleBossVictory}
            onBack={() => navigate('worldDetail', 'world-7')}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen state={state} onNavigate={handleNavigate} />
        )}

        {currentScreen === 'achievements' && (
          <AchievementsScreen state={state} />
        )}

        {currentScreen === 'leaderboard' && (
          <LeaderboardScreen />
        )}

        {currentScreen === 'progress' && (
          <ProgressScreen state={state} />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen
            state={state}
            onUpdateSettings={updateSettings}
            onReset={handleReset}
          />
        )}
      </main>

      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
    </div>
  );
}
