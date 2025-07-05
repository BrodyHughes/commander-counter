import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Zap, Droplet, Skull } from 'lucide-react-native';

import CountersMenuButtons from './CountersMenuButtons';
import { OFF_WHITE } from '@/consts/consts';

interface Props {
  defenderId: number;
}

const COUNTERS = [
  { key: 'storm', Icon: Zap },
  { key: 'poison', Icon: Skull },
  { key: 'mana', Icon: Droplet },
] as const;

export default function CountersMenu({ defenderId }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.grid}>
        {COUNTERS.map(({ key, Icon }) => (
          <View key={key} style={styles.column}>
            <View style={styles.iconWrap}>
              <Icon color={OFF_WHITE} size={32} />
            </View>

            <CountersMenuButtons defenderId={defenderId} counter={key} cellW={100} cellH={100} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 5,
  },

  column: {
    width: '33.33%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },

  iconWrap: {
    marginBottom: 10,
  },
});
