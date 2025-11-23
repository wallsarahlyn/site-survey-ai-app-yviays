
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { InspectionReport } from '@/types/inspection';
import { HistoricalAnalysis, StormEvent, RiskScore } from '@/types/historicalData';

// Helper function to get risk color
const getRiskColor = (level: string): string => {
  switch (level) {
    case 'low': return '#4CAF50';
    case 'moderate': return '#FFAB40';
    case 'high': return '#FF9800';
    case 'extreme': return '#F44336';
    default: return '#757575';
  }
};

// Generate timeline visualization
const generateTimelineSVG = (events: StormEvent[]): string => {
  const width = 700;
  const height = 200;
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  
  if (sortedEvents.length === 0) return '';
  
  const minDate = sortedEvents[0].date.getTime();
  const maxDate = Date.now();
  const timeRange = maxDate - minDate;
  
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background: #FAFAFA; border-radius: 8px;">
      <!-- Timeline line -->
      <line x1="50" y1="100" x2="${width - 50}" y2="100" stroke="#E0E0E0" stroke-width="2"/>
      
      ${sortedEvents.slice(0, 10).map((event, index) => {
        const x = 50 + ((event.date.getTime() - minDate) / timeRange) * (width - 100);
        const color = getRiskColor(event.severity);
        const y = 100 - (index % 2 === 0 ? 40 : -40);
        
        return `
          <circle cx="${x}" cy="100" r="6" fill="${color}" stroke="white" stroke-width="2"/>
          <line x1="${x}" y1="100" x2="${x}" y2="${y}" stroke="${color}" stroke-width="1" stroke-dasharray="2,2"/>
          <text x="${x}" y="${y - 10}" text-anchor="middle" font-size="10" fill="${color}" font-weight="bold">
            ${event.type.toUpperCase()}
          </text>
          <text x="${x}" y="${y + 5}" text-anchor="middle" font-size="8" fill="#757575">
            ${event.date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
          </text>
        `;
      }).join('')}
      
      <!-- Date labels -->
      <text x="50" y="130" text-anchor="middle" font-size="10" fill="#757575">
        ${sortedEvents[0].date.getFullYear()}
      </text>
      <text x="${width - 50}" y="130" text-anchor="middle" font-size="10" fill="#757575">
        ${new Date().getFullYear()}
      </text>
    </svg>
  `;
};

// Generate risk score chart
const generateRiskScoreChart = (riskScores: RiskScore[]): string => {
  const width = 600;
  const height = 300;
  const barWidth = 80;
  const maxScore = 100;
  const scores = riskScores.filter(s => s.category !== 'overall');
  
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background: #FAFAFA; border-radius: 8px;">
      ${scores.map((risk, index) => {
        const x = 80 + index * 120;
        const barHeight = (risk.score / maxScore) * 200;
        const y = 220 - barHeight;
        const color = getRiskColor(risk.level);
        
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="4"/>
          <text x="${x + barWidth / 2}" y="${y - 10}" text-anchor="middle" font-size="16" font-weight="bold" fill="${color}">
            ${risk.score}
          </text>
          <text x="${x + barWidth / 2}" y="245" text-anchor="middle" font-size="12" fill="#212121" font-weight="600">
            ${risk.category.toUpperCase()}
          </text>
          <text x="${x + barWidth / 2}" y="265" text-anchor="middle" font-size="10" fill="#757575">
            ${risk.level}
          </text>
        `;
      }).join('')}
      
      <!-- Y-axis -->
      <line x1="50" y1="20" x2="50" y2="220" stroke="#E0E0E0" stroke-width="2"/>
      <text x="30" y="25" text-anchor="middle" font-size="10" fill="#757575">100</text>
      <text x="30" y="125" text-anchor="middle" font-size="10" fill="#757575">50</text>
      <text x="30" y="225" text-anchor="middle" font-size="10" fill="#757575">0</text>
    </svg>
  `;
};

export async function generateInsuranceVerificationPDF(
  report: InspectionReport,
  historicalAnalysis: HistoricalAnalysis
): Promise<void> {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const overallRisk = historicalAnalysis.riskScores.find(s => s.category === 'overall');
  const severeEvents = historicalAnalysis.stormEvents.filter(e => e.severity === 'severe' || e.severity === 'catastrophic');
  
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
            background: linear-gradient(135deg, #F44336 0%, #D32F2F 100%);
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
            color: #F44336;
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
            border-bottom: 3px solid #F44336;
            padding-bottom: 15px;
            margin-bottom: 30px;
          }
          
          .page-header h1 {
            font-size: 24pt;
            font-weight: 700;
            color: #F44336;
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
            background: #F44336;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-size: 16pt;
            font-weight: 700;
          }
          
          .section-subheader {
            font-size: 13pt;
            font-weight: 700;
            color: #212121;
            margin: 25px 0 15px 0;
            padding-bottom: 8px;
            border-bottom: 2px solid #E0E0E0;
          }
          
          /* Info Grid */
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .info-card {
            background: #F5F5F5;
            border-left: 4px solid #F44336;
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
          
          /* Risk Badge */
          .risk-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 10pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 5px 5px 5px 0;
          }
          
          .risk-low { background: #4CAF50; color: white; }
          .risk-moderate { background: #FFAB40; color: white; }
          .risk-high { background: #FF9800; color: white; }
          .risk-extreme { background: #F44336; color: white; }
          
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
            background: #F44336;
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
          
          /* Summary Box */
          .summary-box {
            background: #FFF3E0;
            border-left: 4px solid #FF9800;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          
          .summary-title {
            font-size: 14pt;
            font-weight: 700;
            color: #212121;
            margin-bottom: 12px;
          }
          
          .summary-text {
            font-size: 11pt;
            color: #424242;
            line-height: 1.8;
          }
          
          /* Chart Container */
          .chart-container {
            text-align: center;
            margin: 20px 0;
            background: white;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #E0E0E0;
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
            color: #F44336;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          
          /* Warning Box */
          .warning-box {
            background: #FFEBEE;
            border: 2px solid #F44336;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          
          .warning-title {
            font-size: 14pt;
            font-weight: 700;
            color: #F44336;
            margin-bottom: 10px;
          }
          
          .warning-text {
            font-size: 10pt;
            color: #424242;
            line-height: 1.6;
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
          
          /* Disclaimer */
          .disclaimer-box {
            background: #FFF9E6;
            border-left: 4px solid #FFAB40;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
          }
          
          .disclaimer-text {
            font-size: 9pt;
            color: #424242;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <!-- COVER PAGE -->
        <div class="page cover-page">
          <div class="cover-logo">🛡️</div>
          <h1 class="cover-title">Insurance Verification Report</h1>
          <p class="cover-subtitle">Historical Analysis & Risk Assessment</p>
          
          <div class="cover-info">
            <div class="cover-info-item">
              <div class="cover-info-label">Property Address</div>
              <div class="cover-info-value">${report.propertyAddress}</div>
            </div>
            <div class="cover-info-item">
              <div class="cover-info-label">Report ID</div>
              <div class="cover-info-value">${historicalAnalysis.id}</div>
            </div>
            <div class="cover-info-item">
              <div class="cover-info-label">Analysis Date</div>
              <div class="cover-info-value">${currentDate}</div>
            </div>
            <div class="cover-info-item">
              <div class="cover-info-label">Overall Risk Level</div>
              <div class="cover-info-value">${overallRisk?.level.toUpperCase() || 'MODERATE'}</div>
            </div>
          </div>
        </div>

        <!-- EXECUTIVE SUMMARY PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Executive Summary</h1>
            <div class="report-id">Report ID: ${historicalAnalysis.id}</div>
          </div>

          <div class="section">
            <div class="summary-box">
              <div class="summary-title">AI-Generated Risk Assessment</div>
              <p class="summary-text">${historicalAnalysis.aiSummary}</p>
            </div>

            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">Overall Risk Score</div>
                <div class="info-card-value">${overallRisk?.score || 0}/100</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Risk Level</div>
                <div class="info-card-value">
                  <span class="risk-badge risk-${overallRisk?.level || 'moderate'}">
                    ${overallRisk?.level.toUpperCase() || 'MODERATE'}
                  </span>
                </div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Storm Events (5 years)</div>
                <div class="info-card-value">${historicalAnalysis.stormEvents.length}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Severe Events</div>
                <div class="info-card-value">${severeEvents.length}</div>
              </div>
            </div>

            ${severeEvents.length > 0 ? `
              <div class="warning-box">
                <div class="warning-title">⚠️ High Risk Alert</div>
                <p class="warning-text">
                  This property has experienced ${severeEvents.length} severe weather event(s) in the past 5 years. 
                  Additional underwriting review is recommended. Most recent severe event: 
                  ${severeEvents[0].type} on ${severeEvents[0].date.toLocaleDateString()}.
                </p>
              </div>
            ` : ''}

            <h3 class="section-subheader">Key Findings for Underwriters</h3>
            <ul class="bullet-list">
              <li><strong>Fire Risk:</strong> ${historicalAnalysis.fireRisk.riskLevel.toUpperCase()} - ${historicalAnalysis.fireRisk.zone}</li>
              <li><strong>Flood Risk:</strong> FEMA Zone ${historicalAnalysis.floodRisk.floodZone} - ${historicalAnalysis.floodRisk.riskLevel.toUpperCase()} risk</li>
              <li><strong>Claims in Area:</strong> ${historicalAnalysis.insuranceClaims.claimsInArea} claims with average of $${historicalAnalysis.insuranceClaims.averageClaimAmount.toLocaleString()}</li>
              <li><strong>Roof Condition:</strong> ${report.aiAnalysis.overallCondition.toUpperCase()} - ${report.aiAnalysis.roofDamage.detected ? `${report.aiAnalysis.roofDamage.severity} damage detected` : 'No significant damage'}</li>
              <li><strong>Regional Roof Age:</strong> Average ${historicalAnalysis.roofAgePatterns.averageRoofAge} years, replacement every ${historicalAnalysis.roofAgePatterns.replacementFrequency} years</li>
            </ul>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 1</span>
          </div>
        </div>

        <!-- RISK ASSESSMENT PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Comprehensive Risk Assessment</h1>
            <div class="report-id">Multi-Factor Analysis</div>
          </div>

          <div class="section">
            <div class="section-header">Risk Score Breakdown</div>
            
            <div class="chart-container">
              ${generateRiskScoreChart(historicalAnalysis.riskScores)}
            </div>

            <table class="data-table">
              <thead>
                <tr>
                  <th>Risk Category</th>
                  <th>Score</th>
                  <th>Level</th>
                  <th>Primary Factors</th>
                </tr>
              </thead>
              <tbody>
                ${historicalAnalysis.riskScores.filter(s => s.category !== 'overall').map(risk => `
                  <tr>
                    <td><strong>${risk.category.toUpperCase()}</strong></td>
                    <td>${risk.score}/100</td>
                    <td><span class="risk-badge risk-${risk.level}">${risk.level.toUpperCase()}</span></td>
                    <td>${risk.factors[0]}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 2</span>
          </div>
        </div>

        <!-- STORM HISTORY PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Storm Event History</h1>
            <div class="report-id">5-Year Historical Analysis</div>
          </div>

          <div class="section">
            <div class="section-header">Event Timeline</div>
            
            <div class="chart-container">
              ${generateTimelineSVG(historicalAnalysis.stormEvents)}
            </div>

            <h3 class="section-subheader">Detailed Event Log</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Details</th>
                  <th>Distance</th>
                </tr>
              </thead>
              <tbody>
                ${historicalAnalysis.stormEvents.slice(0, 15).map(event => `
                  <tr>
                    <td>${event.date.toLocaleDateString()}</td>
                    <td><strong>${event.type.toUpperCase()}</strong></td>
                    <td><span class="risk-badge risk-${event.severity === 'catastrophic' ? 'extreme' : event.severity}">${event.severity.toUpperCase()}</span></td>
                    <td>
                      ${event.windSpeed ? `Wind: ${event.windSpeed} mph` : ''}
                      ${event.hailSize ? `Hail: ${event.hailSize.toFixed(1)}"` : ''}
                      ${event.damageReported ? ' - Damage reported' : ''}
                    </td>
                    <td>${event.proximityMiles.toFixed(1)} mi</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            ${historicalAnalysis.stormEvents.length > 15 ? `
              <p style="text-align: center; color: #757575; margin-top: 15px; font-style: italic;">
                + ${historicalAnalysis.stormEvents.length - 15} additional events not shown
              </p>
            ` : ''}
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 3</span>
          </div>
        </div>

        <!-- FIRE & FLOOD RISK PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Fire & Flood Risk Analysis</h1>
            <div class="report-id">FEMA & Regional Data</div>
          </div>

          <div class="section">
            <div class="section-header">Fire Risk Assessment</div>
            
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">Fire Zone</div>
                <div class="info-card-value">${historicalAnalysis.fireRisk.zone}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Risk Level</div>
                <div class="info-card-value">
                  <span class="risk-badge risk-${historicalAnalysis.fireRisk.riskLevel}">
                    ${historicalAnalysis.fireRisk.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <h3 class="section-subheader">Fire Risk Factors</h3>
            <ul class="bullet-list">
              ${historicalAnalysis.fireRisk.factors.map(factor => `<li>${factor}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <div class="section-header">Flood Risk Assessment</div>
            
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">FEMA Flood Zone</div>
                <div class="info-card-value">${historicalAnalysis.floodRisk.floodZone}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Risk Level</div>
                <div class="info-card-value">
                  <span class="risk-badge risk-${historicalAnalysis.floodRisk.riskLevel === 'minimal' ? 'low' : historicalAnalysis.floodRisk.riskLevel}">
                    ${historicalAnalysis.floodRisk.riskLevel.toUpperCase()}
                  </span>
                </div>
              </div>
              ${historicalAnalysis.floodRisk.baseFloodElevation ? `
                <div class="info-card">
                  <div class="info-card-label">Base Flood Elevation</div>
                  <div class="info-card-value">${historicalAnalysis.floodRisk.baseFloodElevation} ft</div>
                </div>
              ` : ''}
              ${historicalAnalysis.floodRisk.lastFloodDate ? `
                <div class="info-card">
                  <div class="info-card-label">Last Flood Event</div>
                  <div class="info-card-value">${historicalAnalysis.floodRisk.lastFloodDate.toLocaleDateString()}</div>
                </div>
              ` : ''}
            </div>

            ${historicalAnalysis.floodRisk.riskLevel !== 'minimal' ? `
              <div class="warning-box">
                <div class="warning-title">Flood Insurance Required</div>
                <p class="warning-text">
                  This property is located in FEMA flood zone ${historicalAnalysis.floodRisk.floodZone}, 
                  which indicates ${historicalAnalysis.floodRisk.riskLevel} flood risk. Flood insurance 
                  may be required by lenders and is strongly recommended for adequate property protection.
                </p>
              </div>
            ` : ''}
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 4</span>
          </div>
        </div>

        <!-- INSURANCE CLAIMS & WEATHER PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Insurance Claims & Weather Patterns</h1>
            <div class="report-id">Regional Analysis</div>
          </div>

          <div class="section">
            <div class="section-header">Insurance Claim Activity</div>
            
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">Claims in Area</div>
                <div class="info-card-value">${historicalAnalysis.insuranceClaims.claimsInArea}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Average Claim Amount</div>
                <div class="info-card-value">$${historicalAnalysis.insuranceClaims.averageClaimAmount.toLocaleString()}</div>
              </div>
            </div>

            <h3 class="section-subheader">Common Claim Types</h3>
            <ul class="bullet-list">
              ${historicalAnalysis.insuranceClaims.commonClaimTypes.map(type => `<li>${type}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <div class="section-header">Historical Weather Patterns</div>
            
            <table class="data-table">
              <thead>
                <tr>
                  <th>Weather Metric</th>
                  <th>Value</th>
                  <th>Impact on Property</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Annual Precipitation</td>
                  <td>${historicalAnalysis.weatherPatterns.averageAnnualPrecipitation.toFixed(1)} inches</td>
                  <td>Affects roof drainage and water damage risk</td>
                </tr>
                <tr>
                  <td>Annual Snowfall</td>
                  <td>${historicalAnalysis.weatherPatterns.averageSnowfall.toFixed(1)} inches</td>
                  <td>Impacts roof load and ice dam formation</td>
                </tr>
                <tr>
                  <td>Average Wind Speed</td>
                  <td>${historicalAnalysis.weatherPatterns.averageWindSpeed.toFixed(1)} mph</td>
                  <td>Influences roof material selection and durability</td>
                </tr>
                <tr>
                  <td>Extreme Weather Days</td>
                  <td>${historicalAnalysis.weatherPatterns.extremeWeatherDays} days/year</td>
                  <td>Accelerates wear and increases maintenance needs</td>
                </tr>
                <tr>
                  <td>Temperature Range</td>
                  <td>${historicalAnalysis.weatherPatterns.temperatureRange.min}°F to ${historicalAnalysis.weatherPatterns.temperatureRange.max}°F</td>
                  <td>Affects material expansion/contraction cycles</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 5</span>
          </div>
        </div>

        <!-- ROOF ANALYSIS & RECOMMENDATIONS PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Roof Analysis & Recommendations</h1>
            <div class="report-id">Property-Specific Assessment</div>
          </div>

          <div class="section">
            <div class="section-header">Current Roof Condition</div>
            
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">Overall Condition</div>
                <div class="info-card-value">${report.aiAnalysis.overallCondition.toUpperCase()}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Damage Detected</div>
                <div class="info-card-value">${report.aiAnalysis.roofDamage.detected ? 'YES' : 'NO'}</div>
              </div>
              ${report.aiAnalysis.roofDamage.detected ? `
                <div class="info-card">
                  <div class="info-card-label">Damage Severity</div>
                  <div class="info-card-value">${report.aiAnalysis.roofDamage.severity.toUpperCase()}</div>
                </div>
              ` : ''}
              ${report.roofDiagram ? `
                <div class="info-card">
                  <div class="info-card-label">Total Roof Area</div>
                  <div class="info-card-value">${report.roofDiagram.totalArea.toFixed(0)} sq ft</div>
                </div>
              ` : ''}
            </div>

            ${report.aiAnalysis.roofDamage.detected && report.aiAnalysis.roofDamage.issues.length > 0 ? `
              <h3 class="section-subheader">Identified Issues</h3>
              <ul class="bullet-list">
                ${report.aiAnalysis.roofDamage.issues.map(issue => `<li>${issue}</li>`).join('')}
              </ul>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-header">Regional Roof Patterns</div>
            
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label">Average Roof Age</div>
                <div class="info-card-value">${historicalAnalysis.roofAgePatterns.averageRoofAge} years</div>
              </div>
              <div class="info-card">
                <div class="info-card-label">Replacement Frequency</div>
                <div class="info-card-value">${historicalAnalysis.roofAgePatterns.replacementFrequency} years</div>
              </div>
            </div>

            <h3 class="section-subheader">Common Roof Types in Area</h3>
            <ul class="bullet-list">
              ${historicalAnalysis.roofAgePatterns.commonRoofTypes.map(type => `<li>${type}</li>`).join('')}
            </ul>

            <h3 class="section-subheader">Regional Factors Affecting Roof Lifespan</h3>
            <ul class="bullet-list">
              ${historicalAnalysis.roofAgePatterns.regionalFactors.map(factor => `<li>${factor}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <div class="section-header">Underwriting Recommendations</div>
            
            <ul class="bullet-list">
              ${report.aiAnalysis.roofDamage.severity === 'severe' || report.aiAnalysis.roofDamage.severity === 'catastrophic' ? 
                '<li><strong>CRITICAL:</strong> Roof replacement required before policy issuance</li>' : ''}
              ${severeEvents.length > 2 ? 
                '<li>Consider higher deductibles due to elevated storm risk in area</li>' : ''}
              ${historicalAnalysis.fireRisk.riskLevel === 'high' || historicalAnalysis.fireRisk.riskLevel === 'extreme' ? 
                '<li>Fire-resistant roofing materials recommended; verify compliance</li>' : ''}
              ${historicalAnalysis.floodRisk.riskLevel !== 'minimal' ? 
                '<li>Flood insurance required or strongly recommended</li>' : ''}
              ${historicalAnalysis.insuranceClaims.claimsInArea > 300 ? 
                '<li>High claim frequency area - consider premium adjustments</li>' : ''}
              <li>Recommend annual roof inspections given regional weather patterns</li>
              <li>Verify proper maintenance and documentation of repairs</li>
              <li>Consider age of roof relative to regional replacement frequency</li>
            </ul>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 6</span>
          </div>
        </div>

        <!-- DATA SOURCES & DISCLAIMER PAGE -->
        <div class="page">
          <div class="page-header">
            <h1>Data Sources & Disclaimer</h1>
            <div class="report-id">Report Methodology</div>
          </div>

          <div class="section">
            <div class="section-header">Data Sources</div>
            
            <p style="margin-bottom: 15px; color: #424242;">
              This report was compiled using data from the following trusted sources:
            </p>
            
            <ul class="bullet-list">
              ${historicalAnalysis.dataSourcesUsed.map(source => `<li>${source}</li>`).join('')}
            </ul>

            <p style="margin-top: 20px; color: #757575; font-size: 10pt;">
              Data collection completed: ${historicalAnalysis.analyzedAt.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div class="section">
            <div class="section-header">Report Methodology</div>
            
            <p style="margin-bottom: 15px; color: #424242; line-height: 1.8;">
              This Insurance Verification Report combines historical weather data, regional risk assessments, 
              insurance claim statistics, and AI-powered property analysis to provide a comprehensive risk 
              profile for underwriting purposes. The report includes:
            </p>
            
            <ul class="bullet-list">
              <li>5-year historical storm event analysis with proximity calculations</li>
              <li>FEMA flood zone classification and risk assessment</li>
              <li>Fire risk evaluation based on regional data and property characteristics</li>
              <li>Insurance claim frequency and severity analysis for the area</li>
              <li>Historical weather pattern analysis and impact assessment</li>
              <li>Regional roof age patterns and replacement frequency data</li>
              <li>AI-powered roof condition analysis from uploaded inspection photos</li>
              <li>Multi-factor risk scoring across hail, wind, fire, and flood categories</li>
            </ul>
          </div>

          <div class="section">
            <div class="disclaimer-box">
              <div class="disclaimer-text">
                <strong>IMPORTANT DISCLAIMER:</strong><br><br>
                
                This report is provided for insurance underwriting and risk assessment purposes only. 
                While every effort has been made to ensure accuracy, this report should not be the sole 
                basis for insurance decisions. The information contained herein is compiled from publicly 
                available sources and AI analysis of provided images.<br><br>
                
                <strong>Limitations:</strong><br>
                • Historical data may not predict future events<br>
                • AI analysis confidence levels should be considered<br>
                • On-site professional inspection recommended for final assessment<br>
                • Regional data may not reflect property-specific conditions<br>
                • Insurance claim data may be incomplete or delayed<br><br>
                
                <strong>Recommendations:</strong><br>
                • Verify all findings with independent professional inspection<br>
                • Consult with licensed contractors for repair estimates<br>
                • Review current building codes and insurance requirements<br>
                • Consider additional risk mitigation measures as appropriate<br><br>
                
                This report is valid for 30 days from the date of generation. Property conditions and 
                risk factors may change over time. Regular updates and inspections are recommended.
              </div>
            </div>
          </div>

          <div class="page-footer">
            <span>${report.propertyAddress}</span>
            <span>Page 7</span>
          </div>
        </div>

        <!-- BACK COVER -->
        <div class="page" style="background: linear-gradient(135deg, #D32F2F 0%, #F44336 100%); color: white; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
          <div style="max-width: 500px;">
            <h2 style="font-size: 32pt; font-weight: 700; margin-bottom: 20px;">Insurance Verification Complete</h2>
            <p style="font-size: 14pt; opacity: 0.9; line-height: 1.8; margin-bottom: 40px;">
              This comprehensive historical analysis provides claims adjusters and underwriters with 
              the data needed for informed risk assessment and policy decisions.
            </p>
            
            <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); border-radius: 12px; padding: 30px; margin-top: 40px;">
              <p style="font-size: 12pt; margin-bottom: 10px;">Report ID: ${historicalAnalysis.id}</p>
              <p style="font-size: 12pt; margin-bottom: 10px;">Generated: ${currentDate}</p>
              <p style="font-size: 12pt;">Property: ${report.propertyAddress}</p>
            </div>

            <p style="font-size: 9pt; opacity: 0.7; margin-top: 40px;">
              © ${new Date().getFullYear()} Elite Property Inspections. All rights reserved.<br>
              For insurance and underwriting purposes only.
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
    console.log('Insurance Verification PDF generated at:', uri);
    
    // Share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Insurance Verification Report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      console.log('Sharing is not available on this platform');
    }
  } catch (error) {
    console.error('Error generating Insurance Verification PDF:', error);
    throw error;
  }
}
