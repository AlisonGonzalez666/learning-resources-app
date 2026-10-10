import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { createResource, updateResource } from '../../services/api';

export default function ResourceFormScreen({ route, navigation }) {
  const isEditing = route.params?.resource;
  const resourceToEdit = route.params?.resource || {};

  const [titulo, setTitulo] = useState(resourceToEdit.titulo || '');
  const [descripcion, setDescripcion] = useState(resourceToEdit.descripcion || '');
  const [tipo, setTipo] = useState(resourceToEdit.tipo || '');
  const [enlace, setEnlace] = useState(resourceToEdit.enlace || '');
  const [imagen, setImagen] = useState(resourceToEdit.imagen || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Recurso' : 'Nuevo Recurso'
    });
  }, [navigation, isEditing]);

  const handleSave = async () => {
    if (!titulo || !descripcion || !tipo || !enlace) {
      Alert.alert('Error', 'Por favor llena los campos obligatorios (Título, Descripción, Tipo, Enlace).');
      return;
    }

    const resourceData = {
      titulo,
      descripcion,
      tipo,
      enlace,
      imagen
    };

    try {
      setLoading(true);
      if (isEditing) {
        await updateResource(resourceToEdit.id, resourceData);
        Alert.alert('Éxito', 'Recurso actualizado correctamente');
      } else {
        await createResource(resourceData);
        Alert.alert('Éxito', 'Recurso creado correctamente');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar el recurso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Title style={styles.title}>{isEditing ? 'Modificar Recurso' : 'Agregar Nuevo Recurso'}</Title>

        <TextInput
          label="Título *"
          value={titulo}
          onChangeText={setTitulo}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Descripción *"
          value={descripcion}
          onChangeText={setDescripcion}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <TextInput
          label="Tipo (ej. Video, Libro, Artículo) *"
          value={tipo}
          onChangeText={setTipo}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Enlace (URL) *"
          value={enlace}
          onChangeText={setEnlace}
          mode="outlined"
          keyboardType="url"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="URL de Imagen (Opcional)"
          value={imagen}
          onChangeText={setImagen}
          mode="outlined"
          keyboardType="url"
          autoCapitalize="none"
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleSave} 
          loading={loading}
          style={styles.button}
        >
          {isEditing ? 'Guardar Cambios' : 'Crear Recurso'}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
  }
});
