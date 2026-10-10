//mostrando recursos educativos

import React from 'react';
import { View, StyleSheet, Image, Linking } from 'react-native';
import { Card, Title, Paragraph, Button, Text, IconButton, useTheme } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHeart as faHeartSolid, faStar as faStarSolid, faArrowUpRightFromSquare, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

export default function ResourceCard({ 
  resource, 
  role, 
  onEdit, 
  onDelete, 
  onToggleFavorite, 
  isFavorite,
  onRate 
}) {
  const theme = useTheme();
  
  const openLink = () => {
    if (resource.enlace) {
      let url = resource.enlace;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
  };

  return (
    <Card style={styles.card}>
      {resource.imagen ? (
        <Card.Cover source={{ uri: resource.imagen }} style={styles.cover} />
      ) : (
        <View style={styles.placeholderCover}>
          <Text style={styles.placeholderText}>Sin imagen</Text>
        </View>
      )}
      
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Title style={styles.title} numberOfLines={2}>{resource.titulo}</Title>
            <Text style={styles.typeTag}>{resource.tipo}</Text>
          </View>
          {role === 'Estudiante' && (
            <IconButton
              icon={({ size, color }) => <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} size={size} color={isFavorite ? 'red' : color} />}
              size={24}
              onPress={() => onToggleFavorite(resource)}
            />
          )}
        </View>
        <Paragraph numberOfLines={3} style={styles.description}>
          {resource.descripcion}
        </Paragraph>
        
        {/* Simple Rating Display Simulation */}
        {role === 'Estudiante' && (
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                icon={({ size, color }) => <FontAwesomeIcon icon={resource.calificacion >= star ? faStarSolid : faStarRegular} size={size} color={resource.calificacion >= star ? '#FFD700' : color} />}
                size={20}
                style={styles.starIcon}
                onPress={() => onRate && onRate(resource.id, resource.calificacion === star ? 0 : star)}
              />
            ))}
            <Text style={styles.ratingText}>
              {resource.calificacion ? `${resource.calificacion} / 5` : 'Sin calificar'}
            </Text>
          </View>
        )}
      </Card.Content>

      <Card.Actions style={styles.actions}>
        <Button mode="text" onPress={openLink} icon={({ size, color }) => <FontAwesomeIcon icon={faArrowUpRightFromSquare} size={size} color={color} />}>
          Abrir Enlace
        </Button>
        <View style={styles.rightActions}>
          {role === 'Docente' && (
            <>
              <IconButton icon={({ size, color }) => <FontAwesomeIcon icon={faPen} size={size} color={color} />} size={20} onPress={() => onEdit(resource)} />
              <IconButton icon={({ size, color }) => <FontAwesomeIcon icon={faTrash} size={size} color="red" />} size={20} onPress={() => onDelete(resource.id)} />
            </>
          )}
        </View>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  cover: {
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderCover: {
    height: 150,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeholderText: {
    color: '#757575',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  typeTag: {
    fontSize: 12,
    color: '#6200ee',
    backgroundColor: '#e6e6fa',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  description: {
    color: '#555',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  starIcon: {
    margin: 0,
    padding: 0,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#666',
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  rightActions: {
    flexDirection: 'row',
  },
});
