
import { supabase } from '@/app/integrations/supabase/client';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { InspectionReport } from '@/types/inspection';

/**
 * Generate a full, structured PDF report from inspection data using server-side PDF generation.
 * This function calls a Supabase Edge Function that builds the PDF from the inspection data object.
 * 
 * @param report - The inspection report data
 * @param inspectionId - Optional inspection ID if the report is already saved to the database
 */
export async function generateInspectionPDF(report: InspectionReport, inspectionId?: string): Promise<void> {
  try {
    console.log('Starting server-side PDF generation...');

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('You must be signed in to generate PDF reports');
    }

    // If no inspectionId provided, we need to save the inspection first
    let reportId = inspectionId;
    if (!reportId) {
      console.log('No inspection ID provided, saving inspection first...');
      const { saveInspection } = await import('./supabaseHelpers');
      reportId = await saveInspection(report);
      if (!reportId) {
        throw new Error('Failed to save inspection before generating PDF');
      }
    }

    console.log('Calling Edge Function to generate PDF for inspection:', reportId);

    // Call the Edge Function to generate the PDF
    const { data, error } = await supabase.functions.invoke('generate-inspection-pdf', {
      body: { inspectionId: reportId },
    });

    if (error) {
      console.error('Edge Function error:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }

    if (!data) {
      throw new Error('No PDF data returned from server');
    }

    console.log('PDF generated successfully, preparing to save and share...');

    // Convert the response to a blob and save it
    const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/pdf' });
    
    // Create a file URI
    const fileName = `inspection-report-${reportId}.pdf`;
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

    console.log('PDF saved to:', fileUri);

    // Share the PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Inspection Report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      console.log('Sharing is not available on this platform');
      throw new Error('Sharing is not available on this platform');
    }

    console.log('PDF generation and sharing complete');
  } catch (error) {
    console.error('Error in generateInspectionPDF:', error);
    throw error;
  }
}

/**
 * Legacy function - kept for backwards compatibility but now uses server-side generation
 * @deprecated Use generateInspectionPDF instead
 */
export async function generateInspectionPDFLegacy(report: InspectionReport): Promise<void> {
  return generateInspectionPDF(report);
}
