
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import { PDFDocument, rgb, StandardFonts } from 'npm:pdf-lib@1.17.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SampleInspectionData {
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
    facets: {
      id: string;
      label: string;
      area: number;
      pitch: number;
      measurements: {
        width: number;
        height: number;
        perimeter: number;
      };
    }[];
    totalArea: number;
  };
  notes?: string;
}

function generateSampleData(reportType: 'basic' | 'pro' | 'premium'): SampleInspectionData {
  const baseData: SampleInspectionData = {
    id: `SAMPLE-${reportType.toUpperCase()}-${Date.now()}`,
    property_address: '123 Sample Street, Austin, TX 78701',
    inspection_date: new Date().toISOString(),
    overall_condition: 'good',
    ai_analysis: {
      roofDamage: {
        detected: true,
        severity: 'minor',
        issues: [
          'Minor granule loss observed on south-facing slope',
          'Small area of missing shingles near ridge vent',
          'Slight curling detected on west-facing slope',
        ],
        confidence: 0.89,
      },
      structuralIssues: {
        detected: false,
        issues: [],
        confidence: 0.92,
      },
      solarCompatibility: {
        suitable: true,
        score: 85,
        factors: [
          'South-facing roof orientation optimal',
          'Minimal shading from surrounding structures',
          'Adequate roof space for 10 kW system',
          'Roof structure appears sound',
        ],
        estimatedCapacity: '10-12 kW',
      },
      inspectionConcerns: {
        detected: true,
        concerns: [
          'Gutter cleaning recommended',
          'Flashing inspection needed around chimney',
          'Minor repairs suggested within 6 months',
        ],
        recommendations: [
          'Schedule detailed inspection within 30 days',
          'Consider preventive maintenance program',
          'Review insurance coverage',
        ],
      },
      overallCondition: 'good',
    },
    quote: {
      roofing: {
        estimatedCost: 12500,
        laborCost: 7500,
        materialCost: 5000,
        timeline: '3-5 days',
      },
      solar: {
        estimatedCost: 28000,
        systemSize: '10 kW',
        estimatedSavings: 2400,
        paybackPeriod: '8-10 years',
      },
      repairs: {
        estimatedCost: 850,
        urgency: 'medium',
        timeline: '1-2 days',
      },
      totalEstimate: 41350,
    },
    notes: 'This is a sample report for demonstration purposes.',
  };

  // Add roof diagram for pro and premium reports
  if (reportType === 'pro' || reportType === 'premium') {
    baseData.roof_diagram = {
      facets: [
        {
          id: '1',
          label: 'North Facet',
          area: 850.5,
          pitch: 6,
          measurements: { width: 42.5, height: 20.0, perimeter: 125.0 },
        },
        {
          id: '2',
          label: 'South Facet',
          area: 850.5,
          pitch: 6,
          measurements: { width: 42.5, height: 20.0, perimeter: 125.0 },
        },
        {
          id: '3',
          label: 'East Facet',
          area: 425.0,
          pitch: 8,
          measurements: { width: 25.0, height: 17.0, perimeter: 84.0 },
        },
        {
          id: '4',
          label: 'West Facet',
          area: 425.0,
          pitch: 8,
          measurements: { width: 25.0, height: 17.0, perimeter: 84.0 },
        },
      ],
      totalArea: 2551.0,
    };
  }

  // Add historical data for premium reports
  if (reportType === 'premium') {
    baseData.ai_analysis.inspectionConcerns.concerns.push(
      'Historical storm data shows 3 hail events in past 5 years',
      'Area has moderate wind risk (avg 15-20 mph sustained)',
      'Flood zone classification: X (minimal risk)'
    );
    baseData.ai_analysis.inspectionConcerns.recommendations.push(
      'Consider impact-resistant shingles for future replacement',
      'Verify insurance coverage includes wind and hail damage'
    );
  }

  return baseData;
}

async function generateSamplePDF(inspection: SampleInspectionData, reportType: string): Promise<Uint8Array> {
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
    page.drawText('SAMPLE REPORT - For Demonstration Only', {
      x: margin,
      y: 36,
      size: 8,
      font: helveticaBold,
      color: rgb(0.94, 0.27, 0.27),
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

  // Sample watermark
  currentPage.drawText('SAMPLE REPORT', {
    x: pageWidth / 2 - 120,
    y: pageHeight - 100,
    size: 32,
    font: helveticaBold,
    color: rgb(1, 1, 1),
    opacity: 0.3,
  });

  currentPage.drawRectangle({
    x: (pageWidth - 120) / 2,
    y: pageHeight - 220,
    width: 120,
    height: 120,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.9, 0.9, 0.9),
    borderWidth: 2,
  });

  currentPage.drawText('🏠', {
    x: (pageWidth - 60) / 2,
    y: pageHeight - 170,
    size: 48,
    font: helveticaBold,
    color: primaryColor,
  });

  const reportTitle = reportType === 'basic' ? 'Basic Inspection Report'
    : reportType === 'pro' ? 'Pro Measurement & Inspection Report'
    : 'Premium Insurance & Risk Report';

  currentPage.drawText(reportTitle, {
    x: pageWidth / 2 - 180,
    y: pageHeight - 300,
    size: 28,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('AI-Powered Property Analysis', {
    x: pageWidth / 2 - 120,
    y: pageHeight - 340,
    size: 16,
    font: helveticaFont,
    color: rgb(0.95, 0.95, 0.95),
  });

  const infoBoxY = pageHeight - 570;
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
    size: 12,
    font: helveticaBold,
    color: rgb(1, 1, 1),
  });

  currentPage.drawText('Report Date', {
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

  // Add more pages based on report type
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

  currentPage.drawText('This is a sample report demonstrating the format and content', {
    x: margin,
    y: yPosition,
    size: 12,
    font: helveticaFont,
    color: textColor,
  });
  yPosition -= 20;

  currentPage.drawText('you will receive when you purchase a report.', {
    x: margin,
    y: yPosition,
    size: 12,
    font: helveticaFont,
    color: textColor,
  });
  yPosition -= 40;

  // Key findings
  const findings = [
    `Overall Condition: ${inspection.overall_condition.toUpperCase()}`,
    `Roof Damage: ${inspection.ai_analysis.roofDamage.detected ? 'Detected' : 'None'} (${(inspection.ai_analysis.roofDamage.confidence * 100).toFixed(1)}% confidence)`,
    `Solar Compatibility: ${inspection.ai_analysis.solarCompatibility.suitable ? 'Suitable' : 'Not Suitable'} (Score: ${inspection.ai_analysis.solarCompatibility.score.toFixed(0)}/100)`,
    `Total Estimate: $${inspection.quote.totalEstimate.toLocaleString()}`,
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

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Received request to generate sample report');

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
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
      console.error('Unauthorized:', userError);
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    const requestBody = await req.json();
    console.log('Request body:', requestBody);

    const { reportType } = requestBody;

    if (!reportType || !['basic', 'pro', 'premium'].includes(reportType)) {
      console.error('Invalid report type:', reportType);
      throw new Error('Invalid report type. Must be basic, pro, or premium.');
    }

    console.log('Generating sample report:', reportType);

    const sampleData = generateSampleData(reportType as 'basic' | 'pro' | 'premium');
    console.log('Sample data generated');

    const pdfBytes = await generateSamplePDF(sampleData, reportType);
    console.log('Sample PDF generated successfully, size:', pdfBytes.length);

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="sample-${reportType}-report.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating sample PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
