
import { supabase } from '@/app/integrations/supabase/client';
import { InspectionReport } from '@/types/inspection';
import { HistoricalAnalysis } from '@/types/historicalData';

/**
 * Save an inspection report to the Supabase database
 * @param report - The inspection report to save
 * @returns The ID of the saved inspection, or null if failed
 */
export async function saveInspection(report: InspectionReport): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    // Insert the inspection
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspections')
      .insert({
        user_id: user.id,
        property_address: report.propertyAddress,
        inspection_date: report.inspectionDate.toISOString(),
        overall_condition: report.aiAnalysis.overallCondition,
        ai_analysis: report.aiAnalysis,
        quote: report.quote,
        roof_diagram: report.roofDiagram,
        notes: report.notes,
      })
      .select()
      .single();

    if (inspectionError) {
      console.error('Error saving inspection:', inspectionError);
      return null;
    }

    console.log('Inspection saved successfully:', inspection.id);

    // Save images if any
    if (report.images && report.images.length > 0) {
      const imageInserts = report.images.map(img => ({
        inspection_id: inspection.id,
        file_name: img.fileName,
        file_path: img.uri,
        width: img.width,
        height: img.height,
        uploaded_at: img.uploadedAt.toISOString(),
      }));

      const { error: imagesError } = await supabase
        .from('inspection_images')
        .insert(imageInserts);

      if (imagesError) {
        console.error('Error saving images:', imagesError);
        // Don't fail the whole operation if images fail
      } else {
        console.log('Images saved successfully');
      }
    }

    return inspection.id;
  } catch (error) {
    console.error('Error in saveInspection:', error);
    return null;
  }
}

/**
 * Save a historical analysis to the Supabase database
 * @param analysis - The historical analysis to save
 * @returns The ID of the saved analysis, or null if failed
 */
export async function saveHistoricalAnalysis(analysis: HistoricalAnalysis): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return null;
    }

    // Insert the historical analysis
    const { data: savedAnalysis, error: analysisError } = await supabase
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
      .select()
      .single();

    if (analysisError) {
      console.error('Error saving historical analysis:', analysisError);
      return null;
    }

    console.log('Historical analysis saved successfully:', savedAnalysis.id);
    return savedAnalysis.id;
  } catch (error) {
    console.error('Error in saveHistoricalAnalysis:', error);
    return null;
  }
}

/**
 * Fetch an inspection report from the database
 * @param inspectionId - The ID of the inspection to fetch
 * @returns The inspection report, or null if not found
 */
export async function fetchInspection(inspectionId: string): Promise<InspectionReport | null> {
  try {
    const { data: inspection, error } = await supabase
      .from('inspections')
      .select('*, inspection_images(*)')
      .eq('id', inspectionId)
      .single();

    if (error || !inspection) {
      console.error('Error fetching inspection:', error);
      return null;
    }

    // Transform database format to InspectionReport format
    const report: InspectionReport = {
      id: inspection.id,
      propertyAddress: inspection.property_address,
      inspectionDate: new Date(inspection.inspection_date),
      images: inspection.inspection_images?.map((img: any) => ({
        id: img.id,
        uri: img.file_path,
        width: img.width,
        height: img.height,
        fileName: img.file_name,
        uploadedAt: new Date(img.uploaded_at),
      })) || [],
      aiAnalysis: inspection.ai_analysis,
      roofDiagram: inspection.roof_diagram,
      quote: inspection.quote,
      notes: inspection.notes || '',
    };

    return report;
  } catch (error) {
    console.error('Error in fetchInspection:', error);
    return null;
  }
}

/**
 * Fetch a historical analysis from the database
 * @param analysisId - The ID of the analysis to fetch
 * @returns The historical analysis, or null if not found
 */
export async function fetchHistoricalAnalysis(analysisId: string): Promise<HistoricalAnalysis | null> {
  try {
    const { data: analysis, error } = await supabase
      .from('historical_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (error || !analysis) {
      console.error('Error fetching historical analysis:', error);
      return null;
    }

    // Transform database format to HistoricalAnalysis format
    const historicalAnalysis: HistoricalAnalysis = {
      id: analysis.id,
      address: analysis.address,
      coordinates: analysis.coordinates,
      stormEvents: analysis.storm_events,
      fireRisk: analysis.fire_risk,
      floodRisk: analysis.flood_risk,
      insuranceClaims: analysis.insurance_claims,
      weatherPatterns: analysis.weather_patterns,
      roofAgePatterns: analysis.roof_age_patterns,
      riskScores: analysis.risk_scores,
      aiSummary: analysis.ai_summary,
      dataSourcesUsed: analysis.data_sources_used,
      analyzedAt: new Date(analysis.analyzed_at),
    };

    return historicalAnalysis;
  } catch (error) {
    console.error('Error in fetchHistoricalAnalysis:', error);
    return null;
  }
}

/**
 * Fetch all inspections for the current user
 * @returns Array of inspection reports
 */
export async function fetchUserInspections(): Promise<InspectionReport[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('User not authenticated');
      return [];
    }

    const { data: inspections, error } = await supabase
      .from('inspections')
      .select('*, inspection_images(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inspections:', error);
      return [];
    }

    return inspections.map((inspection: any) => ({
      id: inspection.id,
      propertyAddress: inspection.property_address,
      inspectionDate: new Date(inspection.inspection_date),
      images: inspection.inspection_images?.map((img: any) => ({
        id: img.id,
        uri: img.file_path,
        width: img.width,
        height: img.height,
        fileName: img.file_name,
        uploadedAt: new Date(img.uploaded_at),
      })) || [],
      aiAnalysis: inspection.ai_analysis,
      roofDiagram: inspection.roof_diagram,
      quote: inspection.quote,
      notes: inspection.notes || '',
    }));
  } catch (error) {
    console.error('Error in fetchUserInspections:', error);
    return [];
  }
}
