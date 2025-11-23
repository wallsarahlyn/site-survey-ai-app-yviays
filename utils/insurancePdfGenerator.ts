
import { supabase } from '@/app/integrations/supabase/client';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { InspectionReport } from '@/types/inspection';
import { HistoricalAnalysis } from '@/types/historicalData';

/**
 * Generate a full insurance verification PDF report from inspection and historical data.
 * This function calls a Supabase Edge Function that builds the PDF from the data objects.
 * 
 * @param report - The inspection report data
 * @param historicalAnalysis - The historical analysis data
 * @param inspectionId - Optional inspection ID if the report is already saved
 * @param historicalAnalysisId - Optional historical analysis ID if already saved
 */
export async function generateInsuranceVerificationPDF(
  report: InspectionReport,
  historicalAnalysis: HistoricalAnalysis,
  inspectionId?: string,
  historicalAnalysisId?: string
): Promise<void> {
  try {
    console.log('Starting server-side insurance PDF generation...');

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be signed in to generate insurance PDF reports');
    }

    // If no IDs provided, we need to save the data first
    let reportId = inspectionId;
    let analysisId = historicalAnalysisId;

    if (!reportId) {
      console.log('No inspection ID provided, saving inspection first...');
      const { saveInspection } = await import('./supabaseHelpers');
      reportId = await saveInspection(report);
      if (!reportId) {
        throw new Error('Failed to save inspection before generating PDF');
      }
    }

    if (!analysisId) {
      console.log('No historical analysis ID provided, saving analysis first...');
      const { saveHistoricalAnalysis } = await import('./supabaseHelpers');
      analysisId = await saveHistoricalAnalysis(historicalAnalysis);
      if (!analysisId) {
        throw new Error('Failed to save historical analysis before generating PDF');
      }
    }

    console.log('Calling Edge Function to generate insurance PDF...');

    // Call the Edge Function to generate the PDF
    const { data, error } = await supabase.functions.invoke('generate-insurance-pdf', {
      body: { 
        inspectionId: reportId,
        historicalAnalysisId: analysisId,
      },
    });

    if (error) {
      console.error('Edge Function error:', error);
      throw new Error(`Failed to generate insurance PDF: ${error.message}`);
    }

    if (!data) {
      throw new Error('No PDF data returned from server');
    }

    console.log('Insurance PDF generated successfully, preparing to save and share...');

    // Convert the response to a blob and save it
    const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
    
    // Create a file URI
    const fileName = `insurance-report-${reportId}.pdf`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Convert blob to base64
    const reader = new FileReader();
    const base64Promise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const base64 = base64data.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const base64 = await base64Promise;

    // Write the file
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Insurance PDF saved to:', fileUri);

    // Share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Insurance Verification Report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      console.log('Sharing is not available on this platform');
      throw new Error('Sharing is not available on this platform');
    }

    console.log('Insurance PDF generation and sharing complete');
  } catch (error) {
    console.error('Error in generateInsuranceVerificationPDF:', error);
    throw error;
  }
}

/**
 * Legacy function - kept for backwards compatibility but now uses server-side generation
 * @deprecated Use generateInsuranceVerificationPDF instead
 */
export async function generateInsuranceVerificationPDFLegacy(
  report: InspectionReport,
  historicalAnalysis: HistoricalAnalysis
): Promise<void> {
  return generateInsuranceVerificationPDF(report, historicalAnalysis);
}
