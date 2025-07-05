import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ViewMode } from './PlayerPanel';
import CountersMenu from '@/components/countersMenu/CountersMenu';

interface Props {
  menuVisible: boolean;
  menuType: ViewMode;
  index: number;
}

export default function PlayerPanelMenu({ menuVisible, menuType, index }: Props) {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);

  if (!menuVisible) {
    return null;
  }

  return (
    <View
      style={styles.overlay}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (!dims || dims.w !== width || dims.h !== height) {
          setDims({ w: width, h: height });
        }
      }}
    >
      {menuType === ViewMode.COUNTERS && (
        <View
          style={[
            styles.content,
            dims && {
              width: dims.h,
              height: dims.w,
              transform: [{ rotate: '90deg' }],
            },
          ]}
        >
          <CountersMenu defenderId={index} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
