
import { supabase } from '@/app/integrations/supabase/client';
import { InspectionReport } from '@/types/inspection';
import { HistoricalAnalysis } from '@/types/historicalData';

/**
 * Save an inspection to the database
 */
export async function saveInspection(report: InspectionReport): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to save inspection');
    }

    const { data, error } = await supabase
      .from('inspections')
      .insert({
        user_id: user.id,
        property_address: report.propertyAddress,
        inspection_date: report.inspectionDate.toISOString(),
        overall_condition: report.aiAnalysis.overallCondition,
        ai_analysis: report.aiAnalysis,
        quote: report.quote,
        roof_diagram: report.roofDiagram,
        notes: report.notes || '',
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving inspection:', error);
      throw error;
    }

    console.log('Inspection saved successfully:', data.id);
    return data.id;
  } catch (error) {
    console.error('Failed to save inspection:', error);
    return null;
  }
}

/**
 * Save historical analysis to the database
 */
export async function saveHistoricalAnalysis(analysis: HistoricalAnalysis): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to save historical analysis');
    }

    const { data, error } = await supabase
      .from('historical_analyses')
      .insert({
        user_id: user.id,
        address: analysis.address,
        coordinates: analysis.coordinates,
        storm_events: analysis.stormEvents,
        fire_risk: analysis.fireRisk,
        flood_risk: analysis.floodRisk,
        insurance_claims: analysis.insuranceClaims,
        weather_patterns: analysis.weatherPatterns,
        roof_age_patterns: analysis.roofAgePatterns,
        risk_scores: analysis.riskScores,
        ai_summary: analysis.aiSummary,
        data_sources_used: analysis.dataSourcesUsed,
        analyzed_at: analysis.analyzedAt.toISOString(),
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error saving historical analysis:', error);
      throw error;
    }

    console.log('Historical analysis saved successfully:', data.id);
    return data.id;
  } catch (error) {
    console.error('Failed to save historical analysis:', error);
    return null;
  }
}

/**
 * Get user's inspections
 */
export async function getUserInspections(limit: number = 10) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from('inspections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching inspections:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch inspections:', error);
    return [];
  }
}

/**
 * Get user's historical analyses
 */
export async function getUserHistoricalAnalyses(limit: number = 10) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated');
    }

    const { data, error } = await supabase
      .from('historical_analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching historical analyses:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch historical analyses:', error);
    return [];
  }
}

/**
 * Delete an inspection
 */
export async function deleteInspection(inspectionId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('inspections')
      .delete()
      .eq('id', inspectionId);

    if (error) {
      console.error('Error deleting inspection:', error);
      throw error;
    }

    console.log('Inspection deleted successfully');
    return true;
  } catch (error) {
    console.error('Failed to delete inspection:', error);
    return false;
  }
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImageToStorage(
  uri: string,
  fileName: string,
  bucket: string = 'inspection-images'
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to upload images');
    }

    // Fetch the image as a blob
    const response = await fetch(uri);
    const blob = await response.blob();

    // Create a unique file path
    const filePath = `${user.id}/${Date.now()}-${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Image uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    return null;
  }
}

/**
 * Convert image URI to base64
 */
export async function convertImageToBase64(uri: string): Promise<string | null> {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image to base64:', error);
    return null;
  }
}
