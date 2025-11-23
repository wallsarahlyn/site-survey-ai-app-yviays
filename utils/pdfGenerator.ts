
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { InspectionReport } from '@/types/inspection';

// Helper function to generate color-coded severity badges
const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'none': return '#4CAF50';
    case 'minor': return '#8BC34A';
    case 'moderate': return '#FFAB40';
    case 'severe': return '#F44336';
    default: return '#757575';
  }
};

// Helper function to generate condition color
const getConditionColor = (condition: string): string => {
  switch (condition) {
    case 'excellent': return '#4CAF50';
    case 'good': return '#8BC34A';
    case 'fair': return '#FFAB40';
    case 'poor': return '#F44336';
    default: return '#757575';
  }
};

// Generate QR code data URL (simplified - in production use a QR library)
const generateQRCode = (reportId: string): string => {
  // This is a placeholder - in production, use a proper QR code generator
  const qrUrl = `https://inspection-reports.example.com/report/${reportId}`;
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
      <rect width="150" height="150" fill="white"/>
      <text x="75" y="75" text-anchor="middle" font-size="12" fill="black">QR Code</text>
      <text x="75" y="90" text-anchor="middle" font-size="8" fill="gray">${reportId}</text>
    </svg>
  `)}`;
};

// Generate visual score indicator
const generateScoreIndicator = (score: number): string => {
  const percentage = Math.min(100, Math.max(0, score));
  const color = percentage >= 75 ? '#4CAF50' : percentage >= 50 ? '#FFAB40' : '#F44336';
  
  return `
    <div style="position: relative; width: 120px; height: 120px; margin: 20px auto;">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#E0E0E0" stroke-width="8"/>
        <circle cx="60" cy="60" r="54" fill="none" stroke="${color}" stroke-width="8"
                stroke-dasharray="${(percentage / 100) * 339.292} 339.292"
                stroke-linecap="round" transform="rotate(-90 60 60)"/>
        <text x="60" y="65" text-anchor="middle" font-size="28" font-weight="bold" fill="${color}">
          ${Math.round(percentage)}
        </text>
        <text x="60" y="80" text-anchor="middle" font-size="12" fill="#757575">
          / 100
        </text>
      </svg>
    </div>
  `;
};

