
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useInspection } from '@/contexts/InspectionContext';
import { RoofDrawingTool } from '@/components/RoofDrawingTool';
import { RoofDiagram } from '@/types/inspection';
import { useRouter } from 'expo-router';

export default function DrawingScreen() {
  const { colors } = useThemeContext();
  const { roofDiagram, setRoofDiagram, propertyAddress, setPropertyAddress } = useInspection();
  const router = useRouter();

  const handleDiagramComplete = (diagram: RoofDiagram, address: string) => {
    console.log('Roof diagram completed:', diagram);
    console.log('Property address:', address);
    setRoofDiagram(diagram);
    setPropertyAddress(address);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Platform.OS === 'android' ? 48 : 0 }]}>
      <View style={styles.content}>
        <RoofDrawingTool 
          onDiagramComplete={handleDiagramComplete}
          initialDiagram={roofDiagram || undefined}
          initialAddress={propertyAddress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
