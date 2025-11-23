
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InspectionData {
  id: string;
  property_address: string;
  inspection_date: string;
  overall_condition: string;
  ai_analysis: {
    roofDamage: {
      detected: boolean;
      severity: string;
      issues: string[];
      confidence: number;
    };
    structuralIssues: {
      detected: boolean;
      issues: string[];
      confidence: number;
    };
    solarCompatibility: {
      suitable: boolean;
      score: number;
      factors: string[];
      estimatedCapacity: string;
    };
    inspectionConcerns: {
      detected: boolean;
      concerns: string[];
      recommendations: string[];
    };
    overallCondition: string;
  };
  quote: {
    roofing: {
      estimatedCost: number;
      laborCost: number;
      materialCost: number;
      timeline: string;
    };
    solar: {
      estimatedCost: number;
      systemSize: string;
      estimatedSavings: number;
      paybackPeriod: string;
    };
    repairs: {
      estimatedCost: number;
      urgency: string;
      timeline: string;
    };
    totalEstimate: number;
  };
  roof_diagram?: {
    facets: Array<{
      id: string;
      label: string;
      area: number;
      pitch: number;
      measurements: {
        width: number;
        height: number;
        perimeter: number;
      };
    }>;
    totalArea: number;
  };
  notes?: string;
}

function getSeverityColor(severity: string): [number, number, number] {
  switch (severity) {
    case 'none': return [0.06, 0.73, 0.51]; // #10B981
    case 'minor': return [0.55, 0.76, 0.29]; // #8BC34A
    case 'moderate': return [0.96, 0.62, 0.04]; // #F59E0B
    case 'severe': return [0.94, 0.27, 0.27]; // #EF4444
    default: return [0.46, 0.46, 0.46]; // #757575
  }
}

function getConditionColor(condition: string): [number, number, number] {
  switch (condition) {
    case 'excellent': return [0.06, 0.73, 0.51]; // #10B981
    case 'good': return [0.55, 0.76, 0.29]; // #8BC34A
    case 'fair': return [0.96, 0.62, 0.04]; // #F59E0B
    case 'poor': return [0.94, 0.27, 0.27]; // #EF4444
    default: return [0.46, 0.46, 0.46]; // #757575
  }
}

