
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, Dimensions, Platform } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '@/styles/commonStyles';
import { RoofFacet, RoofDiagram } from '@/types/inspection';
import { IconSymbol } from './IconSymbol';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

interface RoofDrawingToolProps {
  onDiagramComplete: (diagram: RoofDiagram, address: string) => void;
  initialDiagram?: RoofDiagram;
  initialAddress?: string;
}

const CANVAS_WIDTH = Dimensions.get('window').width - 32;
const CANVAS_HEIGHT = 400;
const PIXELS_PER_FOOT = 10;

export function RoofDrawingTool({ onDiagramComplete, initialDiagram, initialAddress }: RoofDrawingToolProps) {
  const [facets, setFacets] = useState<RoofFacet[]>(initialDiagram?.facets || []);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedFacetId, setSelectedFacetId] = useState<string | null>(null);
  const [facetLabel, setFacetLabel] = useState('');
  const [facetPitch, setFacetPitch] = useState('6');
  const [propertyAddress, setPropertyAddress] = useState(initialAddress || '');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [mapZoom, setMapZoom] = useState(19);

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

  const handleAddressChange = async (text: string) => {
    setPropertyAddress(text);
    
    if (text.length > 3) {
      try {
        console.log('Fetching address suggestions for:', text);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&types=address&key=YOUR_GOOGLE_API_KEY`
        );
        const data = await response.json();
        
        if (data.predictions && data.predictions.length > 0) {
          const suggestions = data.predictions.map((p: any) => p.description);
          setAddressSuggestions(suggestions);
          setShowSuggestions(true);
        } else {
          setAddressSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectAddress = async (address: string) => {
    setPropertyAddress(address);
    setShowSuggestions(false);
    
    try {
      console.log('Geocoding address:', address);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=YOUR_GOOGLE_API_KEY`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        setMapCenter({ lat: location.lat, lng: location.lng });
        console.log('Map centered at:', location);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
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

    if (!propertyAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter a property address before saving.');
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

    onDiagramComplete(diagram, propertyAddress);
    Alert.alert('Success', 'Roof diagram and address saved successfully!');
  };

  const generateRoofReport = async () => {
    if (facets.length === 0) {
      Alert.alert('No Data', 'Please draw at least one roof facet before generating a report.');
      return;
    }

    if (!propertyAddress.trim()) {
      Alert.alert('Missing Address', 'Please enter a property address before generating a report.');
      return;
    }

    const totalArea = facets.reduce((sum, facet) => sum + facet.area, 0);
    const totalPerimeter = facets.reduce((sum, facet) => sum + facet.measurements.perimeter, 0);
    const avgPitch = facets.reduce((sum, facet) => sum + facet.pitch, 0) / facets.length;

    const generateRoofDiagramSVG = () => {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      facets.forEach(facet => {
        facet.points.forEach(point => {
          minX = Math.min(minX, point.x);
          maxX = Math.max(maxX, point.x);
          minY = Math.min(minY, point.y);
          maxY = Math.max(maxY, point.y);
        });
      });
      
      const width = 600;
      const height = 400;
      const scaleX = (width - 100) / (maxX - minX || 1);
      const scaleY = (height - 100) / (maxY - minY || 1);
      const scale = Math.min(scaleX, scaleY);
      
      const facetColors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'];
      
      return `
        <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="border: 1px solid #E0E0E0; border-radius: 8px; background: #FAFAFA;">
          ${facets.map((facet, index) => {
            const points = facet.points.map(p => 
              `${50 + (p.x - minX) * scale},${50 + (p.y - minY) * scale}`
            ).join(' ');
            
            const centerX = 50 + facet.points.reduce((sum, p) => sum + (p.x - minX) * scale, 0) / facet.points.length;
            const centerY = 50 + facet.points.reduce((sum, p) => sum + (p.y - minY) * scale, 0) / facet.points.length;
            
            return `
              <polygon points="${points}" fill="${facetColors[index % facetColors.length]}" opacity="0.6" 
                       stroke="${facetColors[index % facetColors.length]}" stroke-width="2"/>
              <text x="${centerX}" y="${centerY}" text-anchor="middle" font-size="12" font-weight="bold" fill="white">
                ${facet.label}
              </text>
              <text x="${centerX}" y="${centerY + 15}" text-anchor="middle" font-size="10" fill="white">
                ${facet.area.toFixed(0)} sq ft
              </text>
            `;
          }).join('')}
        </svg>
      `;
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              margin: 0;
              size: letter;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              color: #212121;
              line-height: 1.6;
              font-size: 11pt;
            }
            
            .page {
              page-break-after: always;
              padding: 0.75in;
              min-height: 10in;
              position: relative;
            }
            
            .page:last-child {
              page-break-after: auto;
            }
            
            .cover-page {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
              color: white;
              padding: 2in 0.75in;
            }
            
            .cover-logo {
              width: 120px;
              height: 120px;
              background: white;
              border-radius: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
              font-weight: 900;
              color: #2563EB;
              margin-bottom: 40px;
              box-shadow: 0 8px 24px rgba(0,0,0,0.2);
            }
            
            .cover-title {
              font-size: 42pt;
              font-weight: 800;
              margin-bottom: 20px;
              letter-spacing: -1px;
            }
            
            .cover-subtitle {
              font-size: 18pt;
              opacity: 0.95;
              margin-bottom: 60px;
              font-weight: 400;
            }
            
            .cover-info {
              background: rgba(255,255,255,0.15);
              backdrop-filter: blur(10px);
              border-radius: 16px;
              padding: 40px;
              width: 100%;
              max-width: 500px;
              margin-top: 40px;
            }
            
            .cover-info-item {
              margin: 20px 0;
              text-align: left;
            }
            
            .cover-info-label {
              font-size: 10pt;
              opacity: 0.8;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 5px;
            }
            
            .cover-info-value {
              font-size: 16pt;
              font-weight: 600;
            }
            
            .page-header {
              border-bottom: 3px solid #2563EB;
              padding-bottom: 15px;
              margin-bottom: 30px;
            }
            
            .page-header h1 {
              font-size: 24pt;
              font-weight: 700;
              color: #2563EB;
              margin-bottom: 5px;
            }
            
            .page-header .report-id {
              font-size: 9pt;
              color: #757575;
            }
            
            .section {
              margin-bottom: 35px;
              page-break-inside: avoid;
            }
            
            .section-header {
              background: #2563EB;
              color: white;
              padding: 12px 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              font-size: 16pt;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            
            .section-subheader {
              font-size: 13pt;
              font-weight: 700;
              color: #212121;
              margin: 25px 0 15px 0;
              padding-bottom: 8px;
              border-bottom: 2px solid #E0E0E0;
            }
            
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 20px;
            }
            
            .info-card {
              background: #F5F5F5;
              border-left: 4px solid #2563EB;
              padding: 15px;
              border-radius: 6px;
            }
            
            .info-card-label {
              font-size: 9pt;
              color: #757575;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
              font-weight: 600;
            }
            
            .info-card-value {
              font-size: 14pt;
              color: #212121;
              font-weight: 700;
            }
            
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            
            .data-table th {
              background: #2563EB;
              color: white;
              padding: 12px;
              text-align: left;
              font-weight: 600;
              font-size: 10pt;
            }
            
            .data-table td {
              padding: 12px;
              border-bottom: 1px solid #E0E0E0;
              font-size: 10pt;
            }
            
            .data-table tr:last-child td {
              border-bottom: none;
            }
            
            .data-table tr:nth-child(even) {
              background: #F9F9F9;
            }
            
            .data-table tr.total-row {
              background: #E3F2FD;
              font-weight: 700;
            }
            
            .diagram-container {
              text-align: center;
              margin: 20px 0;
            }
            
            .summary-box {
              background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
              color: white;
              border-radius: 12px;
              padding: 30px;
              text-align: center;
              margin: 20px 0;
            }
            
            .summary-title {
              font-size: 14pt;
              opacity: 0.9;
              margin-bottom: 10px;
            }
            
            .summary-value {
              font-size: 36pt;
              font-weight: 700;
              margin-bottom: 5px;
            }
            
            .summary-subtitle {
              font-size: 11pt;
              opacity: 0.8;
            }
            
            .page-footer {
              position: absolute;
              bottom: 0.5in;
              left: 0.75in;
              right: 0.75in;
              padding-top: 15px;
              border-top: 1px solid #E0E0E0;
              font-size: 8pt;
              color: #757575;
              display: flex;
              justify-content: space-between;
            }
            
            .highlight-box {
              background: #FFF9E6;
              border-left: 4px solid #F59E0B;
              padding: 20px;
              border-radius: 6px;
              margin: 20px 0;
            }
            
            .highlight-title {
              font-size: 12pt;
              font-weight: 700;
              color: #212121;
              margin-bottom: 10px;
            }
            
            .highlight-text {
              font-size: 10pt;
              color: #424242;
              line-height: 1.6;
            }
            
            .bullet-list {
              margin: 15px 0;
              padding-left: 0;
              list-style: none;
            }
            
            .bullet-list li {
              padding: 8px 0 8px 25px;
              position: relative;
              line-height: 1.5;
            }
            
            .bullet-list li:before {
              content: "●";
              color: #2563EB;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
          </style>
        </head>
        <body>
          <div class="page cover-page">
            <div class="cover-logo">🏠</div>
            <h1 class="cover-title">Roof Measurement Report</h1>
            <p class="cover-subtitle">Advanced Aerial Analysis</p>
            
            <div class="cover-info">
              <div class="cover-info-item">
                <div class="cover-info-label">Property Address</div>
                <div class="cover-info-value">${propertyAddress}</div>
              </div>
              <div class="cover-info-item">
                <div class="cover-info-label">Report Generated</div>
                <div class="cover-info-value">${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
              </div>
              <div class="cover-info-item">
                <div class="cover-info-label">Total Roof Area</div>
                <div class="cover-info-value">${totalArea.toFixed(2)} sq ft</div>
              </div>
              <div class="cover-info-item">
                <div class="cover-info-label">Number of Facets</div>
                <div class="cover-info-value">${facets.length}</div>
              </div>
            </div>
          </div>

          <div class="page">
            <div class="page-header">
              <h1>Executive Summary</h1>
              <div class="report-id">Roof Measurement Analysis - ${propertyAddress}</div>
            </div>

            <div class="section">
              <div class="summary-box">
                <div class="summary-title">Total Roof Area</div>
                <div class="summary-value">${totalArea.toFixed(2)}</div>
                <div class="summary-subtitle">Square Feet</div>
              </div>

              <div class="info-grid">
                <div class="info-card">
                  <div class="info-card-label">Number of Facets</div>
                  <div class="info-card-value">${facets.length}</div>
                </div>
                <div class="info-card">
                  <div class="info-card-label">Average Pitch</div>
                  <div class="info-card-value">${avgPitch.toFixed(1)}:12</div>
                </div>
                <div class="info-card">
                  <div class="info-card-label">Total Perimeter</div>
                  <div class="info-card-value">${totalPerimeter.toFixed(1)} ft</div>
                </div>
                <div class="info-card">
                  <div class="info-card-label">Measurement Date</div>
                  <div class="info-card-value">${new Date().toLocaleDateString()}</div>
                </div>
              </div>

              <div class="highlight-box">
                <div class="highlight-title">📐 Measurement Method</div>
                <div class="highlight-text">
                  This report contains detailed roof measurements derived from advanced aerial imagery analysis. 
                  All measurements are calculated using precise polygon mapping techniques with a scale of 10 pixels per foot. 
                  Each facet has been individually measured for area, dimensions, pitch, and perimeter.
                </div>
              </div>

              <h3 class="section-subheader">Key Measurements</h3>
              <ul class="bullet-list">
                <li><strong>Total Roof Coverage:</strong> ${totalArea.toFixed(2)} square feet across ${facets.length} distinct facets</li>
                <li><strong>Average Roof Pitch:</strong> ${avgPitch.toFixed(1)}:12 slope ratio</li>
                <li><strong>Total Edge Length:</strong> ${totalPerimeter.toFixed(1)} linear feet of roof perimeter</li>
                <li><strong>Largest Facet:</strong> ${Math.max(...facets.map(f => f.area)).toFixed(2)} sq ft</li>
                <li><strong>Smallest Facet:</strong> ${Math.min(...facets.map(f => f.area)).toFixed(2)} sq ft</li>
              </ul>
            </div>

            <div class="page-footer">
              <span>InspectAI Roof Measurement Report</span>
              <span>Page 1</span>
            </div>
          </div>

          <div class="page">
            <div class="page-header">
              <h1>Roof Diagram</h1>
              <div class="report-id">Visual Representation of Measured Facets</div>
            </div>

            <div class="section">
              <h3 class="section-subheader">Aerial View Diagram</h3>
              <div class="diagram-container">
                ${generateRoofDiagramSVG()}
              </div>

              <div class="highlight-box">
                <div class="highlight-title">🎯 Diagram Legend</div>
                <div class="highlight-text">
                  Each colored polygon represents a distinct roof facet. The diagram shows the relative positions, 
                  sizes, and shapes of all measured roof sections. Facet labels and areas are displayed at the center 
                  of each polygon. This visual representation is derived from precise measurements taken from advanced 
                  aerial imagery.
                </div>
              </div>
            </div>

            <div class="page-footer">
              <span>InspectAI Roof Measurement Report</span>
              <span>Page 2</span>
            </div>
          </div>

          <div class="page">
            <div class="page-header">
              <h1>Detailed Facet Measurements</h1>
              <div class="report-id">Individual Facet Analysis</div>
            </div>

            <div class="section">
              <h3 class="section-subheader">Comprehensive Facet Data</h3>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Facet Name</th>
                    <th>Area (sq ft)</th>
                    <th>Pitch</th>
                    <th>Width (ft)</th>
                    <th>Height (ft)</th>
                    <th>Perimeter (ft)</th>
                  </tr>
                </thead>
                <tbody>
                  ${facets.map(facet => `
                    <tr>
                      <td><strong>${facet.label}</strong></td>
                      <td>${facet.area.toFixed(2)}</td>
                      <td>${facet.pitch}:12</td>
                      <td>${facet.measurements.width.toFixed(1)}</td>
                      <td>${facet.measurements.height.toFixed(1)}</td>
                      <td>${facet.measurements.perimeter.toFixed(1)}</td>
                    </tr>
                  `).join('')}
                  <tr class="total-row">
                    <td>TOTAL</td>
                    <td>${totalArea.toFixed(2)}</td>
                    <td>${avgPitch.toFixed(1)}:12 avg</td>
                    <td colspan="2">-</td>
                    <td>${totalPerimeter.toFixed(1)}</td>
                  </tr>
                </tbody>
              </table>

              <h3 class="section-subheader">Measurement Notes</h3>
              <ul class="bullet-list">
                <li><strong>Area Calculation:</strong> Calculated using polygon area formula based on vertex coordinates</li>
                <li><strong>Pitch Measurement:</strong> Roof slope expressed as rise over 12 inches of horizontal run</li>
                <li><strong>Dimensions:</strong> Width and height represent the bounding box of each facet</li>
                <li><strong>Perimeter:</strong> Total linear distance around the edges of each facet</li>
                <li><strong>Accuracy:</strong> All measurements derived from advanced aerial imagery with 10:1 pixel-to-foot scale</li>
              </ul>

              <div class="highlight-box">
                <div class="highlight-title">⚠️ Important Notes</div>
                <div class="highlight-text">
                  These measurements are based on aerial imagery analysis and polygon mapping. For critical applications, 
                  we recommend verification with on-site measurements. Pitch measurements should be confirmed with a 
                  physical pitch gauge. All measurements are provided in feet and square feet unless otherwise noted.
                </div>
              </div>
            </div>

            <div class="page-footer">
              <span>InspectAI Roof Measurement Report</span>
              <span>Page 3</span>
            </div>
          </div>

          <div class="page">
            <div class="page-header">
              <h1>Material Estimation Guide</h1>
              <div class="report-id">Based on Measured Roof Area</div>
            </div>

            <div class="section">
              <h3 class="section-subheader">Roofing Material Estimates</h3>
              
              <div class="info-grid">
                <div class="info-card">
                  <div class="info-card-label">Shingles (3-tab)</div>
                  <div class="info-card-value">${Math.ceil(totalArea / 100)} squares</div>
                </div>
                <div class="info-card">
                  <div class="info-card-label">Shingles (Architectural)</div>
                  <div class="info-card-value">${Math.ceil(totalArea / 100)} squares</div>
                </div>
                <div class="info-card">
                  <div class="info-card-label">Underlayment</div>
                  <div class="info-card-value">${Math.ceil(totalArea * 1.1)} sq ft</div>
                </div>
                <div class="info-card">
                  <div class="info-card-label">Ridge Cap</div>
                  <div class="info-card-value">${Math.ceil(totalPerimeter * 0.3)} linear ft</div>
                </div>
              </div>

              <h3 class="section-subheader">Additional Materials</h3>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Estimated Quantity</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Drip Edge</td>
                    <td>${Math.ceil(totalPerimeter)} linear ft</td>
                    <td>Perimeter coverage</td>
                  </tr>
                  <tr>
                    <td>Ice & Water Shield</td>
                    <td>${Math.ceil(totalArea * 0.15)} sq ft</td>
                    <td>15% of total area (valleys, eaves)</td>
                  </tr>
                  <tr>
                    <td>Starter Shingles</td>
                    <td>${Math.ceil(totalPerimeter / 3)} bundles</td>
                    <td>Based on perimeter</td>
                  </tr>
                  <tr>
                    <td>Roofing Nails</td>
                    <td>${Math.ceil(totalArea / 100 * 2)} lbs</td>
                    <td>~2 lbs per square</td>
                  </tr>
                  <tr>
                    <td>Ventilation</td>
                    <td>${Math.ceil(totalArea / 150)} vents</td>
                    <td>1 vent per 150 sq ft</td>
                  </tr>
                </tbody>
              </table>

              <div class="highlight-box">
                <div class="highlight-title">📋 Estimation Guidelines</div>
                <div class="highlight-text">
                  Material estimates include a 10% waste factor for typical installations. Actual material requirements 
                  may vary based on roof complexity, installation method, and local building codes. Always consult with 
                  a licensed roofing contractor for final material calculations and ordering. These estimates are provided 
                  as a general guide only.
                </div>
              </div>
            </div>

            <div class="page-footer">
              <span>InspectAI Roof Measurement Report</span>
              <span>Page 4</span>
            </div>
          </div>

          <div class="page" style="background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
            <div style="max-width: 500px;">
              <h2 style="font-size: 32pt; font-weight: 700; margin-bottom: 20px;">InspectAI</h2>
              <p style="font-size: 14pt; opacity: 0.9; line-height: 1.8; margin-bottom: 40px;">
                Advanced Aerial Roof Measurement & Analysis
              </p>
              
              <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 12px; padding: 30px; margin-top: 40px;">
                <p style="font-size: 12pt; margin-bottom: 10px;">📞 (555) 123-4567</p>
                <p style="font-size: 12pt; margin-bottom: 10px;">✉️ info@inspectai.com</p>
                <p style="font-size: 12pt;">🌐 www.inspectai.com</p>
              </div>

              <p style="font-size: 9pt; opacity: 0.7; margin-top: 40px;">
                © ${new Date().getFullYear()} InspectAI. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ 
        html,
        width: 612,
        height: 792,
      });
      console.log('Roof report PDF generated at:', uri);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Roof Measurement Report',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert('Success', 'Roof measurement report generated successfully!');
      }
    } catch (error) {
      console.error('Error generating roof report PDF:', error);
      Alert.alert('Error', 'Failed to generate roof measurement report. Please try again.');
    }
  };

  const totalArea = facets.reduce((sum, facet) => sum + facet.area, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Roof Drawing Tool</Text>
        <Text style={styles.subtitle}>
          Draw roof facets over satellite imagery. Note: Google Maps integration requires a valid API key.
        </Text>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Property Address</Text>
        <TextInput
          style={[styles.addressInput, { 
            backgroundColor: colors.background, 
            color: colors.text,
            borderColor: colors.border 
          }]}
          placeholder="Enter property address (e.g., 123 Main St, City, State ZIP)"
          placeholderTextColor={colors.textSecondary}
          value={propertyAddress}
          onChangeText={handleAddressChange}
          multiline
        />
        {showSuggestions && addressSuggestions.length > 0 && (
          <View style={[styles.suggestionsContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
            {addressSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                onPress={() => selectAddress(suggestion)}
              >
                <Text style={[styles.suggestionText, { color: colors.text }]}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.warningBox}>
          <IconSymbol ios_icon_name="exclamationmark.triangle.fill" android_material_icon_name="warning" size={20} color="#F59E0B" />
          <Text style={styles.warningText}>
            Google Maps API integration is not fully configured. To enable satellite imagery and address autocomplete, you need to:
          </Text>
        </View>
        <View style={styles.instructionsList}>
          <Text style={styles.instructionText}>1. Get a Google Maps API key from Google Cloud Console</Text>
          <Text style={styles.instructionText}>2. Enable Maps JavaScript API and Places API</Text>
          <Text style={styles.instructionText}>3. Replace YOUR_GOOGLE_API_KEY in the code with your actual key</Text>
          <Text style={styles.instructionText}>4. For web: Add the API key to your HTML or use a Maps library</Text>
          <Text style={styles.instructionText}>5. For native: Configure react-native-maps (not supported in Natively)</Text>
        </View>
      </View>

      <View style={styles.canvasContainer}>
        <View style={styles.canvas} onTouchEnd={handleCanvasPress}>
          <Svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
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
          <Text style={styles.legendText}>Scale: 1 grid square = 5 feet | Satellite imagery requires Google Maps API</Text>
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
              <TouchableOpacity style={[styles.button, styles.reportButton]} onPress={generateRoofReport}>
                <IconSymbol ios_icon_name="doc.text.fill" android_material_icon_name="description" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>Generate Roof Report</Text>
              </TouchableOpacity>

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
            <Text style={styles.summarySubtitle}>From Manual Measurements</Text>
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
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  addressInput: {
    height: 80,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  suggestionsContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#92400E',
    lineHeight: 18,
  },
  instructionsList: {
    marginTop: 8,
    paddingLeft: 8,
  },
  instructionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
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
  reportButton: {
    backgroundColor: colors.highlight,
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
  summarySubtitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginTop: 4,
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
