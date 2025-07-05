import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { PlayerState } from '@/store/useLifeStore';
import { typography, spacing } from '@/styles/global';
import { OFF_WHITE, TEXT } from '@/consts/consts';

interface LifeViewProps {
  player: PlayerState;
  changeLifeByAmount: (amount: number) => void;
  handleLongPressStart: (direction: 'inc' | 'dec') => void;
  handlePressOut: () => void;
}

const LifeView: React.FC<LifeViewProps> = ({
  player,
  changeLifeByAmount,
  handleLongPressStart,
  handlePressOut,
}) => {
  const { life, delta } = player;
  const green = 'rgb(255, 255, 255)';
  const red = 'rgb(255, 255, 255)';

  return (
    <>
      <View style={styles.lifeBlock}>
        <Text style={styles.life}>{life}</Text>
        {delta !== 0 && (
          <Text style={[styles.delta, { color: delta > 0 ? green : red }]}>
            {delta > 0 ? `+${delta}` : delta}
          </Text>
        )}
      </View>
      <TouchableOpacity
        activeOpacity={0.1}
        style={[styles.button, styles.inc]}
        onPress={() => changeLifeByAmount(1)}
        onLongPress={() => handleLongPressStart('inc')}
        onPressOut={handlePressOut}
        delayLongPress={1000}
      />
      <TouchableOpacity
        activeOpacity={0.1}
        style={[styles.button, styles.dec]}
        onPress={() => changeLifeByAmount(-1)}
        onLongPress={() => handleLongPressStart('dec')}
        onPressOut={handlePressOut}
        delayLongPress={1000}
      />
    </>
  );
};

const styles = StyleSheet.create({
  lifeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
    zIndex: 1,
    pointerEvents: 'none',
  },
  life: {
    ...typography.heading1,
    color: OFF_WHITE,
    marginRight: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  delta: {
    ...typography.caption,
    color: OFF_WHITE,
  },
  button: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inc: { right: 0 },
  dec: { left: 0 },
  btnText: {
    fontSize: 32,
    fontFamily: 'Comfortaa-Bold',
    color: TEXT,
    transform: [{ rotate: '90deg' }],
  },
});

export default LifeView;
