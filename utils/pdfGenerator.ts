
import { supabase } from '@/app/integrations/supabase/client';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { InspectionReport } from '@/types/inspection';
import { Platform } from 'react-native';

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

    // Get the Supabase URL for the function call
    const supabaseUrl = supabase.supabaseUrl;
    const functionUrl = `${supabaseUrl}/functions/v1/generate-inspection-pdf`;

    console.log('Function URL:', functionUrl);

    // Call the Edge Function directly using fetch for better control
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectionId: reportId }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge Function error response:', errorText);
      throw new Error(`Failed to generate PDF: ${response.status} ${response.statusText}`);
    }

    // Get the PDF as an ArrayBuffer
    const pdfArrayBuffer = await response.arrayBuffer();
    console.log('PDF received, size:', pdfArrayBuffer.byteLength, 'bytes');

    if (pdfArrayBuffer.byteLength === 0) {
      throw new Error('Received empty PDF from server');
    }

    // Convert ArrayBuffer to base64
    const pdfBytes = new Uint8Array(pdfArrayBuffer);
    let binary = '';
    for (let i = 0; i < pdfBytes.byteLength; i++) {
      binary += String.fromCharCode(pdfBytes[i]);
    }
    const base64 = btoa(binary);

    console.log('PDF converted to base64, length:', base64.length);

    // Create a file URI
    const fileName = `inspection-report-${reportId}.pdf`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    console.log('Saving PDF to:', fileUri);

    // Write the file
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    console.log('PDF saved successfully');

    // Verify the file was written
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log('File info:', fileInfo);

    if (!fileInfo.exists) {
      throw new Error('Failed to save PDF file');
    }

    // Share the PDF
    const isAvailable = await Sharing.isAvailableAsync();
    console.log('Sharing available:', isAvailable);

    if (isAvailable) {
      console.log('Opening share dialog...');
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Inspection Report',
        UTI: 'com.adobe.pdf',
      });
      console.log('Share dialog completed');
    } else {
      // On web, try to download the file
      if (Platform.OS === 'web') {
        console.log('Web platform detected, triggering download...');
        const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Download triggered');
      } else {
        throw new Error('Sharing is not available on this platform');
      }
    }

    console.log('PDF generation and sharing complete');
  } catch (error) {
    console.error('Error in generateInspectionPDF:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
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
