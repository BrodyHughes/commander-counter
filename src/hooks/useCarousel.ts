import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ViewMode } from '@/types/app';
import { useCommanderDamageModeStore } from '@/features/commander-damage/store/useCommanderDamageModeStore';
import { useCallback, useEffect } from 'react';
import { PlayerCarouselManager } from '@/lib/PlayerCarouselManager';

// Sequences define the order of REAL views in the loops
const horizontalSequence = [ViewMode.LIFE, ViewMode.COUNTERS];
const verticalSequence = [ViewMode.LIFE, ViewMode.COMMANDER];

// --- Animation Configuration ---
const springConfig = {
  mass: 0.5,
  stiffness: 200,
  damping: 25,
};

interface UseCarouselParams {
  totalPlayers: number;
  panelW: number;
  panelH: number;
  playerId: number;
  isLastPlayerOddLayout?: boolean;
  isEvenPlayerIndexNumber: boolean;
  onViewChange?: (view: ViewMode) => void;
}

export const useCarousel = ({
  totalPlayers,
  panelW,
  panelH,
  playerId,
  isLastPlayerOddLayout,
  isEvenPlayerIndexNumber,
  onViewChange,
}: UseCarouselParams) => {
  // Indices for the horizontal and vertical tracks.
  // We start at 1, which corresponds to the first "real" panel.
  const hIndex = useSharedValue(1);
  const vIndex = useSharedValue(1);

  const translateX = useSharedValue(-panelW);
  const translateY = useSharedValue(-panelH);

  const { startReceiving, stopReceiving } = useCommanderDamageModeStore();
  const hasCommanderView = totalPlayers > 2;

  const flipFactor = isEvenPlayerIndexNumber ? 1 : -1;
  const swapAxes = totalPlayers === 2 || !!isLastPlayerOddLayout;

  const updateOverlay = useCallback(
    (isCommander: boolean) => {
      if (isCommander) {
        startReceiving(playerId);
      } else {
        stopReceiving();
      }
    },
    [playerId, startReceiving, stopReceiving],
  );

  const reset = useCallback(() => {
    'worklet';
    hIndex.value = 1;
    vIndex.value = 1;
    translateX.value = withSpring(-panelW);
    translateY.value = withSpring(-panelH);
    runOnJS(updateOverlay)(false);
  }, [hIndex, vIndex, panelW, panelH, translateX, translateY, updateOverlay]);

  useEffect(() => {
    PlayerCarouselManager.register(playerId, reset);
    return () => PlayerCarouselManager.unregister(playerId);
  }, [playerId, reset]);

  const panGesture = Gesture.Pan()
    .cancelsTouchesInView(false)
    .onEnd((e) => {
      'worklet';
      const { translationX, translationY } = e;

      const isScreenHorizontal = Math.abs(translationX) > Math.abs(translationY);
      const isUserSwipeHorizontal = swapAxes ? !isScreenHorizontal : isScreenHorizontal;

      if (isUserSwipeHorizontal) {
        const gestureTranslation = swapAxes ? translationY : translationX;
        if (Math.abs(gestureTranslation) < 50 || vIndex.value !== 1) return;

        const direction = (gestureTranslation < 0 ? 1 : -1) * flipFactor;
        const nextHIndex = hIndex.value + direction;

        // --- Trigger overlay update immediately based on destination ---
        const nextView =
          horizontalSequence[
            (nextHIndex - 1 + horizontalSequence.length) % horizontalSequence.length
          ];
        runOnJS(updateOverlay)(nextView === ViewMode.COMMANDER);
        if (onViewChange) runOnJS(onViewChange)(nextView);

        translateX.value = withSpring(-nextHIndex * panelW, springConfig, (isFinished) => {
          if (isFinished) {
            if (nextHIndex === 0) {
              hIndex.value = horizontalSequence.length;
              translateX.value = -hIndex.value * panelW;
            } else if (nextHIndex === horizontalSequence.length + 1) {
              hIndex.value = 1;
              translateX.value = -hIndex.value * panelW;
            } else {
              hIndex.value = nextHIndex;
            }
          }
        });
      } else {
        // Vertical Swipe
        const gestureTranslation = swapAxes ? translationX : translationY;
        if (Math.abs(gestureTranslation) < 50 || hIndex.value !== 1) return;
        if (!hasCommanderView) return;

        const direction = gestureTranslation < 0 ? 1 : -1;
        const nextVIndex = vIndex.value + direction;

        // --- Trigger overlay update immediately based on destination ---
        const nextView =
          verticalSequence[(nextVIndex - 1 + verticalSequence.length) % verticalSequence.length];
        runOnJS(updateOverlay)(nextView === ViewMode.COMMANDER);
        if (onViewChange) runOnJS(onViewChange)(nextView);

        translateY.value = withSpring(-nextVIndex * panelH, springConfig, (isFinished) => {
          if (isFinished) {
            if (nextVIndex === 0) {
              vIndex.value = verticalSequence.length;
              translateY.value = -vIndex.value * panelH;
            } else if (nextVIndex === verticalSequence.length + 1) {
              vIndex.value = 1;
              translateY.value = -vIndex.value * panelH;
            } else {
              vIndex.value = nextVIndex;
            }
          }
        });
      }
    });

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    width: panelW * 4,
    height: panelH * 4,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return { gesture: panGesture, containerAnimatedStyle };
};