// Generate roof diagram visualization
const generateRoofDiagramSVG = (report: InspectionReport): string => {
  if (!report.roofDiagram) return '';
  
  const { facets } = report.roofDiagram;
  const width = 600;
  const height = 400;
  
  // Calculate bounds
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  facets.forEach(facet => {
    facet.points.forEach(point => {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    });
  });
  
  const scaleX = (width - 100) / (maxX - minX || 1);
  const scaleY = (height - 100) / (maxY - minY || 1);
  const scale = Math.min(scaleX, scaleY);
  
  const colors = ['#2962FF', '#4CAF50', '#FFAB40', '#9C27B0', '#FF5722', '#00BCD4'];
  
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="border: 1px solid #E0E0E0; border-radius: 8px; background: #FAFAFA;">
      ${facets.map((facet, index) => {
        const points = facet.points.map(p => 
          `${50 + (p.x - minX) * scale},${50 + (p.y - minY) * scale}`
        ).join(' ');
        
        const centerX = 50 + facet.points.reduce((sum, p) => sum + (p.x - minX) * scale, 0) / facet.points.length;
        const centerY = 50 + facet.points.reduce((sum, p) => sum + (p.y - minY) * scale, 0) / facet.points.length;
        
        return `
          <polygon points="${points}" fill="${colors[index % colors.length]}" opacity="0.6" 
                   stroke="${colors[index % colors.length]}" stroke-width="2"/>
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

export async function generateInspectionPDF(report: InspectionReport): Promise<void> {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
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
          
          /* Cover Page */
          .cover-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: linear-gradient(135deg, #2962FF 0%, #1E88E5 100%);
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
            color: #2962FF;
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
          
          /* Page Header */
          .page-header {
            border-bottom: 3px solid #2962FF;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          
          .page-header h1 {
            font-size: 24pt;
            font-weight: 700;
            color: #2962FF;
            margin-bottom: 5px;
          }
          
          .page-header .report-id {
            font-size: 9pt;
            color: #757575;
          }
          
          /* Section Styles */
          .section {
            margin-bottom: 35px;
            page-break-inside: avoid;
          }
          
          .section-header {
            background: #2962FF;
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
          
          /* Cards and Boxes */
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .info-card {
            background: #F5F5F5;
            border-left: 4px solid #2962FF;
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
          
          /* Status Badges */
          .badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 9pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 5px 5px 5px 0;
          }
          
          .badge-excellent { background: #4CAF50; color: white; }
          .badge-good { background: #8BC34A; color: white; }
          .badge-fair { background: #FFAB40; color: white; }
          .badge-poor { background: #F44336; color: white; }
          .badge-detected { background: #F44336; color: white; }
          .badge-clear { background: #4CAF50; color: white; }
          .badge-suitable { background: #4CAF50; color: white; }
          .badge-unsuitable { background: #757575; color: white; }
          
          /* Tables */
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
            background: #2962FF;
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
          
          /* Lists */
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
            color: #2962FF;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          
          /* Quote Section */
          .quote-box {
            background: #F5F5F5;
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .quote-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #E0E0E0;
          }
          
          .quote-row:last-child {
            border-bottom: none;
            border-top: 3px solid #2962FF;
            padding-top: 20px;
            margin-top: 15px;
            font-weight: 700;
            font-size: 14pt;
          }
          
          .quote-label {
            color: #757575;
            font-weight: 500;
          }
          
          .quote-value {
            color: #212121;
            font-weight: 700;
          }
          
          .quote-total {
            color: #2962FF;
          }
          
          /* Image Grid */
          .image-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
          }
          
          .image-container {
            background: #F5F5F5;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
            border: 1px solid #E0E0E0;
          }
          
          .image-placeholder {
            background: linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%);
            height: 200px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #757575;
            font-weight: 600;
            margin-bottom: 8px;
          }
          
          .image-caption {
            font-size: 9pt;
            color: #757575;
            margin-top: 5px;
          }
          
          /* Severity Indicators */
          .severity-indicator {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: white;
            border-radius: 6px;
            border: 2px solid;
            margin: 5px 0;
          }
          
          .severity-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }
          
          /* Footer */
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
          
          /* Disclaimer Page */
          .disclaimer-box {
            background: #FFF9E6;
            border-left: 4px solid #FFAB40;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          
          .disclaimer-title {
            font-size: 12pt;
            font-weight: 700;
            color: #212121;
            margin-bottom: 10px;
          }
          
          .disclaimer-text {
            font-size: 9pt;
            color: #424242;
            line-height: 1.6;
            margin-bottom: 10px;
          }
          
          /* Contractor Info */
          .contact-card {
            background: white;
            border: 2px solid #2962FF;
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
          }
          
          .contact-header {
            font-size: 16pt;
            font-weight: 700;
            color: #2962FF;
            margin-bottom: 20px;
          }
          
          .contact-item {
            margin: 12px 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .contact-label {
            font-weight: 600;
            color: #212121;
            min-width: 80px;
          }
          
          .contact-value {
            color: #424242;
          }
          
          .qr-container {
            text-align: center;
            margin: 30px 0;
          }
          
          .qr-code {
            width: 150px;
            height: 150px;
            margin: 0 auto 15px;
            border: 2px solid #E0E0E0;
            border-radius: 8px;
          }
          
          .qr-label {
            font-size: 10pt;
            color: #757575;
          }
          
          /* Confidence Score */
          .confidence {
            font-size: 9pt;
            color: #757575;
            font-style: italic;
            margin-top: 10px;
          }
          
          /* Roof Diagram */
          .diagram-container {
            text-align: center;
            margin: 20px 0;
          }
          
          .facet-details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
          }
          
          .facet-card {
            background: #F5F5F5;
            border-radius: 8px;
            padding: 15px;
            border-left: 4px solid #2962FF;
          }
          
          .facet-name {
            font-weight: 700;
            color: #212121;
            margin-bottom: 8px;
            font-size: 11pt;
          }
          
          .facet-detail {
            font-size: 9pt;
            color: #757575;
            margin: 4px 0;
          }
        </style>
      </head>
      <body>
        <!-- COVER PAGE -->
        <div class="page cover-page">
          <div class="cover-logo">🏠</div>
          <h1 class="cover-title">Property Inspection Report</h1>
          <p class="cover-subtitle">Professional AI-Powered Analysis</p>
          
          <div class="cover-info">
            <div class="cover-info-item">
              <div class="cover-info-label">Property Address</div>
              <div class="cover-info-value">${report.propertyAddress}</div>
            </div>
            <div class="cover-info-item">
              <div class="cover-info-label">Report ID</div>
              <div class="cover-info-value">${report.id}</div>
            </div>
            <div class="cover-info-item">
              <div class="cover-info-label">Inspection Date</div>
              <div class="cover-info-value">${report.inspectionDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
            <div class="cover-info-item">
              <div class="cover-info-label">Report Generated</div>
              <div class="cover-info-value">${currentDate}</div>
            </div>
          </div>
        </div>

        <!-- EXECUTIVE SUMMARY PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Executive Summary</h1>
            <div class="report-id">Report ID: ${report.id}</div>
          </div>

          <div class="section">
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">Overall Condition</div>
                <div class="info-card-value">
                  <span class="badge badge-${report.aiAnalysis.overallCondition}">
                    ${report.aiAnalysis.overallCondition.toUpperCase()}
                  </span>
                </div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Total Estimate</div>
                <div class="info-card-value">$${report.quote.totalEstimate.toLocaleString()}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Images Analyzed</div>
                <div class="info-card-value">${report.images.length}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Roof Area</div>
                <div class="info-card-value">${report.roofDiagram ? report.roofDiagram.totalArea.toFixed(0) : '2,000'} sq ft</div>
              </div>
            </div>

            <h3 class="section-subheader">Key Findings</h3>
            <ul class="bullet-list">
              <li><strong>Roof Condition:</strong> ${report.aiAnalysis.roofDamage.detected ? 
                `Damage detected (${report.aiAnalysis.roofDamage.severity} severity)` : 
                'No significant damage detected'}</li>
              <li><strong>Structural Assessment:</strong> ${report.aiAnalysis.structuralIssues.detected ? 
                `${report.aiAnalysis.structuralIssues.issues.length} issue(s) identified` : 
                'No structural issues detected'}</li>
              <li><strong>Solar Compatibility:</strong> ${report.aiAnalysis.solarCompatibility.suitable ? 
                `Suitable (Score: ${report.aiAnalysis.solarCompatibility.score.toFixed(0)}/100)` : 
                'Not recommended at this time'}</li>
              <li><strong>Recommended Action:</strong> ${report.quote.repairs.urgency === 'high' ? 
                'Immediate attention required' : 
                report.quote.repairs.urgency === 'medium' ? 
                'Schedule repairs within 30 days' : 
                'Routine maintenance recommended'}</li>
            </ul>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 1</span>
          </div>
        </div>

        <!-- AI FINDINGS PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>AI Analysis & Findings</h1>
            <div class="report-id">Powered by Advanced Computer Vision</div>
          </div>

          <div class="section">
            <div class="section-header">🏠 Roof Damage Assessment</div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
              <div>
                <span class="badge ${report.aiAnalysis.roofDamage.detected ? 'badge-detected' : 'badge-clear'}">
                  ${report.aiAnalysis.roofDamage.detected ? 'DAMAGE DETECTED' : 'NO DAMAGE DETECTED'}
                </span>
                ${report.aiAnalysis.roofDamage.detected ? `
                  <div class="severity-indicator" style="border-color: ${getSeverityColor(report.aiAnalysis.roofDamage.severity)};">
                    <div class="severity-dot" style="background: ${getSeverityColor(report.aiAnalysis.roofDamage.severity)};"></div>
                    <span><strong>Severity:</strong> ${report.aiAnalysis.roofDamage.severity.toUpperCase()}</span>
                  </div>
                ` : ''}
              </div>
              ${generateScoreIndicator((1 - (report.aiAnalysis.roofDamage.confidence)) * 100)}
            </div>

            ${report.aiAnalysis.roofDamage.detected && report.aiAnalysis.roofDamage.issues.length > 0 ? `
              <h3 class="section-subheader">Issues Identified</h3>
              <ul class="bullet-list">
                ${report.aiAnalysis.roofDamage.issues.map(issue => `<li>${issue}</li>`).join('')}
              </ul>
            ` : '<p>No significant roof damage detected during analysis.</p>'}
            
            <p class="confidence">AI Confidence Level: ${(report.aiAnalysis.roofDamage.confidence * 100).toFixed(1)}%</p>
          </div>

          <div class="section">
            <div class="section-header">🏗️ Structural Issues</div>
            
            <span class="badge ${report.aiAnalysis.structuralIssues.detected ? 'badge-detected' : 'badge-clear'}">
              ${report.aiAnalysis.structuralIssues.detected ? 'ISSUES DETECTED' : 'NO ISSUES DETECTED'}
            </span>

            ${report.aiAnalysis.structuralIssues.detected && report.aiAnalysis.structuralIssues.issues.length > 0 ? `
              <ul class="bullet-list">
                ${report.aiAnalysis.structuralIssues.issues.map(issue => `<li>${issue}</li>`).join('')}
              </ul>
            ` : '<p style="margin-top: 15px;">No structural issues detected during analysis.</p>'}
            
            <p class="confidence">AI Confidence Level: ${(report.aiAnalysis.structuralIssues.confidence * 100).toFixed(1)}%</p>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 2</span>
          </div>
        </div>

        <!-- DAMAGE ANALYSIS & SOLAR COMPATIBILITY PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Detailed Analysis</h1>
            <div class="report-id">Damage Assessment & Solar Evaluation</div>
          </div>

          <div class="section">
            <div class="section-header">☀️ Solar Compatibility Analysis</div>
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="flex: 1;">
                <span class="badge ${report.aiAnalysis.solarCompatibility.suitable ? 'badge-suitable' : 'badge-unsuitable'}">
                  ${report.aiAnalysis.solarCompatibility.suitable ? 'SUITABLE FOR SOLAR' : 'NOT SUITABLE'}
                </span>
                
                <div class="info-grid" style="margin-top: 20px;">
                  <div class="info-card">
                    <div class="info-card-label">Compatibility Score</div>
                    <div class="info-card-value">${report.aiAnalysis.solarCompatibility.score.toFixed(0)}/100</div>
                  </div>
                  <div class="info-card">
                    <div class="info-card-label">Estimated Capacity</div>
                    <div class="info-card-value">${report.aiAnalysis.solarCompatibility.estimatedCapacity}</div>
                  </div>
                </div>
              </div>
              ${generateScoreIndicator(report.aiAnalysis.solarCompatibility.score)}
            </div>

            <h3 class="section-subheader">Assessment Factors</h3>
            <ul class="bullet-list">
              ${report.aiAnalysis.solarCompatibility.factors.map(factor => `<li>${factor}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <div class="section-header">⚠️ Inspection Concerns & Recommendations</div>
            
            <h3 class="section-subheader">Identified Concerns</h3>
            <ul class="bullet-list">
              ${report.aiAnalysis.inspectionConcerns.concerns.map(concern => `<li>${concern}</li>`).join('')}
            </ul>

            <h3 class="section-subheader">Professional Recommendations</h3>
            <ul class="bullet-list">
              ${report.aiAnalysis.inspectionConcerns.recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 3</span>
          </div>
        </div>

        ${report.roofDiagram ? `
        <!-- ROOF MEASUREMENTS PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Roof Measurements & Diagram</h1>
            <div class="report-id">Detailed Facet Analysis</div>
          </div>

          <div class="section">
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">Total Roof Area</div>
                <div class="info-card-value">${report.roofDiagram.totalArea.toFixed(2)} sq ft</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Number of Facets</div>
                <div class="info-card-value">${report.roofDiagram.facets.length}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Average Pitch</div>
                <div class="info-card-value">${(report.roofDiagram.facets.reduce((sum, f) => sum + f.pitch, 0) / report.roofDiagram.facets.length).toFixed(1)}:12</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Diagram Created</div>
                <div class="info-card-value">${report.roofDiagram.createdAt.toLocaleDateString()}</div>
              </div>
            </div>

            <h3 class="section-subheader">Roof Diagram</h3>
            <div class="diagram-container">
              ${generateRoofDiagramSVG(report)}
            </div>

            <h3 class="section-subheader">Facet Details</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Facet</th>
                  <th>Area (sq ft)</th>
                  <th>Pitch</th>
                  <th>Dimensions</th>
                  <th>Perimeter</th>
                </tr>
              </thead>
              <tbody>
                ${report.roofDiagram.facets.map(facet => `
                  <tr>
                    <td><strong>${facet.label}</strong></td>
                    <td>${facet.area.toFixed(2)}</td>
                    <td>${facet.pitch}:12</td>
                    <td>${facet.measurements.width.toFixed(1)}' × ${facet.measurements.height.toFixed(1)}'</td>
                    <td>${facet.measurements.perimeter.toFixed(1)}'</td>
                  </tr>
                `).join('')}
                <tr style="background: #E3F2FD; font-weight: 700;">
                  <td>TOTAL</td>
                  <td>${report.roofDiagram.totalArea.toFixed(2)}</td>
                  <td colspan="3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 4</span>
          </div>
        </div>
        ` : ''}

        <!-- INSTANT QUOTE PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Instant Quote Overview</h1>
            <div class="report-id">Detailed Cost Breakdown</div>
          </div>

          <div class="section">
            <div class="section-header">💰 Roofing Services</div>
            <div class="quote-box">
              <div class="quote-row">
                <span class="quote-label">Material Cost</span>
                <span class="quote-value">$${report.quote.roofing.materialCost.toLocaleString()}</span>
              </div>
              <div class="quote-row">
                <span class="quote-label">Labor Cost</span>
                <span class="quote-value">$${report.quote.roofing.laborCost.toLocaleString()}</span>
              </div>
              <div class="quote-row">
                <span class="quote-label">Estimated Timeline</span>
                <span class="quote-value">${report.quote.roofing.timeline}</span>
              </div>
              <div class="quote-row">
                <span class="quote-label">Roofing Total</span>
                <span class="quote-value quote-total">$${report.quote.roofing.estimatedCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">☀️ Solar Installation</div>
            <div class="quote-box">
              <div class="quote-row">
                <span class="quote-label">System Size</span>
                <span class="quote-value">${report.quote.solar.systemSize}</span>
              </div>
              <div class="quote-row">
                <span class="quote-label">Installation Cost</span>
                <span class="quote-value">$${report.quote.solar.estimatedCost.toLocaleString()}</span>
              </div>
              <div class="quote-row">
                <span class="quote-label">Estimated Annual Savings</span>
                <span class="quote-value">$${report.quote.solar.estimatedSavings.toLocaleString()}/year</span>
              </div>
              <div class="quote-row">
                <span class="quote-label">Payback Period</span>
                <span class="quote-value">${report.quote.solar.paybackPeriod}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-header">🔧 Repairs & Maintenance</div>
            <div class="quote-box">
              <div class="quote-row">
                <span class="quote-label">Repair Cost</span>
                <span class="quote-value">$${report.quote.repairs.estimatedCost.toLocaleString()}</span>
              </div>
              <div class="quote-row">
                <span class="quote-label">Urgency Level</span>
                <span class="quote-value">
                  <span class="badge badge-${report.quote.repairs.urgency === 'high' ? 'poor' : report.quote.repairs.urgency === 'medium' ? 'fair' : 'good'}">
                    ${report.quote.repairs.urgency.toUpperCase()}
                  </span>
                </span>
              </div>
              <div class="quote-row">
                <span class="quote-label">Timeline</span>
                <span class="quote-value">${report.quote.repairs.timeline}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="quote-box" style="background: linear-gradient(135deg, #2962FF 0%, #1E88E5 100%); color: white;">
              <div class="quote-row" style="border-color: rgba(255,255,255,0.3);">
                <span class="quote-label" style="color: rgba(255,255,255,0.9); font-size: 14pt;">TOTAL PROJECT ESTIMATE</span>
                <span class="quote-value" style="color: white; font-size: 24pt;">$${report.quote.totalEstimate.toLocaleString()}</span>
              </div>
            </div>
            <p style="text-align: center; color: #757575; font-size: 9pt; margin-top: 15px;">
              *Estimates are subject to final inspection and may vary based on material selection and site conditions
            </p>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page ${report.roofDiagram ? '5' : '4'}</span>
          </div>
        </div>

        <!-- IMAGES PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Inspection Images</h1>
            <div class="report-id">${report.images.length} Images Analyzed</div>
          </div>

          <div class="section">
            <div class="image-grid">
              ${report.images.slice(0, 6).map((img, index) => `
                <div class="image-container">
                  <div class="image-placeholder">
                    📷 Image ${index + 1}
                  </div>
                  <div class="image-caption">${img.fileName}</div>
                  <div class="image-caption" style="font-size: 8pt;">
                    ${img.width} × ${img.height} px
                  </div>
                </div>
              `).join('')}
            </div>
            ${report.images.length > 6 ? `
              <p style="text-align: center; color: #757575; margin-top: 20px;">
                + ${report.images.length - 6} additional image(s) analyzed
              </p>
            ` : ''}
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page ${report.roofDiagram ? '6' : '5'}</span>
          </div>
        </div>

        <!-- CONTRACTOR INFO & DISCLAIMER PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Contractor Information</h1>
            <div class="report-id">Contact & Legal Information</div>
          </div>

          <div class="section">
            <div class="contact-card">
              <div class="contact-header">Professional Inspection Services</div>
              <div class="contact-item">
                <span class="contact-label">Company:</span>
                <span class="contact-value">Elite Property Inspections</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">Phone:</span>
                <span class="contact-value">(555) 123-4567</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">Email:</span>
                <span class="contact-value">info@eliteinspections.com</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">Website:</span>
                <span class="contact-value">www.eliteinspections.com</span>
              </div>
              <div class="contact-item">
                <span class="contact-label">License:</span>
                <span class="contact-value">#INS-2024-12345</span>
              </div>
            </div>

            <div class="qr-container">
              <img src="${generateQRCode(report.id)}" alt="QR Code" class="qr-code" />
              <p class="qr-label">Scan to view digital report online</p>
              <p class="qr-label" style="font-size: 8pt; margin-top: 5px;">Report ID: ${report.id}</p>
            </div>
          </div>

          <div class="section">
            <div class="section-header">📋 Disclaimer & Terms</div>
            
            <div class="disclaimer-box">
              <div class="disclaimer-title">Important Notice</div>
              <p class="disclaimer-text">
                This inspection report is generated using advanced AI-powered analysis technology and is intended 
                to provide preliminary assessment information. While our AI systems are highly accurate, this report 
                should not replace a comprehensive on-site inspection by a licensed professional.
              </p>
            </div>

            <h3 class="section-subheader">Terms & Conditions</h3>
            <ul class="bullet-list" style="font-size: 9pt;">
              <li>All estimates are preliminary and subject to change based on detailed on-site inspection</li>
              <li>AI analysis confidence levels are provided for transparency and should be considered when making decisions</li>
              <li>Actual costs may vary based on material selection, labor rates, and unforeseen conditions</li>
              <li>This report is valid for 30 days from the date of generation</li>
              <li>Recommended repairs should be performed by licensed and insured contractors</li>
              <li>Solar compatibility assessments are based on visual analysis and may require additional engineering review</li>
            </ul>

            <h3 class="section-subheader">Liability Limitation</h3>
            <p style="font-size: 9pt; color: #757575; line-height: 1.6;">
              The information contained in this report is provided "as is" without warranty of any kind. 
              The company and its AI systems make no representations or warranties regarding the accuracy, 
              completeness, or suitability of the information for any particular purpose. Users should 
              consult with qualified professionals before making any decisions based on this report.
            </p>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page ${report.roofDiagram ? '7' : '6'}</span>
          </div>
        </div>

        <!-- BACK COVER -->
        <div class="page" style="background: linear-gradient(135deg, #1E88E5 0%, #2962FF 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
          <div style="max-width: 500px;">
            <h2 style="font-size: 32pt; font-weight: 700; margin-bottom: 20px;">Thank You</h2>
            <p style="font-size: 14pt; opacity: 0.9; line-height: 1.8; margin-bottom: 40px;">
              We appreciate the opportunity to serve you. For questions about this report or to schedule 
              services, please contact our team.
            </p>
            
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 12px; padding: 30px; margin-top: 40px;">
              <p style="font-size: 12pt; margin-bottom: 10px;">📞 (555) 123-4567</p>
              <p style="font-size: 12pt; margin-bottom: 10px;">✉️ info@eliteinspections.com</p>
              <p style="font-size: 12pt;">🌐 www.eliteinspections.com</p>
            </div>

            <p style="font-size: 9pt; opacity: 0.7; margin-top: 40px;">
              © ${new Date().getFullYear()} Elite Property Inspections. All rights reserved.
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
    console.log('PDF generated at:', uri);
    
    // Share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Inspection Report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      console.log('Sharing is not available on this platform');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
