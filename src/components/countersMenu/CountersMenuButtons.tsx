import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCounterStore } from '@/store/useCounterStore';
import { BORDER_COLOR } from '@/consts/consts';

type CounterKey = 'storm' | 'poison' | 'mana';

interface Props {
  defenderId: number;
  counter: CounterKey;
  cellW: number;
  cellH: number;
}

export default function CountersMenuButtons({ defenderId, counter, cellW, cellH }: Props) {
  const value = useCounterStore((s) => {
    const row = s.get(defenderId);
    return counter === 'storm' ? row.storm : counter === 'poison' ? row.poison : row.mana;
  });

  const inc = useCounterStore(
    counter === 'storm'
      ? (s) => s.incStorm
      : counter === 'poison'
        ? (s) => s.incPoison
        : (s) => s.incMana,
  );

  const dec = () => inc(defenderId, -1);

  return (
    <View style={[styles.square, { width: `${cellW - 2}%`, height: `${cellH - 4}%` }]}>
      <Text style={styles.total}>{value}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn]}
          onPress={() => inc(defenderId, +1)}
          activeOpacity={0.8}
        >
          <Text style={[styles.btnTxt, { marginBottom: 9 }]}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn]} onPress={dec} activeOpacity={0.8}>
          <Text style={[styles.btnTxt, { marginTop: 9 }]}>‑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 3,
    overflow: 'hidden',
    borderWidth: 7,
    borderColor: BORDER_COLOR,
    backgroundColor: 'rgba(214, 214, 214, 0.13)',
  },
  total: {
    color: '#fff',
    fontSize: 40,
    fontFamily: 'Comfortaa-Bold',
    zIndex: 1,
    pointerEvents: 'box-none',
    marginTop: 5,
  },
  btnRow: {
    position: 'absolute',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  btn: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTxt: { color: '#fff', fontSize: 18, fontWeight: 200, fontFamily: 'Comfortaa-Bold' },
});
