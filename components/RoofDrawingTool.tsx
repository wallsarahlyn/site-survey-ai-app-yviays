
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, Dimensions } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '@/styles/commonStyles';
import { RoofFacet, RoofDiagram } from '@/types/inspection';
import { IconSymbol } from './IconSymbol';

interface RoofDrawingToolProps {
  onDiagramComplete: (diagram: RoofDiagram) => void;
  initialDiagram?: RoofDiagram;
}

const CANVAS_WIDTH = Dimensions.get('window').width - 32;
const CANVAS_HEIGHT = 400;
const PIXELS_PER_FOOT = 10; // Scale: 10 pixels = 1 foot

export function RoofDrawingTool({ onDiagramComplete, initialDiagram }: RoofDrawingToolProps) {
  const [facets, setFacets] = useState<RoofFacet[]>(initialDiagram?.facets || []);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedFacetId, setSelectedFacetId] = useState<string | null>(null);
  const [facetLabel, setFacetLabel] = useState('');
  const [facetPitch, setFacetPitch] = useState('6');

  const calculateArea = (points: { x: number; y: number }[]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    
    const pixelArea = Math.abs(area / 2);
    const squareFeet = pixelArea / (PIXELS_PER_FOOT * PIXELS_PER_FOOT);
    return squareFeet;
  };

  const calculateMeasurements = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return { width: 0, height: 0, perimeter: 0 };

    let minX = points[0].x, maxX = points[0].x;
    let minY = points[0].y, maxY = points[0].y;
    let perimeter = 0;

    for (let i = 0; i < points.length; i++) {
      minX = Math.min(minX, points[i].x);
      maxX = Math.max(maxX, points[i].x);
      minY = Math.min(minY, points[i].y);
      maxY = Math.max(maxY, points[i].y);

      const j = (i + 1) % points.length;
      const dx = points[j].x - points[i].x;
      const dy = points[j].y - points[i].y;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }

    return {
      width: (maxX - minX) / PIXELS_PER_FOOT,
      height: (maxY - minY) / PIXELS_PER_FOOT,
      perimeter: perimeter / PIXELS_PER_FOOT,
    };
  };

  const handleCanvasPress = (event: any) => {
    if (!isDrawing) return;

    const { locationX, locationY } = event.nativeEvent;
    const newPoint = { x: locationX, y: locationY };
    setCurrentPoints([...currentPoints, newPoint]);
  };

  const startDrawing = () => {
    setIsDrawing(true);
    setCurrentPoints([]);
    setSelectedFacetId(null);
  };

  const completeFacet = () => {
    if (currentPoints.length < 3) {
      Alert.alert('Invalid Shape', 'Please add at least 3 points to create a facet.');
      return;
    }

    const area = calculateArea(currentPoints);
    const measurements = calculateMeasurements(currentPoints);
    const pitch = parseFloat(facetPitch) || 6;

    const newFacet: RoofFacet = {
      id: `facet-${Date.now()}`,
      points: currentPoints,
      pitch,
      area,
      label: facetLabel || `Facet ${facets.length + 1}`,
      measurements,
    };

    setFacets([...facets, newFacet]);
    setCurrentPoints([]);
    setIsDrawing(false);
    setFacetLabel('');
    setFacetPitch('6');
  };

  const cancelDrawing = () => {
    setCurrentPoints([]);
    setIsDrawing(false);
  };

  const deleteFacet = (id: string) => {
    setFacets(facets.filter(f => f.id !== id));
    if (selectedFacetId === id) {
      setSelectedFacetId(null);
    }
  };

  const clearAll = () => {
    Alert.alert(
      'Clear All',
      'Are you sure you want to clear all facets?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => {
            setFacets([]);
            setCurrentPoints([]);
            setIsDrawing(false);
            setSelectedFacetId(null);
          }
        },
      ]
    );
  };

  const saveDiagram = () => {
    if (facets.length === 0) {
      Alert.alert('No Facets', 'Please draw at least one roof facet before saving.');
      return;
    }

    const totalArea = facets.reduce((sum, facet) => sum + facet.area, 0);

    const diagram: RoofDiagram = {
      id: initialDiagram?.id || `diagram-${Date.now()}`,
      facets,
      totalArea,
      createdAt: initialDiagram?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onDiagramComplete(diagram);
  };

  const totalArea = facets.reduce((sum, facet) => sum + facet.area, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Roof Drawing Tool</Text>
        <Text style={styles.subtitle}>
          Tap on the canvas to place points and create roof facets
        </Text>
      </View>

      <View style={styles.canvasContainer}>
        <View style={styles.canvas} onTouchEnd={handleCanvasPress}>
          <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
            {/* Grid lines */}
            {Array.from({ length: Math.floor(CANVAS_WIDTH / 50) }).map((_, i) => (
              <Line
                key={`v-${i}`}
                x1={i * 50}
                y1={0}
                x2={i * 50}
                y2={CANVAS_HEIGHT}
                stroke={colors.border}
                strokeWidth="1"
                opacity={0.3}
              />
            ))}
            {Array.from({ length: Math.floor(CANVAS_HEIGHT / 50) }).map((_, i) => (
              <Line
                key={`h-${i}`}
                x1={0}
                y1={i * 50}
                x2={CANVAS_WIDTH}
                y2={i * 50}
                stroke={colors.border}
                strokeWidth="1"
                opacity={0.3}
              />
            ))}

            {/* Completed facets */}
            {facets.map((facet) => {
              const points = facet.points.map(p => `${p.x},${p.y}`).join(' ');
              const isSelected = facet.id === selectedFacetId;
              return (
                <React.Fragment key={facet.id}>
                  <Polygon
                    points={points}
                    fill={isSelected ? colors.highlight : colors.accent}
                    opacity={0.5}
                    stroke={colors.primary}
                    strokeWidth="2"
                    onPress={() => setSelectedFacetId(facet.id)}
                  />
                  {facet.points.map((point, idx) => (
                    <Circle
                      key={`${facet.id}-${idx}`}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill={colors.primary}
                    />
                  ))}
                </React.Fragment>
              );
            })}

            {/* Current drawing */}
            {currentPoints.length > 0 && (
              <>
                {currentPoints.length > 2 && (
                  <Polygon
                    points={currentPoints.map(p => `${p.x},${p.y}`).join(' ')}
                    fill={colors.secondary}
                    opacity={0.3}
                    stroke={colors.secondary}
                    strokeWidth="2"
                  />
                )}
                {currentPoints.map((point, idx) => (
                  <React.Fragment key={idx}>
                    <Circle cx={point.x} cy={point.y} r="5" fill={colors.secondary} />
                    {idx > 0 && (
                      <Line
                        x1={currentPoints[idx - 1].x}
                        y1={currentPoints[idx - 1].y}
                        x2={point.x}
                        y2={point.y}
                        stroke={colors.secondary}
                        strokeWidth="2"
                      />
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </Svg>
        </View>

        <View style={styles.legend}>
          <Text style={styles.legendText}>Scale: 1 grid square = 5 feet</Text>
        </View>
      </View>

      {isDrawing && (
        <View style={styles.drawingControls}>
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Label</Text>
              <TextInput
                style={styles.input}
                value={facetLabel}
                onChangeText={setFacetLabel}
                placeholder="e.g., North Face"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pitch (X:12)</Text>
              <TextInput
                style={styles.input}
                value={facetPitch}
                onChangeText={setFacetPitch}
                placeholder="6"
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <Text style={styles.pointCount}>{currentPoints.length} points placed</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.successButton]} onPress={completeFacet}>
              <Text style={styles.buttonText}>Complete Facet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={cancelDrawing}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isDrawing && (
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={startDrawing}>
            <IconSymbol ios_icon_name="plus.circle.fill" android_material_icon_name="add_circle" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Draw New Facet</Text>
          </TouchableOpacity>

          {facets.length > 0 && (
            <>
              <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={clearAll}>
                <Text style={styles.buttonText}>Clear All</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={saveDiagram}>
                <IconSymbol ios_icon_name="checkmark.circle.fill" android_material_icon_name="check_circle" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Save Diagram</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {facets.length > 0 && (
        <View style={styles.facetsList}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Roof Area</Text>
            <Text style={styles.summaryValue}>{totalArea.toFixed(2)} sq ft</Text>
          </View>

          <Text style={styles.facetsTitle}>Facets ({facets.length})</Text>
          {facets.map((facet) => (
            <View key={facet.id} style={[styles.facetCard, selectedFacetId === facet.id && styles.selectedFacet]}>
              <View style={styles.facetHeader}>
                <Text style={styles.facetLabel}>{facet.label}</Text>
                <TouchableOpacity onPress={() => deleteFacet(facet.id)}>
                  <IconSymbol ios_icon_name="trash.fill" android_material_icon_name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
              <Text style={styles.facetDetail}>Area: {facet.area.toFixed(2)} sq ft</Text>
              <Text style={styles.facetDetail}>Pitch: {facet.pitch}:12</Text>
              <Text style={styles.facetDetail}>
                Dimensions: {facet.measurements.width.toFixed(1)}' × {facet.measurements.height.toFixed(1)}'
              </Text>
              <Text style={styles.facetDetail}>Perimeter: {facet.measurements.perimeter.toFixed(1)}'</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  canvasContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  legend: {
    marginTop: 8,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  drawingControls: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pointCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  controls: {
    gap: 12,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  successButton: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.textSecondary,
    flex: 1,
  },
  warningButton: {
    backgroundColor: colors.error,
  },
  saveButton: {
    backgroundColor: colors.secondary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  facetsList: {
    marginBottom: 100,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  facetsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  facetCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedFacet: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  facetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  facetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  facetDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
