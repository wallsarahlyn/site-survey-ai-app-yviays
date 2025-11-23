
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { InspectionReport } from '@/types/inspection';

export async function generateInspectionPDF(report: InspectionReport): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            padding: 40px;
            color: #212121;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2962FF;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2962FF;
            margin: 0;
            font-size: 32px;
          }
          .header p {
            color: #757575;
            margin: 5px 0;
          }
          .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          .section h2 {
            color: #2962FF;
            border-bottom: 2px solid #E0E0E0;
            padding-bottom: 10px;
            margin-bottom: 15px;
          }
          .section h3 {
            color: #212121;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          .info-item {
            background: #F5F5F5;
            padding: 15px;
            border-radius: 8px;
          }
          .info-item label {
            font-weight: 600;
            color: #757575;
            font-size: 12px;
            text-transform: uppercase;
            display: block;
            margin-bottom: 5px;
          }
          .info-item value {
            color: #212121;
            font-size: 16px;
            font-weight: 500;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin: 5px 5px 5px 0;
          }
          .status-excellent { background: #4CAF50; color: white; }
          .status-good { background: #8BC34A; color: white; }
          .status-fair { background: #FFAB40; color: white; }
          .status-poor { background: #F44336; color: white; }
          .status-detected { background: #F44336; color: white; }
          .status-clear { background: #4CAF50; color: white; }
          .status-suitable { background: #4CAF50; color: white; }
          .status-unsuitable { background: #757575; color: white; }
          ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          li {
            margin: 8px 0;
          }
          .quote-section {
            background: #F5F5F5;
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
          }
          .quote-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #E0E0E0;
          }
          .quote-item:last-child {
            border-bottom: none;
            font-weight: 700;
            font-size: 18px;
            color: #2962FF;
            padding-top: 20px;
            margin-top: 10px;
            border-top: 2px solid #2962FF;
          }
          .quote-label {
            color: #757575;
          }
          .quote-value {
            color: #212121;
            font-weight: 600;
          }
          .image-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 20px;
          }
          .image-placeholder {
            background: #E0E0E0;
            height: 200px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #757575;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #E0E0E0;
            text-align: center;
            color: #757575;
            font-size: 12px;
          }
          .confidence {
            font-size: 12px;
            color: #757575;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Property Inspection Report</h1>
          <p><strong>Report ID:</strong> ${report.id}</p>
          <p><strong>Inspection Date:</strong> ${report.inspectionDate.toLocaleDateString()}</p>
          <p><strong>Property Address:</strong> ${report.propertyAddress}</p>
        </div>

        <div class="section">
          <h2>Executive Summary</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Overall Condition</label>
              <value>
                <span class="status-badge status-${report.aiAnalysis.overallCondition}">
                  ${report.aiAnalysis.overallCondition.toUpperCase()}
                </span>
              </value>
            </div>
            <div class="info-item">
              <label>Total Estimate</label>
              <value>$${report.quote.totalEstimate.toLocaleString()}</value>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>AI Analysis Results</h2>
          
          <h3>Roof Damage Assessment</h3>
          <span class="status-badge ${report.aiAnalysis.roofDamage.detected ? 'status-detected' : 'status-clear'}">
            ${report.aiAnalysis.roofDamage.detected ? 'DAMAGE DETECTED' : 'NO DAMAGE DETECTED'}
          </span>
          ${report.aiAnalysis.roofDamage.detected ? `
            <p><strong>Severity:</strong> ${report.aiAnalysis.roofDamage.severity.toUpperCase()}</p>
            <p><strong>Issues Identified:</strong></p>
            <ul>
              ${report.aiAnalysis.roofDamage.issues.map(issue => `<li>${issue}</li>`).join('')}
            </ul>
          ` : '<p>No significant roof damage detected.</p>'}
          <p class="confidence">Confidence: ${(report.aiAnalysis.roofDamage.confidence * 100).toFixed(1)}%</p>

          <h3>Structural Issues</h3>
          <span class="status-badge ${report.aiAnalysis.structuralIssues.detected ? 'status-detected' : 'status-clear'}">
            ${report.aiAnalysis.structuralIssues.detected ? 'ISSUES DETECTED' : 'NO ISSUES DETECTED'}
          </span>
          ${report.aiAnalysis.structuralIssues.detected ? `
            <ul>
              ${report.aiAnalysis.structuralIssues.issues.map(issue => `<li>${issue}</li>`).join('')}
            </ul>
          ` : '<p>No structural issues detected.</p>'}
          <p class="confidence">Confidence: ${(report.aiAnalysis.structuralIssues.confidence * 100).toFixed(1)}%</p>

          <h3>Solar Compatibility</h3>
          <span class="status-badge ${report.aiAnalysis.solarCompatibility.suitable ? 'status-suitable' : 'status-unsuitable'}">
            ${report.aiAnalysis.solarCompatibility.suitable ? 'SUITABLE' : 'NOT SUITABLE'}
          </span>
          <p><strong>Compatibility Score:</strong> ${report.aiAnalysis.solarCompatibility.score.toFixed(1)}/100</p>
          <p><strong>Estimated Capacity:</strong> ${report.aiAnalysis.solarCompatibility.estimatedCapacity}</p>
          <p><strong>Factors:</strong></p>
          <ul>
            ${report.aiAnalysis.solarCompatibility.factors.map(factor => `<li>${factor}</li>`).join('')}
          </ul>

          <h3>Inspection Concerns & Recommendations</h3>
          <p><strong>Concerns:</strong></p>
          <ul>
            ${report.aiAnalysis.inspectionConcerns.concerns.map(concern => `<li>${concern}</li>`).join('')}
          </ul>
          <p><strong>Recommendations:</strong></p>
          <ul>
            ${report.aiAnalysis.inspectionConcerns.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>

        ${report.roofDiagram ? `
          <div class="section">
            <h2>Roof Diagram & Measurements</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Total Roof Area</label>
                <value>${report.roofDiagram.totalArea.toFixed(2)} sq ft</value>
              </div>
              <div class="info-item">
                <label>Number of Facets</label>
                <value>${report.roofDiagram.facets.length}</value>
              </div>
            </div>
            <h3>Facet Details</h3>
            ${report.roofDiagram.facets.map((facet, index) => `
              <div style="margin: 15px 0; padding: 15px; background: #F5F5F5; border-radius: 8px;">
                <p><strong>${facet.label || `Facet ${index + 1}`}</strong></p>
                <p>Area: ${facet.area.toFixed(2)} sq ft | Pitch: ${facet.pitch}:12</p>
                <p>Dimensions: ${facet.measurements.width.toFixed(1)}' × ${facet.measurements.height.toFixed(1)}'</p>
                <p>Perimeter: ${facet.measurements.perimeter.toFixed(1)}'</p>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <div class="section">
          <h2>Service Quote</h2>
          
          <h3>Roofing Services</h3>
          <div class="quote-section">
            <div class="quote-item">
              <span class="quote-label">Material Cost</span>
              <span class="quote-value">$${report.quote.roofing.materialCost.toLocaleString()}</span>
            </div>
            <div class="quote-item">
              <span class="quote-label">Labor Cost</span>
              <span class="quote-value">$${report.quote.roofing.laborCost.toLocaleString()}</span>
            </div>
            <div class="quote-item">
              <span class="quote-label">Estimated Timeline</span>
              <span class="quote-value">${report.quote.roofing.timeline}</span>
            </div>
            <div class="quote-item">
              <span class="quote-label">Roofing Total</span>
              <span class="quote-value">$${report.quote.roofing.estimatedCost.toLocaleString()}</span>
            </div>
          </div>

          <h3>Solar Installation</h3>
          <div class="quote-section">
            <div class="quote-item">
              <span class="quote-label">System Size</span>
              <span class="quote-value">${report.quote.solar.systemSize}</span>
            </div>
            <div class="quote-item">
              <span class="quote-label">Installation Cost</span>
              <span class="quote-value">$${report.quote.solar.estimatedCost.toLocaleString()}</span>
            </div>
            <div class="quote-item">
              <span class="quote-label">Estimated Annual Savings</span>
              <span class="quote-value">$${report.quote.solar.estimatedSavings.toLocaleString()}</span>
            </div>
            <div class="quote-item">
              <span class="quote-label">Payback Period</span>
              <span class="quote-value">${report.quote.solar.paybackPeriod}</span>
            </div>
          </div>

          <h3>Repairs</h3>
          <div class="quote-section">
            <div class="quote-item">
              <span class="quote-label">Repair Cost</span>
              <span class="quote-value">$${report.quote.repairs.estimatedCost.toLocaleString()}</span>
            </div>
            <div class="quote-item">
              <span class="quote-label">Urgency</span>
              <span class="quote-value">${report.quote.repairs.urgency.toUpperCase()}</span>
            </div>
            <div class="quote-item">
              <span class="quote-label">Timeline</span>
              <span class="quote-value">${report.quote.repairs.timeline}</span>
            </div>
          </div>

          <div class="quote-section" style="margin-top: 30px;">
            <div class="quote-item">
              <span class="quote-label">TOTAL ESTIMATE</span>
              <span class="quote-value">$${report.quote.totalEstimate.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Uploaded Images</h2>
          <p>${report.images.length} image(s) analyzed</p>
          <div class="image-grid">
            ${report.images.map((img, index) => `
              <div class="image-placeholder">
                Image ${index + 1}: ${img.fileName}
              </div>
            `).join('')}
          </div>
        </div>

        ${report.notes ? `
          <div class="section">
            <h2>Additional Notes</h2>
            <p>${report.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>This report was generated using AI-powered analysis technology.</p>
          <p>For questions or to schedule services, please contact our team.</p>
          <p>Report generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html });
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
