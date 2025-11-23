
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
  ai_analysis: any;
  quote: any;
  roof_diagram?: any;
}

interface HistoricalAnalysisData {
  id: string;
  address: string;
  storm_events: any;
  fire_risk: any;
  flood_risk: any;
  insurance_claims: any;
  weather_patterns: any;
  roof_age_patterns: any;
  risk_scores: any;
  ai_summary: string;
  data_sources_used: string[];
  analyzed_at: string;
}

function getRiskColor(level: string): [number, number, number] {
  switch (level.toLowerCase()) {
    case 'low': return [0.06, 0.73, 0.51]; // #10B981
    case 'moderate': return [0.96, 0.62, 0.04]; // #F59E0B
    case 'high': return [0.94, 0.27, 0.27]; // #EF4444
    case 'very high': return [0.72, 0.11, 0.11]; // #B91C1C
    default: return [0.46, 0.46, 0.46]; // #757575
  }
}

async function generateInsurancePDF(
  inspection: InspectionData,
  historicalAnalysis: HistoricalAnalysisData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 54;
  const contentWidth = pageWidth - (margin * 2);

  const primaryColor = rgb(0.15, 0.38, 0.92);
  const textColor = rgb(0.13, 0.13, 0.13);
  const secondaryTextColor = rgb(0.46, 0.46, 0.46);
  const backgroundColor = rgb(0.96, 0.96, 0.96);

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - margin;
  let pageNumber = 1;

  const addNewPage = () => {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    yPosition = pageHeight - margin;
    pageNumber++;
  };

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

  currentPage.drawRectangle({
    x: (pageWidth - 120) / 2,
    y: pageHeight - 200,
    width: 120,
    height: 120,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.9, 0.9, 0.9),
    borderWidth: 2,
  });

  currentPage.drawText('🛡️', {
    x: (pageWidth - 60) / 2,
    y: pageHeight - 150,
    size: 48,
    font: helveticaBold,
    color: primaryColor,
  });

  currentPage.drawText('Insurance Verification Report', {
    x: pageWidth / 2 - 220,
    y: pageHeight - 280,
    size: 32,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('Historical Risk Analysis & Property Assessment', {
    x: pageWidth / 2 - 180,
    y: pageHeight - 320,
    size: 14,
    font: helveticaFont,
    color: rgb(0.95, 0.95, 0.95),
  });

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
  currentPage.drawText(historicalAnalysis.id, {
    x: pageWidth / 2 - 180,
    y: infoStartY - 80,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('Analysis Date', {
    x: pageWidth / 2 - 180,
    y: infoStartY - 120,
    size: 10,
    font: helveticaFont,
    color: rgb(0.9, 0.9, 0.9),
  });
  const analysisDate = new Date(historicalAnalysis.analyzed_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  currentPage.drawText(analysisDate, {
    x: pageWidth / 2 - 180,
    y: infoStartY - 140,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  // EXECUTIVE SUMMARY PAGE
  addNewPage();
  yPosition = pageHeight - margin;

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
  yPosition -= 40;

  // Risk Score Cards
  const cardWidth = (contentWidth - 15) / 2;
  const cardHeight = 60;
  const cardY = yPosition;

  const overallRisk = historicalAnalysis.risk_scores?.overall || 'moderate';
  const riskColor = getRiskColor(overallRisk);

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
  currentPage.drawText('OVERALL RISK LEVEL', {
    x: margin + 15,
    y: cardY - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  currentPage.drawText(overallRisk.toUpperCase(), {
    x: margin + 15,
    y: cardY - 45,
    size: 14,
    font: helveticaBold,
    color: rgb(riskColor[0], riskColor[1], riskColor[2]),
  });

  const stormCount = historicalAnalysis.storm_events?.events?.length || 0;
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
  currentPage.drawText('STORM EVENTS (5 YRS)', {
    x: margin + cardWidth + 30,
    y: cardY - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  currentPage.drawText(`${stormCount}`, {
    x: margin + cardWidth + 30,
    y: cardY - 45,
    size: 14,
    font: helveticaBold,
    color: textColor,
  });

  yPosition -= cardHeight + 30;

  const fireRiskLevel = historicalAnalysis.fire_risk?.risk_level || 'low';
  const fireColor = getRiskColor(fireRiskLevel);
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
  currentPage.drawText('FIRE RISK', {
    x: margin + 15,
    y: yPosition - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  currentPage.drawText(fireRiskLevel.toUpperCase(), {
    x: margin + 15,
    y: yPosition - 45,
    size: 14,
    font: helveticaBold,
    color: rgb(fireColor[0], fireColor[1], fireColor[2]),
  });

  const floodRiskLevel = historicalAnalysis.flood_risk?.risk_level || 'low';
  const floodColor = getRiskColor(floodRiskLevel);
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
  currentPage.drawText('FLOOD RISK', {
    x: margin + cardWidth + 30,
    y: yPosition - 20,
    size: 9,
    font: helveticaBold,
    color: secondaryTextColor,
  });
  currentPage.drawText(floodRiskLevel.toUpperCase(), {
    x: margin + cardWidth + 30,
    y: yPosition - 45,
    size: 14,
    font: helveticaBold,
    color: rgb(floodColor[0], floodColor[1], floodColor[2]),
  });

  yPosition -= cardHeight + 40;

  // AI Summary
  checkPageSpace(150);
  currentPage.drawText('AI Analysis Summary', {
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

  const summaryLines = historicalAnalysis.ai_summary?.split('\n') || ['No summary available'];
  for (const line of summaryLines) {
    if (line.trim()) {
      checkPageSpace(20);
      currentPage.drawText(line.trim(), {
        x: margin,
        y: yPosition,
        size: 11,
        font: helveticaFont,
        color: textColor,
      });
      yPosition -= 18;
    }
  }

  drawPageFooter(currentPage, pageNumber);

  // STORM HISTORY PAGE
  addNewPage();
  yPosition = pageHeight - margin;

  currentPage.drawText('Storm Event History', {
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
  currentPage.drawText('5-Year Historical Analysis', {
    x: margin,
    y: yPosition,
    size: 9,
    font: helveticaFont,
    color: secondaryTextColor,
  });
  yPosition -= 40;

  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('⛈️ Storm Events', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  if (stormCount > 0) {
    const events = historicalAnalysis.storm_events?.events || [];
    for (const event of events.slice(0, 10)) {
      checkPageSpace(80);
      
      currentPage.drawRectangle({
        x: margin,
        y: yPosition - 60,
        width: contentWidth,
        height: 60,
        color: backgroundColor,
      });

      currentPage.drawText(event.type || 'Storm Event', {
        x: margin + 15,
        y: yPosition - 20,
        size: 12,
        font: helveticaBold,
        color: textColor,
      });

      const eventDate = new Date(event.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      currentPage.drawText(eventDate, {
        x: pageWidth - margin - 100,
        y: yPosition - 20,
        size: 10,
        font: helveticaFont,
        color: secondaryTextColor,
      });

      currentPage.drawText(`Severity: ${event.severity || 'Unknown'}`, {
        x: margin + 15,
        y: yPosition - 40,
        size: 10,
        font: helveticaFont,
        color: textColor,
      });

      if (event.damage_reported) {
        currentPage.drawText('⚠️ Damage Reported', {
          x: margin + 200,
          y: yPosition - 40,
          size: 10,
          font: helveticaBold,
          color: rgb(0.94, 0.27, 0.27),
        });
      }

      yPosition -= 70;
    }
  } else {
    currentPage.drawText('No significant storm events recorded in the past 5 years.', {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 25;
  }

  drawPageFooter(currentPage, pageNumber);

  // RISK ASSESSMENT PAGE
  addNewPage();
  yPosition = pageHeight - margin;

  currentPage.drawText('Risk Assessment', {
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

  // Fire Risk Section
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('🔥 Fire Risk Analysis', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  currentPage.drawText(`Risk Level: ${fireRiskLevel.toUpperCase()}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: rgb(fireColor[0], fireColor[1], fireColor[2]),
  });
  yPosition -= 25;

  const fireFactors = historicalAnalysis.fire_risk?.factors || [];
  if (fireFactors.length > 0) {
    currentPage.drawText('Contributing Factors:', {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    yPosition -= 20;

    for (const factor of fireFactors) {
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
  }

  yPosition -= 20;

  // Flood Risk Section
  checkPageSpace(150);
  currentPage.drawRectangle({
    x: margin,
    y: yPosition - 30,
    width: contentWidth,
    height: 30,
    color: primaryColor,
  });
  currentPage.drawText('💧 Flood Risk Analysis', {
    x: margin + 15,
    y: yPosition - 20,
    size: 14,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });
  yPosition -= 50;

  currentPage.drawText(`Risk Level: ${floodRiskLevel.toUpperCase()}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: helveticaBold,
    color: rgb(floodColor[0], floodColor[1], floodColor[2]),
  });
  yPosition -= 25;

  const floodFactors = historicalAnalysis.flood_risk?.factors || [];
  if (floodFactors.length > 0) {
    currentPage.drawText('Contributing Factors:', {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaBold,
      color: textColor,
    });
    yPosition -= 20;

    for (const factor of floodFactors) {
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
  }

  drawPageFooter(currentPage, pageNumber);

  // INSURANCE CLAIMS PAGE
  addNewPage();
  yPosition = pageHeight - margin;

  currentPage.drawText('Insurance Claims History', {
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

  const claimsCount = historicalAnalysis.insurance_claims?.total_claims || 0;
  currentPage.drawText(`Total Claims: ${claimsCount}`, {
    x: margin,
    y: yPosition,
    size: 13,
    font: helveticaBold,
    color: textColor,
  });
  yPosition -= 30;

  if (claimsCount > 0) {
    const claims = historicalAnalysis.insurance_claims?.claims || [];
    for (const claim of claims) {
      checkPageSpace(80);
      
      currentPage.drawRectangle({
        x: margin,
        y: yPosition - 60,
        width: contentWidth,
        height: 60,
        color: backgroundColor,
      });

      currentPage.drawText(claim.type || 'Insurance Claim', {
        x: margin + 15,
        y: yPosition - 20,
        size: 12,
        font: helveticaBold,
        color: textColor,
      });

      const claimDate = new Date(claim.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      currentPage.drawText(claimDate, {
        x: pageWidth - margin - 100,
        y: yPosition - 20,
        size: 10,
        font: helveticaFont,
        color: secondaryTextColor,
      });

      currentPage.drawText(`Amount: $${claim.amount?.toLocaleString() || 'N/A'}`, {
        x: margin + 15,
        y: yPosition - 40,
        size: 10,
        font: helveticaFont,
        color: textColor,
      });

      currentPage.drawText(`Status: ${claim.status || 'Unknown'}`, {
        x: margin + 200,
        y: yPosition - 40,
        size: 10,
        font: helveticaFont,
        color: textColor,
      });

      yPosition -= 70;
    }
  } else {
    currentPage.drawText('No insurance claims found in the available records.', {
      x: margin,
      y: yPosition,
      size: 11,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 25;
  }

  drawPageFooter(currentPage, pageNumber);

  // RECOMMENDATIONS PAGE
  addNewPage();
  yPosition = pageHeight - margin;

  currentPage.drawText('Recommendations', {
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

  const recommendations = [
    'Review and update property insurance coverage based on identified risks',
    'Consider additional coverage for high-risk events (fire, flood, storm)',
    'Implement preventive measures to reduce risk exposure',
    'Schedule regular property inspections and maintenance',
    'Document all property improvements for insurance purposes',
    'Maintain detailed records of all repairs and upgrades',
    'Consider installing monitoring systems for early risk detection',
  ];

  for (const rec of recommendations) {
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
      size: 11,
      font: helveticaFont,
      color: textColor,
    });
    yPosition -= 20;
  }

  yPosition -= 20;
  checkPageSpace(100);

  currentPage.drawText('Data Sources', {
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

  const dataSources = historicalAnalysis.data_sources_used || [];
  for (const source of dataSources) {
    checkPageSpace(20);
    currentPage.drawText(`• ${source}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: helveticaFont,
      color: secondaryTextColor,
    });
    yPosition -= 18;
  }

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
    'This insurance verification report is generated using historical data analysis and AI-powered',
    'risk assessment. While our systems analyze multiple data sources, this report should not',
    'replace professional insurance consultation or underwriting. Risk assessments are based on',
    'available historical data and may not reflect current or future conditions.',
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
    'Risk assessments are based on historical data and statistical analysis',
    'Insurance coverage decisions should be made in consultation with licensed insurance professionals',
    'This report does not constitute an insurance policy or guarantee of coverage',
    'Data accuracy depends on the availability and quality of public records',
    'Risk levels may change based on environmental and property conditions',
    'This report is valid for 30 days from the date of generation',
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

  drawPageFooter(currentPage, pageNumber);

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

    const { inspectionId, historicalAnalysisId } = await req.json();

    if (!inspectionId || !historicalAnalysisId) {
      throw new Error('Missing inspectionId or historicalAnalysisId');
    }

    // Fetch inspection data
    const { data: inspection, error: inspectionError } = await supabaseClient
      .from('inspections')
      .select('*')
      .eq('id', inspectionId)
      .eq('user_id', user.id)
      .single();

    if (inspectionError || !inspection) {
      throw new Error('Inspection not found');
    }

    // Fetch historical analysis data
    const { data: historicalAnalysis, error: historicalError } = await supabaseClient
      .from('historical_analyses')
      .select('*')
      .eq('id', historicalAnalysisId)
      .eq('user_id', user.id)
      .single();

    if (historicalError || !historicalAnalysis) {
      throw new Error('Historical analysis not found');
    }

    console.log('Generating insurance PDF for inspection:', inspectionId);

    const pdfBytes = await generateInsurancePDF(inspection, historicalAnalysis);

    console.log('Insurance PDF generated successfully, size:', pdfBytes.length);

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="insurance-report-${inspectionId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating insurance PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
