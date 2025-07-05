import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { PlayerState } from '@/store/useLifeStore';
import DamageIncrementer from './DamageIncrementer';
import { GAP } from '@/consts/consts';

interface Props {
  players: PlayerState[];
  defenderId: number;
  layoutConfigurations: { [count: number]: { columns: number; rows: number } };
}

export default function GlobalDamageOverlays({ players, defenderId, layoutConfigurations }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  const totalPlayersCount = players.length;
  const currentLayout = layoutConfigurations[totalPlayersCount] || layoutConfigurations[4];
  const { columns, rows } = currentLayout;

  const usableW = W - (columns + 1) * GAP;
  const usableH = H - top - bottom - (rows + 1) * GAP;
  const panelW = usableW / columns;
  const panelH = usableH / rows;

  return (
    <Animated.View
      style={styles.overlayManagerContainer}
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(150)}
    >
      {players.map((player, index) => {
        if (player.id === defenderId) {
          return null;
        }

        // The original panel is rotated 0 or 180. The DamageIncrementer needs this value to counter-rotate its content.
        const isEvenPlayerIndexNumber = index % 2 === 0;
        const rot = isEvenPlayerIndexNumber ? '0deg' : '180deg';

        // The overlay itself is rotated 90deg to match the panel's internal content flow.
        const gridCellTop = Math.floor(index / columns) * (panelH + GAP) + GAP + top;
        const gridCellLeft = (index % columns) * (panelW + GAP) + GAP;

        const panelStyle = {
          position: 'absolute' as const,
          width: panelH, // Swapped with height bc its rotated 90deg
          height: panelW, // Swapped with width bc its rotated 90deg
          top: gridCellTop + (panelH - panelW) / 2, // Center vertically
          left: gridCellLeft + (panelW - panelH) / 2, // Center horizontally
          transform: [{ rotate: '90deg' }],
        };

        return (
          <View key={player.id} style={panelStyle}>
            <DamageIncrementer
              dealerId={player.id}
              defenderId={defenderId}
              appliedRot={rot}
              isEvenPlayerIndexNumber={isEvenPlayerIndexNumber}
            />
          </View>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlayManagerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
    pointerEvents: 'box-none',
  },
});
