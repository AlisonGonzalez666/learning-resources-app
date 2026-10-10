import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Searchbar, FAB, Text, useTheme, Chip, IconButton } from 'react-native-paper';
import { getResources, updateResource } from '../../services/api';
import ResourceCard from '../../components/ResourceCard';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart, faArrowRightFromBracket, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function ResourceListScreen({ navigation }) {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, logout } = useAuth();
  const theme = useTheme();

  const loadData = async () => {
    try {
      const data = await getResources();
      setResources(data);
      setFilteredResources(data);
      
      const favsStr = await AsyncStorage.getItem(`favorites_${user.id}`);
      if (favsStr) {
        setFavorites(JSON.parse(favsStr));
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los recursos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query) {
      setFilteredResources(resources);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = resources.filter(item => 
      (item.titulo && item.titulo.toLowerCase().includes(lower)) ||
      (item.tipo && item.tipo.toLowerCase().includes(lower)) ||
      (item.id && item.id.toString() === query)
    );
    setFilteredResources(filtered);
  };

  const toggleFavorite = async (resource) => {
    let updatedFavs;
    if (favorites.find(f => f.id === resource.id)) {
      updatedFavs = favorites.filter(f => f.id !== resource.id);
    } else {
      updatedFavs = [...favorites, resource];
    }
    setFavorites(updatedFavs);
    await AsyncStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavs));
  };

  const handleRate = async (id, rating) => {
    try {
      const resourceToUpdate = resources.find(r => r.id === id);
      if (!resourceToUpdate) return;
      
      const updatedResource = { ...resourceToUpdate, calificacion: rating };
      
      // Update locally immediately for better UX
      setResources(prev => prev.map(r => r.id === id ? updatedResource : r));
      setFilteredResources(prev => prev.map(r => r.id === id ? updatedResource : r));

      // Update in API
      await updateResource(id, updatedResource);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la calificación");
      loadData(); // Revert on error
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <IconButton
            icon={({ size }) => <FontAwesomeIcon icon={faHeart} size={size} color="#e91e63" />}
            size={24}
            onPress={() => navigation.navigate('Favorites')}
          />
          <IconButton
            icon={({ size }) => <FontAwesomeIcon icon={faArrowRightFromBracket} size={size} color="#e53935" />}
            size={24}
            onPress={logout}
          />
        </View>
      ),
    });
  }, [navigation, logout]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar recursos..."
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
        icon={({ size, color }) => <FontAwesomeIcon icon={faMagnifyingGlass} size={size} color={color} />}
      />

      {loading && !refreshing ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={filteredResources}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ResourceCard 
              resource={item} 
              role={user?.role} 
              isFavorite={!!favorites.find(f => f.id === item.id)}
              onToggleFavorite={toggleFavorite}
              onRate={handleRate}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron recursos.</Text>
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 10,
    elevation: 2,
    backgroundColor: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  logoutBtn: {
    marginRight: 10,
    backgroundColor: '#e53935',
    elevation: 0,
  },
  favBtn: {
    marginRight: 10,
    backgroundColor: '#e91e63',
    elevation: 0,
  }
});
