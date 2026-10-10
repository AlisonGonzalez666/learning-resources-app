import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import ResourceCard from '../../components/ResourceCard';
import { useAuth } from '../../context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateResource } from '../../services/api';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  const loadFavorites = async () => {
    try {
      const favsStr = await AsyncStorage.getItem(`favorites_${user.id}`);
      if (favsStr) {
        setFavorites(JSON.parse(favsStr));
      }
    } catch (error) {
      console.error("Error loading favorites", error);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [user.id]);

  const toggleFavorite = async (resource) => {
    try {
      const updatedFavs = favorites.filter(f => f.id !== resource.id);
      setFavorites(updatedFavs);
      await AsyncStorage.setItem(`favorites_${user.id}`, JSON.stringify(updatedFavs));
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar favoritos");
    }
  };

  const handleRate = async (id, rating) => {
    try {
      const resourceToUpdate = favorites.find(r => r.id === id);
      if (!resourceToUpdate) return;
      
      const updatedResource = { ...resourceToUpdate, calificacion: rating };
      
      setFavorites(prev => prev.map(r => r.id === id ? updatedResource : r));
      
      await AsyncStorage.setItem(`favorites_${user.id}`, JSON.stringify(favorites.map(r => r.id === id ? updatedResource : r)));
      await updateResource(id, updatedResource);
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la calificación");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ResourceCard 
            resource={item} 
            role={user?.role} 
            isFavorite={true}
            onToggleFavorite={toggleFavorite}
            onRate={handleRate}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tienes recursos favoritos aún.</Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 16,
  }
});
