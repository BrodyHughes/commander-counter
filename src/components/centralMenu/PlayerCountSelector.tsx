import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { PlayerCount } from '@/store/useLifeStore';

interface PlayerCountSelectorProps {
  onSelect: (count: PlayerCount) => void;
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const PlayerCountSelector: React.FC<PlayerCountSelectorProps> = ({ onSelect, onClose }) => {
  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <View style={styles.pickerContainer}>
        <Text style={styles.title}>Select Player Count</Text>
        {[2, 3, 4, 5, 6].map((count) => (
          <TouchableOpacity
            key={count}
            style={styles.selectItem}
            onPress={() => onSelect(count as PlayerCount)}
          >
            <Text style={styles.selectItemText}>{count} Players</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 30,
  },
  pickerContainer: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Comfortaa-Bold',
    color: '#fff',
    marginBottom: 20,
  },
  selectItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  selectItemText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Comfortaa-SemiBold',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 30,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Comfortaa-Bold',
  },
});

export default PlayerCountSelector;
