import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useCommanderDamageStore } from '@/store/useCommanderDamageStore';
import { OFF_WHITE } from '@/consts/consts';
import { radius, typography } from '@/styles/global';
import { BlurView } from '@react-native-community/blur';

interface Props {
  dealerId: number;
  defenderId: number;
  appliedRot: string;
  isEvenPlayerIndexNumber: boolean;
}

export default function DamageIncrementer({
  dealerId,
  defenderId,
  appliedRot,
  isEvenPlayerIndexNumber,
}: Props) {
  const damage = useCommanderDamageStore((s) => s.get(defenderId, dealerId));
  const change = useCommanderDamageStore((s) => s.change);

  const inc = () => change(defenderId, dealerId, 1);
  const dec = () => (damage > 0 ? change(defenderId, dealerId, -1) : null);

  const counterRotation = appliedRot.includes('180')
    ? '180deg'
    : appliedRot.includes('270')
      ? '90deg'
      : appliedRot.includes('90')
        ? '270deg'
        : '0deg';

  const incStyle = isEvenPlayerIndexNumber ? styles.topButton : styles.bottomButton;
  const decStyle = isEvenPlayerIndexNumber ? styles.bottomButton : styles.topButton;

  return (
    <View style={styles.container}>
      <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />
      <View style={[styles.damageBlock, { transform: [{ rotate: counterRotation }] }]}>
        <Text style={styles.damageText}>{damage}</Text>
      </View>
      <TouchableOpacity activeOpacity={0.1} style={[styles.button, incStyle]} onPress={inc} />
      <TouchableOpacity activeOpacity={0.1} style={[styles.button, decStyle]} onPress={dec} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 7,
    borderColor: 'rgba(0, 0, 0, 0.55)',
  },
  damageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  damageText: {
    ...typography.heading1,
    fontSize: 88,
    color: OFF_WHITE,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  button: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topButton: {
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: radius.sm,
  },
  bottomButton: {
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: radius.sm,
  },
});
