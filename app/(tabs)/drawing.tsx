
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { RoofDrawingTool } from '@/components/RoofDrawingTool';
import { RoofDiagram } from '@/types/inspection';
import { useInspection } from '@/contexts/InspectionContext';

export default function DrawingScreen() {
  const { roofDiagram, setRoofDiagram } = useInspection();

  const handleDiagramComplete = (diagram: RoofDiagram) => {
    console.log('Roof diagram saved:', diagram);
    setRoofDiagram(diagram);
    Alert.alert(
      'Diagram Saved',
      `Roof diagram with ${diagram.facets.length} facets and ${diagram.totalArea.toFixed(0)} sq ft has been saved. It will be included in your PDF report.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <RoofDrawingTool 
          onDiagramComplete={handleDiagramComplete}
          initialDiagram={roofDiagram || undefined}
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
