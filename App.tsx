import React from 'react';
import { SafeAreaView, View, StatusBar, StyleSheet } from 'react-native';
import PlayerPanel from '@/components/playerPanel/PlayerPanel';
import CentralMenuButton from '@/components/centralMenu/CentralMenuButton';
import { useLifeStore } from '@/store/useLifeStore';
import { useCommanderDamageModeStore } from '@/store/useCommanderDamageModeStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BACKGROUND, GAP } from '@/consts/consts';
import RulingsSearch from '@/components/centralMenu/RulingsSearch';
import GlobalDamageOverlays from '@/components/commanderDamage/GlobalDamageOverlays';

export default function App() {
  const players = useLifeStore((s) => s.players);
  const { isReceiving, defenderId } = useCommanderDamageModeStore();
  const totalPlayersCount = players.length;

  const layoutConfigurations: { [count: number]: { columns: number; rows: number } } = {
    2: { columns: 1, rows: 2 },
    3: { columns: 2, rows: 2 },
    4: { columns: 2, rows: 2 },
    5: { columns: 2, rows: 3 },
    6: { columns: 2, rows: 3 },
  };

  const currentLayout = layoutConfigurations[totalPlayersCount] || layoutConfigurations[4];
  const { columns, rows } = currentLayout;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <View style={styles.grid}>
          {players.map((player, playerIndexNumber) => (
            <PlayerPanel
              key={player.id}
              player={player}
              index={playerIndexNumber}
              cols={columns}
              rows={rows}
              isEvenPlayerIndexNumber={playerIndexNumber % 2 === 0}
            />
          ))}
        </View>
        <CentralMenuButton />
        {isReceiving && defenderId !== null && (
          <GlobalDamageOverlays
            players={players}
            defenderId={defenderId}
            layoutConfigurations={layoutConfigurations}
          />
        )}
      </SafeAreaView>
      <RulingsSearch />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: BACKGROUND },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    padding: GAP,
    justifyContent: 'center',
  },
});
