import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
  SafeAreaView,
  Linking,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useRulingsStore } from '@/store/useRulingsStore';
import { fetchRulingsByName } from '@/helpers/scryfallFetch';

const AnimatedView = Animated.createAnimatedComponent(View);

interface Ruling {
  object: string;
  oracle_id: string;
  source: string;
  published_at: string;
  comment: string;
}

const RulingsSearch: React.FC = () => {
  const { isSearchVisible, setIsSearchVisible } = useRulingsStore();
  const [cardName, setCardName] = useState('');
  const [rulings, setRulings] = useState<Ruling[] | null>(null);
  const [searchedCard, setSearchedCard] = useState('');

  const handleSearch = async () => {
    if (!cardName) return;
    const result = await fetchRulingsByName(cardName);
    if (result === undefined) {
      Alert.alert('Card not found', 'Please try another card name.');
      setRulings(null);
    } else {
      setRulings(result.rulings);
      setSearchedCard(result.cardName);
    }
  };

  const handleClose = () => {
    setIsSearchVisible(false);
    setCardName('');
    setRulings(null);
    setSearchedCard('');
  };

  const handleLinkToScryfall = () => {
    Linking.openURL('https://scryfall.com');
  };

  if (!isSearchVisible) {
    return null;
  }

  return (
    <AnimatedView style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TextInput
            placeholder="Search Card Rulings"
            placeholderTextColor="#999"
            value={cardName}
            onChangeText={setCardName}
            onSubmitEditing={handleSearch}
            style={styles.searchInput}
            returnKeyType="search"
            autoFocus
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {rulings && (
          <View style={styles.listContainer}>
            <Text style={styles.title}>
              Rulings for <Text style={styles.cardName}>{searchedCard}</Text>
            </Text>
            <FlatList
              data={rulings}
              keyExtractor={(item) => item.published_at + item.comment}
              renderItem={({ item }) => (
                <View style={styles.rulingItem}>
                  <Text style={styles.rulingDate}>{item.published_at}</Text>
                  <Text style={styles.rulingText}>{item.comment}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No rulings found.</Text>}
            />
          </View>
        )}

        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
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
      </SafeAreaView>
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, width: '100%' },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 40,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    top: 20,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#000',
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardName: {
    fontStyle: 'italic',
  },
  rulingItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  rulingDate: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 5,
  },
  rulingText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  emptyText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 32,
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

export default RulingsSearch;
