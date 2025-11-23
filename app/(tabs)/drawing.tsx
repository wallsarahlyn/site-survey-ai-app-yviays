
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { RoofDrawingTool } from '@/components/RoofDrawingTool';
import { RoofDiagram } from '@/types/inspection';

export default function DrawingScreen() {
  const [savedDiagram, setSavedDiagram] = useState<RoofDiagram | null>(null);

  const handleDiagramComplete = (diagram: RoofDiagram) => {
    setSavedDiagram(diagram);
    Alert.alert(
      'Diagram Saved',
      `Roof diagram saved successfully!\n\nTotal Area: ${diagram.totalArea.toFixed(2)} sq ft\nFacets: ${diagram.facets.length}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <RoofDrawingTool 
          onDiagramComplete={handleDiagramComplete}
          initialDiagram={savedDiagram || undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