async function generatePDF(inspection: InspectionData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612; // 8.5 inches
  const pageHeight = 792; // 11 inches
  const margin = 54; // 0.75 inches
  const contentWidth = pageWidth - (margin * 2);

  const primaryColor = rgb(0.15, 0.38, 0.92); // #2563EB
  const textColor = rgb(0.13, 0.13, 0.13); // #212121
  const secondaryTextColor = rgb(0.46, 0.46, 0.46); // #757575
  const backgroundColor = rgb(0.96, 0.96, 0.96); // #F5F5F5

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;
  let pageNumber = 1;

  // Helper function to add a new page
  const addNewPage = () => {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    yPosition = pageHeight - margin;
    pageNumber++;
  };

  // Helper function to draw page footer
  const drawPageFooter = (page: any, pageNum: number) => {
    page.drawLine({
      start: { x: margin, y: 54 },
      end: { x: pageWidth - margin, y: 54 },
      thickness: 1,
      color: rgb(0.88, 0.88, 0.88),
    });
    page.drawText(inspection.property_address, {
      x: margin,
      y: 36,
      size: 8,
      font: helveticaFont,
      color: secondaryTextColor,
    });
    page.drawText(`Page ${pageNum}`, {
      x: pageWidth - margin - 40,
      y: 36,
      size: 8,
      font: helveticaFont,
      color: secondaryTextColor,
    });
  };

  // Helper function to check if we need a new page
  const checkPageSpace = (requiredSpace: number) => {
    if (yPosition - requiredSpace < 80) {
      drawPageFooter(currentPage, pageNumber);
      addNewPage();
    }
  };

  // COVER PAGE
  currentPage.drawRectangle({
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    color: primaryColor,
  });

  // Logo placeholder
  currentPage.drawRectangle({
    x: (pageWidth - 120) / 2,
    y: pageHeight - 200,
    width: 120,
    height: 120,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.9, 0.9, 0.9),
    borderWidth: 2,
  });

  currentPage.drawText('🏠', {
    x: (pageWidth - 60) / 2,
    y: pageHeight - 150,
    size: 48,
    font: helveticaBold,
    color: primaryColor,
  });

  // Title
  currentPage.drawText('Property Inspection Report', {
    x: pageWidth / 2 - 200,
    y: pageHeight - 280,
    size: 32,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('AI-Powered Property Analysis', {
    x: pageWidth / 2 - 120,
    y: pageHeight - 320,
    size: 16,
    font: helveticaFont,
    color: rgb(0.95, 0.95, 0.95),
  });

  // Info box
  const infoBoxY = pageHeight - 550;
  currentPage.drawRectangle({
    x: (pageWidth - 400) / 2,
    y: infoBoxY,
    width: 400,
    height: 180,
    color: rgb(1, 1, 1),
    opacity: 0.15,
  });

  const infoStartY = infoBoxY + 140;
  currentPage.drawText('Property Address', {
    x: pageWidth / 2 - 180,
    y: infoStartY,
    size: 10,
    font: helveticaFont,
    color: rgb(0.9, 0.9, 0.9),
  });
  currentPage.drawText(inspection.property_address, {
    x: pageWidth / 2 - 180,
    y: infoStartY - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('Report ID', {
    x: pageWidth / 2 - 180,
    y: infoStartY - 60,
    size: 10,
    font: helveticaFont,
    color: rgb(0.9, 0.9, 0.9),
  });
  currentPage.drawText(inspection.id, {
    x: pageWidth / 2 - 180,
    y: infoStartY - 80,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('Inspection Date', {
    x: pageWidth / 2 - 180,
    y: infoStartY - 120,
    size: 10,
    font: helveticaFont,
    color: rgb(0.9, 0.9, 0.9),
  });
  const inspectionDate = new Date(inspection.inspection_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  currentPage.drawText(inspectionDate, {
    x: pageWidth / 2 - 180,
    y: infoStartY - 140,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // EXECUTIVE SUMMARY PAGE
  addNewPage();
  yPosition = pageHeight - margin;

  // Page header
  currentPage.drawText('Executive Summary', {
    x: margin,
    y: yPosition,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });
  yPosition -= 20;

  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 3,
    color: primaryColor,
  });
  yPosition -= 10;

  currentPage.drawText(`Report ID: ${inspection.id}`, {
    x: margin,
    y: yPosition,
    size: 9,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  yPosition -= 40;

  // Info cards
  const cardWidth = (contentWidth - 15) / 2;
  const cardHeight = 60;
  const cardY = yPosition;

  // Card 1: Overall Condition
  currentPage.drawRectangle({
    x: margin,
    y: cardY - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: backgroundColor,
  });
  currentPage.drawRectangle({
    x: margin,
    y: cardY - cardHeight,
    width: 4,
    height: cardHeight,
    color: primaryColor,
  });
  currentPage.drawText('OVERALL CONDITION', {
    x: margin + 15,
    y: cardY - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  const conditionColor = getConditionColor(inspection.overall_condition);
  currentPage.drawText(inspection.overall_condition.toUpperCase(), {
    x: margin + 15,
    y: cardY - 45,
    size: 14,
    font: helveticaBold,
    color: rgb(conditionColor[0], conditionColor[1], conditionColor[2]),
  });

  // Card 2: Total Estimate
  currentPage.drawRectangle({
    x: margin + cardWidth + 15,
    y: cardY - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: backgroundColor,
  });
  currentPage.drawRectangle({
    x: margin + cardWidth + 15,
    y: cardY - cardHeight,
    width: 4,
    height: cardHeight,
    color: primaryColor,
  });
  currentPage.drawText('TOTAL ESTIMATE', {
    x: margin + cardWidth + 30,
    y: cardY - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  currentPage.drawText(`$${inspection.quote.totalEstimate.toLocaleString()}`, {
    x: margin + cardWidth + 30,
    y: cardY - 45,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });

  yPosition -= cardHeight + 30;

  // Card 3: Roof Area
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: backgroundColor,
  });
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - cardHeight,
    width: 4,
    height: cardHeight,
    color: primaryColor,
  });
  currentPage.drawText('ROOF AREA', {
    x: margin + 15,
    y: yPosition - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  const roofArea = inspection.roof_diagram?.totalArea || 2000;
  currentPage.drawText(`${roofArea.toFixed(0)} sq ft`, {
    x: margin + 15,
    y: yPosition - 45,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });

  // Card 4: Damage Status
  currentPage.drawRectangle({
    x: margin + cardWidth + 15,
    y: yPosition - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: backgroundColor,
  });
  currentPage.drawRectangle({
    x: margin + cardWidth + 15,
    y: yPosition - cardHeight,
    width: 4,
    height: cardHeight,
    color: primaryColor,
  });
  currentPage.drawText('DAMAGE DETECTED', {
    x: margin + cardWidth + 30,
    y: yPosition - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  currentPage.drawText(inspection.ai_analysis.roofDamage.detected ? 'YES' : 'NO', {
    x: margin + cardWidth + 30,
    y: yPosition - 45,
    size: 14,
    font: helveticaBold,
    color: inspection.ai_analysis.roofDamage.detected ? rgb(0.94, 0.27, 0.27) : rgb(0.06, 0.73, 0.51),
  });

  yPosition -= cardHeight + 40;

  // Key Findings
  checkPageSpace(150);
  currentPage.drawText('Key Findings', {
    x: margin,
    y: yPosition,
    size: 13,
    font: helveticaBold,
    color: textColor,
  });
  yPosition -= 10;
  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 2,
    color: rgb(0.88, 0.88, 0.88),
  });
  yPosition -= 20;

  const findings = [
    `Roof Condition: ${inspection.ai_analysis.roofDamage.detected ? `Damage detected (${inspection.ai_analysis.roofDamage.severity} severity)` : 'No significant damage detected'}`,
    `Structural Assessment: ${inspection.ai_analysis.structuralIssues.detected ? `${inspection.ai_analysis.structuralIssues.issues.length} issue(s) identified` : 'No structural issues detected'}`,
    `Solar Compatibility: ${inspection.ai_analysis.solarCompatibility.suitable ? `Suitable (Score: ${inspection.ai_analysis.solarCompatibility.score.toFixed(0)}/100)` : 'Not recommended at this time'}`,
    `Recommended Action: ${inspection.quote.repairs.urgency === 'high' ? 'Immediate attention required' : inspection.quote.repairs.urgency === 'medium' ? 'Schedule repairs within 30 days' : 'Routine maintenance recommended'}`,
  ];

  for (const finding of findings) {
    checkPageSpace(25);
    currentPage.drawText('•', {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: primaryColor,
    });
    currentPage.drawText(finding, {
      x: margin + 15,
      y: yPosition,
      size: 11,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 20;
  }

  drawPageFooter(currentPage, pageNumber);

  // AI FINDINGS PAGE
  addNewPage();
  yPosition = pageHeight - margin;

  currentPage.drawText('AI Analysis & Findings', {
    x: margin,
    y: yPosition,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });
  yPosition -= 20;
  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 3,
    color: primaryColor,
  });
  yPosition -= 10;
  currentPage.drawText('Powered by Advanced Computer Vision', {
    x: margin,
    y: yPosition,
    size: 9,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  yPosition -= 40;

  // Roof Damage Assessment Section
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('🏠 Roof Damage Assessment', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  const damageStatus = inspection.ai_analysis.roofDamage.detected ? 'DAMAGE DETECTED' : 'NO DAMAGE DETECTED';
  const damageColor = inspection.ai_analysis.roofDamage.detected ? rgb(0.94, 0.27, 0.27) : rgb(0.06, 0.73, 0.51);
  currentPage.drawText(damageStatus, {
    x: margin,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: damageColor,
  });
  yPosition -= 25;

  if (inspection.ai_analysis.roofDamage.detected) {
    const severityColor = getSeverityColor(inspection.ai_analysis.roofDamage.severity);
    currentPage.drawText(`Severity: ${inspection.ai_analysis.roofDamage.severity.toUpperCase()}`, {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: rgb(severityColor[0], severityColor[1], severityColor[2]),
    });
    yPosition -= 30;

    if (inspection.ai_analysis.roofDamage.issues.length > 0) {
      currentPage.drawText('Issues Identified:', {
        x: margin,
        y: yPosition,
        size: 11,
        font: helveticaBold,
        color: textColor,
      });
      yPosition -= 20;

      for (const issue of inspection.ai_analysis.roofDamage.issues) {
        checkPageSpace(25);
        currentPage.drawText('•', {
          x: margin,
          y: yPosition,
          size: 11,
          font: helveticaBold,
          color: primaryColor,
        });
        currentPage.drawText(issue, {
          x: margin + 15,
          y: yPosition,
          size: 10,
          font: helveticaFont,
          color: textColor,
        });
        yPosition -= 18;
      }
    }
  } else {
    currentPage.drawText('No significant roof damage detected during analysis.', {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 25;
  }

  currentPage.drawText(`AI Confidence Level: ${(inspection.ai_analysis.roofDamage.confidence * 100).toFixed(1)}%`, {
    x: margin,
    y: yPosition,
    size: 9,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  yPosition -= 40;

  // Structural Issues Section
  checkPageSpace(150);
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('🏗️ Structural Issues', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  const structuralStatus = inspection.ai_analysis.structuralIssues.detected ? 'ISSUES DETECTED' : 'NO ISSUES DETECTED';
  const structuralColor = inspection.ai_analysis.structuralIssues.detected ? rgb(0.94, 0.27, 0.27) : rgb(0.06, 0.73, 0.51);
  currentPage.drawText(structuralStatus, {
    x: margin,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: structuralColor,
  });
  yPosition -= 25;

  if (inspection.ai_analysis.structuralIssues.detected && inspection.ai_analysis.structuralIssues.issues.length > 0) {
    for (const issue of inspection.ai_analysis.structuralIssues.issues) {
      checkPageSpace(25);
      currentPage.drawText('•', {
        x: margin,
        y: yPosition,
        size: 11,
        font: helveticaBold,
        color: primaryColor,
      });
      currentPage.drawText(issue, {
        x: margin + 15,
        y: yPosition,
        size: 10,
        font: helveticaFont,
        color: textColor,
      });
      yPosition -= 18;
    }
  } else {
    currentPage.drawText('No structural issues detected during analysis.', {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 25;
  }

  currentPage.drawText(`AI Confidence Level: ${(inspection.ai_analysis.structuralIssues.confidence * 100).toFixed(1)}%`, {
    x: margin,
    y: yPosition,
    size: 9,
    font: helveticaFont,
    color: secondaryTextColor,
  });

  drawPageFooter(currentPage, pageNumber);

  // SOLAR COMPATIBILITY PAGE
  addNewPage();
  yPosition = pageHeight - margin;

  currentPage.drawText('Solar Compatibility Analysis', {
    x: margin,
    y: yPosition,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });
  yPosition -= 20;
  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 3,
    color: primaryColor,
  });
  yPosition -= 40;

  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('☀️ Solar Compatibility', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  const solarStatus = inspection.ai_analysis.solarCompatibility.suitable ? 'SUITABLE FOR SOLAR' : 'NOT SUITABLE';
  const solarColor = inspection.ai_analysis.solarCompatibility.suitable ? rgb(0.06, 0.73, 0.51) : rgb(0.46, 0.46, 0.46);
  currentPage.drawText(solarStatus, {
    x: margin,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: solarColor,
  });
  yPosition -= 40;

  // Solar info cards
  const solarCardY = yPosition;
  currentPage.drawRectangle({
    x: margin,
    y: solarCardY - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: backgroundColor,
  });
  currentPage.drawRectangle({
    x: margin,
    y: solarCardY - cardHeight,
    width: 4,
    height: cardHeight,
    color: primaryColor,
  });
  currentPage.drawText('COMPATIBILITY SCORE', {
    x: margin + 15,
    y: solarCardY - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  currentPage.drawText(`${inspection.ai_analysis.solarCompatibility.score.toFixed(0)}/100`, {
    x: margin + 15,
    y: solarCardY - 45,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });

  currentPage.drawRectangle({
    x: margin + cardWidth + 15,
    y: solarCardY - cardHeight,
    width: cardWidth,
    height: cardHeight,
    color: backgroundColor,
  });
  currentPage.drawRectangle({
    x: margin + cardWidth + 15,
    y: solarCardY - cardHeight,
    width: 4,
    height: cardHeight,
    color: primaryColor,
  });
  currentPage.drawText('ESTIMATED CAPACITY', {
    x: margin + cardWidth + 30,
    y: solarCardY - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  currentPage.drawText(inspection.ai_analysis.solarCompatibility.estimatedCapacity, {
    x: margin + cardWidth + 30,
    y: solarCardY - 45,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });

  yPosition -= cardHeight + 30;

  currentPage.drawText('Assessment Factors:', {
    x: margin,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  yPosition -= 20;

  for (const factor of inspection.ai_analysis.solarCompatibility.factors) {
    checkPageSpace(25);
    currentPage.drawText('•', {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: primaryColor,
    });
    currentPage.drawText(factor, {
      x: margin + 15,
      y: yPosition,
      size: 10,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 18;
  }

  yPosition -= 20;

  // Inspection Concerns Section
  checkPageSpace(150);
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('⚠️ Inspection Concerns & Recommendations', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  currentPage.drawText('Identified Concerns:', {
    x: margin,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  yPosition -= 20;

  for (const concern of inspection.ai_analysis.inspectionConcerns.concerns) {
    checkPageSpace(25);
    currentPage.drawText('•', {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: primaryColor,
    });
    currentPage.drawText(concern, {
      x: margin + 15,
      y: yPosition,
      size: 10,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 18;
  }

  yPosition -= 20;
  checkPageSpace(100);

  currentPage.drawText('Professional Recommendations:', {
    x: margin,
    y: yPosition,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  yPosition -= 20;

  for (const rec of inspection.ai_analysis.inspectionConcerns.recommendations) {
    checkPageSpace(25);
    currentPage.drawText('•', {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: primaryColor,
    });
    currentPage.drawText(rec, {
      x: margin + 15,
      y: yPosition,
      size: 10,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 18;
  }

  drawPageFooter(currentPage, pageNumber);

  // ROOF MEASUREMENTS PAGE (if available)
  if (inspection.roof_diagram && inspection.roof_diagram.facets.length > 0) {
    addNewPage();
    yPosition = pageHeight - margin;

    currentPage.drawText('Roof Measurements & Facets', {
      x: margin,
      y: yPosition,
      size: 24,
      font: helveticaBold,
      color: primaryColor,
    });
    yPosition -= 20;
    currentPage.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: pageWidth - margin, y: yPosition },
      thickness: 3,
      color: primaryColor,
    });
    yPosition -= 10;
    currentPage.drawText('Detailed Facet Analysis', {
      x: margin,
      y: yPosition,
      size: 9,
      font: helveticaFont,
      color: secondaryTextColor,
    });
    yPosition -= 40;

    // Roof info cards
    const roofCardY = yPosition;
    currentPage.drawRectangle({
      x: margin,
      y: roofCardY - cardHeight,
      width: cardWidth,
      height: cardHeight,
      color: backgroundColor,
    });
    currentPage.drawRectangle({
      x: margin,
      y: roofCardY - cardHeight,
      width: 4,
      height: cardHeight,
      color: primaryColor,
    });
    currentPage.drawText('TOTAL ROOF AREA', {
      x: margin + 15,
      y: roofCardY - 20,
      size: 9,
      font: helveticaBold,
      color: secondaryTextColor,
    });
    currentPage.drawText(`${inspection.roof_diagram.totalArea.toFixed(2)} sq ft`, {
      x: margin + 15,
      y: roofCardY - 45,
      size: 14,
      font: helveticaBold,
      color: textColor,
    });

    currentPage.drawRectangle({
      x: margin + cardWidth + 15,
      y: roofCardY - cardHeight,
      width: cardWidth,
      height: cardHeight,
      color: backgroundColor,
    });
    currentPage.drawRectangle({
      x: margin + cardWidth + 15,
      y: roofCardY - cardHeight,
      width: 4,
      height: cardHeight,
      color: primaryColor,
    });
    currentPage.drawText('NUMBER OF FACETS', {
      x: margin + cardWidth + 30,
      y: roofCardY - 20,
      size: 9,
      font: helveticaBold,
      color: secondaryTextColor,
    });
    currentPage.drawText(`${inspection.roof_diagram.facets.length}`, {
      x: margin + cardWidth + 30,
      y: roofCardY - 45,
      size: 14,
      font: helveticaBold,
      color: textColor,
    });

    yPosition -= cardHeight + 40;

    // Facet table header
    checkPageSpace(200);
    currentPage.drawText('Facet Details', {
      x: margin,
      y: yPosition,
      size: 13,
      font: helveticaBold,
      color: textColor,
    });
    yPosition -= 10;
    currentPage.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: pageWidth - margin, y: yPosition },
      thickness: 2,
      color: rgb(0.88, 0.88, 0.88),
    });
    yPosition -= 25;

    // Table header
    currentPage.drawRectangle({
      x: margin,
      y: yPosition - 20,
      width: contentWidth,
      height: 20,
      color: primaryColor,
    });
    currentPage.drawText('Facet', {
      x: margin + 5,
      y: yPosition - 15,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    currentPage.drawText('Area (sq ft)', {
      x: margin + 120,
      y: yPosition - 15,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    currentPage.drawText('Pitch', {
      x: margin + 220,
      y: yPosition - 15,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    currentPage.drawText('Dimensions', {
      x: margin + 300,
      y: yPosition - 15,
      size: 10,
      font: helveticaBold,
      color: rgb(1, 1, 1),
    });
    yPosition -= 25;

    // Table rows
    let rowIndex = 0;
    for (const facet of inspection.roof_diagram.facets) {
      checkPageSpace(30);
      
      if (rowIndex % 2 === 0) {
        currentPage.drawRectangle({
          x: margin,
          y: yPosition - 20,
          width: contentWidth,
          height: 20,
          color: rgb(0.98, 0.98, 0.98),
        });
      }

      currentPage.drawText(facet.label, {
        x: margin + 5,
        y: yPosition - 15,
        size: 10,
        font: helveticaBold,
        color: textColor,
      });
      currentPage.drawText(facet.area.toFixed(2), {
        x: margin + 120,
        y: yPosition - 15,
        size: 10,
        font: helveticaFont,
        color: textColor,
      });
      currentPage.drawText(`${facet.pitch}:12`, {
        x: margin + 220,
        y: yPosition - 15,
        size: 10,
        font: helveticaFont,
        color: textColor,
      });
      currentPage.drawText(`${facet.measurements.width.toFixed(1)}' × ${facet.measurements.height.toFixed(1)}'`, {
        x: margin + 300,
        y: yPosition - 15,
        size: 10,
        font: helveticaFont,
        color: textColor,
      });

      yPosition -= 25;
      rowIndex++;
    }

    // Total row
    currentPage.drawRectangle({
      x: margin,
      y: yPosition - 20,
      width: contentWidth,
      height: 20,
      color: rgb(0.89, 0.95, 0.99),
    });
    currentPage.drawText('TOTAL', {
      x: margin + 5,
      y: yPosition - 15,
      size: 10,
      font: helveticaBold,
      color: textColor,
    });
    currentPage.drawText(inspection.roof_diagram.totalArea.toFixed(2), {
      x: margin + 120,
      y: yPosition - 15,
      size: 10,
      font: helveticaBold,
      color: textColor,
    });

    drawPageFooter(currentPage, pageNumber);
  }

  // QUOTE PAGE
  addNewPage();
  yPosition = pageHeight - margin;

  currentPage.drawText('Instant Quote Overview', {
    x: margin,
    y: yPosition,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });
  yPosition -= 20;
  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 3,
    color: primaryColor,
  });
  yPosition -= 10;
  currentPage.drawText('Detailed Cost Breakdown', {
    x: margin,
    y: yPosition,
    size: 9,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  yPosition -= 40;

  // Roofing Services
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('💰 Roofing Services', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  const quoteBoxHeight = 120;
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - quoteBoxHeight,
    width: contentWidth,
    height: quoteBoxHeight,
    color: backgroundColor,
  });

  let quoteY = yPosition - 20;
  currentPage.drawText('Material Cost', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(`$${inspection.quote.roofing.materialCost.toLocaleString()}`, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  quoteY -= 25;

  currentPage.drawText('Labor Cost', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(`$${inspection.quote.roofing.laborCost.toLocaleString()}`, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  quoteY -= 25;

  currentPage.drawText('Timeline', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(inspection.quote.roofing.timeline, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  quoteY -= 30;

  currentPage.drawLine({
    start: { x: margin + 15, y: quoteY },
    end: { x: pageWidth - margin - 15, y: quoteY },
    thickness: 2,
    color: primaryColor,
  });
  quoteY -= 20;

  currentPage.drawText('Roofing Total', {
    x: margin + 15,
    y: quoteY,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });
  currentPage.drawText(`$${inspection.quote.roofing.estimatedCost.toLocaleString()}`, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 14,
    font: helveticaBold,
    color: primaryColor,
  });

  yPosition -= quoteBoxHeight + 30;

  // Solar Installation
  checkPageSpace(200);
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('☀️ Solar Installation', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  currentPage.drawRectangle({
    x: margin,
    y: yPosition - quoteBoxHeight,
    width: contentWidth,
    height: quoteBoxHeight,
    color: backgroundColor,
  });

  quoteY = yPosition - 20;
  currentPage.drawText('System Size', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(inspection.quote.solar.systemSize, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  quoteY -= 25;

  currentPage.drawText('Installation Cost', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(`$${inspection.quote.solar.estimatedCost.toLocaleString()}`, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  quoteY -= 25;

  currentPage.drawText('Annual Savings', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(`$${inspection.quote.solar.estimatedSavings.toLocaleString()}/year`, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  quoteY -= 25;

  currentPage.drawText('Payback Period', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(inspection.quote.solar.paybackPeriod, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });

  yPosition -= quoteBoxHeight + 30;

  // Repairs & Maintenance
  checkPageSpace(150);
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('🔧 Repairs & Maintenance', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  const repairBoxHeight = 90;
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - repairBoxHeight,
    width: contentWidth,
    height: repairBoxHeight,
    color: backgroundColor,
  });

  quoteY = yPosition - 20;
  currentPage.drawText('Repair Cost', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(`$${inspection.quote.repairs.estimatedCost.toLocaleString()}`, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });
  quoteY -= 25;

  currentPage.drawText('Urgency Level', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(inspection.quote.repairs.urgency.toUpperCase(), {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: inspection.quote.repairs.urgency === 'high' ? rgb(0.94, 0.27, 0.27) : inspection.quote.repairs.urgency === 'medium' ? rgb(0.96, 0.62, 0.04) : rgb(0.06, 0.73, 0.51),
  });
  quoteY -= 25;

  currentPage.drawText('Timeline', {
    x: margin + 15,
    y: quoteY,
    size: 11,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  currentPage.drawText(inspection.quote.repairs.timeline, {
    x: pageWidth - margin - 100,
    y: quoteY,
    size: 11,
    font: helveticaBold,
    color: textColor,
  });

  yPosition -= repairBoxHeight + 30;

  // Total Estimate
  checkPageSpace(80);
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 60,
    width: contentWidth,
    height: 60,
    color: primaryColor,
  });
  currentPage.drawText('TOTAL PROJECT ESTIMATE', {
    x: margin + 15,
    y: yPosition - 25,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  currentPage.drawText(`$${inspection.quote.totalEstimate.toLocaleString()}`, {
    x: pageWidth - margin - 150,
    y: yPosition - 30,
    size: 24,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  yPosition -= 80;

  currentPage.drawText('*Estimates are subject to final inspection and may vary based on material selection and site conditions', {
    x: pageWidth / 2 - 220,
    y: yPosition,
    size: 9,
    font: helveticaFont,
    color: secondaryTextColor,
  });

  drawPageFooter(currentPage, pageNumber);

  // DISCLAIMER PAGE
  addNewPage();
  yPosition = pageHeight - margin;

  currentPage.drawText('Disclaimer & Terms', {
    x: margin,
    y: yPosition,
    size: 24,
    font: helveticaBold,
    color: primaryColor,
  });
  yPosition -= 20;
  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 3,
    color: primaryColor,
  });
  yPosition -= 40;

  // Disclaimer box
  const disclaimerBoxHeight = 120;
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - disclaimerBoxHeight,
    width: contentWidth,
    height: disclaimerBoxHeight,
    color: rgb(1, 0.98, 0.9),
  });
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - disclaimerBoxHeight,
    width: 4,
    height: disclaimerBoxHeight,
    color: rgb(0.96, 0.62, 0.04),
  });

  currentPage.drawText('Important Notice', {
    x: margin + 15,
    y: yPosition - 20,
    size: 12,
    font: helveticaBold,
    color: textColor,
  });

  const disclaimerText = [
    'This inspection report is generated using advanced AI-powered analysis technology and includes',
    'roof measurements derived from advanced aerial imagery. While our AI systems and measurement',
    'tools are highly accurate, this report should not replace a comprehensive on-site inspection by',
    'a licensed professional.',
  ];

  let disclaimerY = yPosition - 45;
  for (const line of disclaimerText) {
    currentPage.drawText(line, {
      x: margin + 15,
      y: disclaimerY,
      size: 9,
      font: helveticaFont,
      color: rgb(0.26, 0.26, 0.26),
    });
    disclaimerY -= 15;
  }

  yPosition -= disclaimerBoxHeight + 30;

  // Terms & Conditions
  currentPage.drawText('Terms & Conditions', {
    x: margin,
    y: yPosition,
    size: 13,
    font: helveticaBold,
    color: textColor,
  });
  yPosition -= 10;
  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 2,
    color: rgb(0.88, 0.88, 0.88),
  });
  yPosition -= 20;

  const terms = [
    'All estimates are preliminary and subject to change based on detailed on-site inspection',
    'Roof measurements are derived from advanced aerial imagery with a 10:1 pixel-to-foot scale',
    'AI analysis confidence levels are provided for transparency and should be considered when making decisions',
    'Actual costs may vary based on material selection, labor rates, and unforeseen conditions',
    'This report is valid for 30 days from the date of generation',
    'Recommended repairs should be performed by licensed and insured contractors',
    'Solar compatibility assessments are based on visual analysis and may require additional engineering review',
  ];

  for (const term of terms) {
    checkPageSpace(25);
    currentPage.drawText('•', {
      x: margin,
      y: yPosition,
      size: 9,
      font: helveticaBold,
      color: primaryColor,
    });
    currentPage.drawText(term, {
      x: margin + 15,
      y: yPosition,
      size: 9,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 18;
  }

  yPosition -= 20;
  checkPageSpace(100);

  currentPage.drawText('Liability Limitation', {
    x: margin,
    y: yPosition,
    size: 13,
    font: helveticaBold,
    color: textColor,
  });
  yPosition -= 10;
  currentPage.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: pageWidth - margin, y: yPosition },
    thickness: 2,
    color: rgb(0.88, 0.88, 0.88),
  });
  yPosition -= 20;

  const liabilityText = [
    'The information contained in this report is provided "as is" without warranty of any kind.',
    'The company and its AI systems make no representations or warranties regarding the accuracy,',
    'completeness, or suitability of the information for any particular purpose. Users should',
    'consult with qualified professionals before making any decisions based on this report.',
  ];

  for (const line of liabilityText) {
    checkPageSpace(20);
    currentPage.drawText(line, {
      x: margin,
      y: yPosition,
      size: 9,
      font: helveticaFont,
      color: secondaryTextColor,
    });
    yPosition -= 15;
  }

  drawPageFooter(currentPage, pageNumber);

  // Save and return PDF
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { inspectionId } = await req.json();

    if (!inspectionId) {
      throw new Error('Missing inspectionId');
    }

    // Fetch inspection data from database
    const { data: inspection, error: fetchError } = await supabaseClient
      .from('inspections')
      .select('*')
      .eq('id', inspectionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !inspection) {
      throw new Error('Inspection not found');
    }

    console.log('Generating PDF for inspection:', inspectionId);

    // Generate PDF
    const pdfBytes = await generatePDF(inspection);

    console.log('PDF generated successfully, size:', pdfBytes.length);

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="inspection-report-${inspectionId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
