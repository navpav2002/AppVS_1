import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const GlassButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.glassButton}>
      <Text style={styles.glassButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Weniger transparent
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3, // Etwas stärkere Schatten
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)', // Stärkere Umrandung
  },
  glassButtonText: {
    
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent', // Sicherstellen, dass der Hintergrund des Textes transparent ist
    padding: 0, // Keine zusätzliche Polsterung
    margin: 0, // Kein zusätzlicher Rand
    borderWidth: 0, // Keine Umrandung
  },
});

export default GlassButton;
