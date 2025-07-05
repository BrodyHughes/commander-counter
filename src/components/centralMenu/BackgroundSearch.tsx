import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  Linking,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useLifeStore } from '@/store/useLifeStore';
import { usePlayerBackgroundStore } from '@/store/usePlayerBackgroundStore';
import { fetchCardByName } from '@/helpers/scryfallFetch';

interface BackgroundSearchProps {
  onClose: () => void;
}

const AnimatedView = Animated.createAnimatedComponent(View);

const BackgroundSearch: React.FC<BackgroundSearchProps> = ({ onClose }) => {
  const [cardName, setCardName] = useState('');
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [fetchedImageUrl, setFetchedImageUrl] = useState<string | null>(null);

  const players = useLifeStore((state) => state.players);
  const setPlayerBackground = usePlayerBackgroundStore((state) => state.setBackground);
  const removePlayerBackground = usePlayerBackgroundStore((state) => state.removeBackground);
  const backgrounds = usePlayerBackgroundStore((state) => state.backgrounds);

  const handleSearch = async () => {
    if (!cardName) return;
    const image = await fetchCardByName(cardName);
    if (!image) {
      Alert.alert('Card not found', 'Please try another card name.');
    } else {
      setFetchedImageUrl(image);
    }
  };

  const handleRemoveBackground = () => {
    if (selectedPlayerId === null) return;
    removePlayerBackground(selectedPlayerId);
    // Reset state and close
    setCardName('');
    setSelectedPlayerId(null);
    setFetchedImageUrl(null);
    onClose();
  };

  const handleSetBackground = () => {
    if (!fetchedImageUrl || selectedPlayerId === null) return;
    setPlayerBackground(selectedPlayerId, fetchedImageUrl);
    // Reset state and close
    setCardName('');
    setSelectedPlayerId(null);
    setFetchedImageUrl(null);
    onClose();
  };

  const handleLinkToScryfall = () => {
    Linking.openURL('https://scryfall.com');
  };

  // Determine the number of columns for the grid layout.
  // This logic mirrors the main app layout for consistency.
  const numColumns = players.length > 2 ? 2 : players.length;
  const hasBackground = selectedPlayerId !== null && backgrounds[selectedPlayerId];

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      {selectedPlayerId === null ? (
        // Player Picker
        <View style={styles.pickerContainer}>
          <Text style={styles.title}>Select a Player</Text>
          <View style={[styles.gridContainer, { maxWidth: numColumns * 150 }]}>
            {players.map((player, index) => (
              <TouchableOpacity
                key={player.id}
                style={[styles.selectItem]}
                onPress={() => setSelectedPlayerId(player.id)}
              >
                <Text style={styles.selectItemText}>Player {index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        // Search Input & Image Preview
        <>
          <TextInput
            placeholder={`Type in a card name for Player ${
              players.findIndex((p) => p.id === selectedPlayerId) + 1
            }`}
            placeholderTextColor="#999"
            value={cardName}
            onChangeText={setCardName}
            onSubmitEditing={handleSearch}
            style={styles.searchInput}
            returnKeyType="search"
            autoFocus
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
            {hasBackground && (
              <TouchableOpacity
                style={[styles.searchButton, { marginLeft: 10 }]}
                onPress={handleRemoveBackground}
              >
                <Text style={styles.searchButtonText}>Remove Background</Text>
              </TouchableOpacity>
            )}
          </View>

          {fetchedImageUrl && (
            <TouchableOpacity style={styles.imagePreviewContainer} onPress={handleSetBackground}>
              <Image source={{ uri: fetchedImageUrl }} style={styles.imagePreview} />
              <Text style={styles.imagePreviewText}>Tap image to confirm</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          setSelectedPlayerId(null);
          setFetchedImageUrl(null); // Also clear image on close
          onClose();
        }}
      >
        <Text style={styles.closeButtonText}>×</Text>
      </TouchableOpacity>
      <View style={styles.scryfallCredit}>
        <Text style={styles.scryfallCreditText}>
          Search powered by{' '}
          <Text style={styles.scryfallCreditTextLink} onPress={handleLinkToScryfall}>
            Scryfall
          </Text>
        </Text>
      </View>
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
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Comfortaa-Bold',
    color: '#fff',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectItem: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    margin: 5,
    height: 60,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectItemText: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Comfortaa-SemiBold',
  },
  searchInput: {
    height: 50,
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Comfortaa-Bold',
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
  imagePreviewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 220,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  imagePreviewText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Comfortaa-Bold',
    textAlign: 'center',
  },
  scryfallCredit: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  scryfallCreditText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 400,
  },
  scryfallCreditTextLink: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 400,
    textDecorationLine: 'underline',
  },
});

export default BackgroundSearch;
