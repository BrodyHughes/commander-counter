import React, { useEffect } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeOut,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { typography, radius } from '@/styles/global';
import ConfettiParticle from './ConfettiParticle';
import { useTurnStore } from '@/store/useTurnStore';

const confettiCount = 70;

interface Props {
  panelW: number;
  panelH: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TurnWinnerOverlay({ panelW, panelH }: Props) {
  const reset = useTurnStore((s) => s.reset);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      100,
      withSpring(1, {
        damping: 12,
        stiffness: 100,
      }),
    );
    opacity.value = withDelay(100, withSpring(1));
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: '90deg' }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable onPress={reset} style={styles.container} exiting={FadeOut.duration(150)}>
      <BlurView style={StyleSheet.absoluteFill} blurType="dark" blurAmount={10} />
      <Animated.View style={[styles.rotatedContainer, animatedStyle]}>
        {Array.from({ length: confettiCount }).map((_, i) => (
          <ConfettiParticle key={i} index={i} width={panelH} height={panelW} />
        ))}
        <View style={[styles.textWrapper, { width: panelH }]}>
          <Text style={styles.text}>You go first!</Text>
        </View>
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 7,
    borderColor: 'rgba(0, 0, 0, 0.55)',
  },
  rotatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  textWrapper: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...typography.heading1,
    fontSize: 40,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    padding: 20,
  },
});
