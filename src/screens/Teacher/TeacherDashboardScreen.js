import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { Searchbar, FAB, Chip, Text, useTheme, IconButton } from 'react-native-paper';
import { getResources, deleteResource } from '../../services/api';
import ResourceCard from '../../components/ResourceCard';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRightFromBracket, faMagnifyingGlass, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function TeacherDashboardScreen({ navigation }) {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  
  const { user, logout } = useAuth();
  const theme = useTheme();

  const loadResources = async () => {
    try {
      const data = await getResources();
      setResources(data);
      applyFilters(data, searchQuery, selectedType);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los recursos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadResources();
  };

  const applyFilters = (data, search, type) => {
    let filtered = data;
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(item => 
        (item.titulo && item.titulo.toLowerCase().includes(lowerSearch)) ||
        (item.tipo && item.tipo.toLowerCase().includes(lowerSearch)) ||
        (item.id && item.id.toString() === search)
      );
    }
    
    if (type) {
      filtered = filtered.filter(item => item.tipo && item.tipo.toLowerCase() === type.toLowerCase());
    }
    
    setFilteredResources(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(resources, query, selectedType);
  };

  const toggleTypeFilter = (type) => {
    const newType = selectedType === type ? '' : type;
    setSelectedType(newType);
    applyFilters(resources, searchQuery, newType);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que deseas eliminar este recurso?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await deleteResource(id);
              Alert.alert("Éxito", "Recurso eliminado correctamente");
              loadResources();
            } catch (error) {
              Alert.alert("Error", "No se pudo eliminar el recurso");
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon={({ size }) => <FontAwesomeIcon icon={faArrowRightFromBracket} size={size} color="#e53935" />}
          size={24}
          onPress={logout}
        />
      ),
    });
  }, [navigation, logout]);

  // Extract unique types for the filter chips
  const types = [...new Set(resources.map(r => r.tipo).filter(Boolean))];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar por ID, título o tipo..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          icon={({ size, color }) => <FontAwesomeIcon icon={faMagnifyingGlass} size={size} color={color} />}
        />
        
        <View style={styles.chipsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={types}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Chip
                selected={selectedType === item}
                onPress={() => toggleTypeFilter(item)}
                style={styles.chip}
              >
                {item}
              </Chip>
            )}
          />
        </View>
      </View>

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
              onEdit={() => navigation.navigate('ResourceForm', { resource: item })}
              onDelete={handleDelete}
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

      <FAB
        icon={({ size, color }) => <FontAwesomeIcon icon={faPlus} size={size} color={color} />}
        style={styles.fab}
        onPress={() => navigation.navigate('ResourceForm')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: 'white',
    elevation: 2,
  },
  searchBar: {
    marginBottom: 10,
    elevation: 0,
    backgroundColor: '#f0f0f0',
  },
  chipsContainer: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 80,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
  logoutBtn: {
    marginRight: 10,
    backgroundColor: '#e53935',
    elevation: 0,
  }
});
