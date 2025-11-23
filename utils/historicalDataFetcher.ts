
import { HistoricalAnalysis } from '@/types/historicalData';
import { supabase } from '@/app/integrations/supabase/client';

export async function fetchHistoricalAnalysis(address: string): Promise<HistoricalAnalysis> {
  console.log('Starting historical analysis for address:', address);
  
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be authenticated to fetch historical data');
    }

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('fetch-historical-data', {
      body: { address },
    });

    if (error) {
      console.error('Error calling fetch-historical-data function:', error);
      throw new Error(`Failed to fetch historical data: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from historical analysis');
    }

    console.log('Historical analysis completed successfully');
    
    // Convert date strings back to Date objects
    const analysis = {
      ...data,
      analyzedAt: new Date(data.analyzedAt),
      stormEvents: data.stormEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date),
      })),
      fireRisk: {
        ...data.fireRisk,
        lastUpdate: new Date(data.fireRisk.lastUpdate),
      },
      floodRisk: {
        ...data.floodRisk,
        lastFloodDate: data.floodRisk.lastFloodDate ? new Date(data.floodRisk.lastFloodDate) : undefined,
      },
      insuranceClaims: {
        ...data.insuranceClaims,
        lastClaimDate: data.insuranceClaims.lastClaimDate ? new Date(data.insuranceClaims.lastClaimDate) : undefined,
      },
    };

    return analysis as HistoricalAnalysis;

  } catch (error) {
    console.error('Error fetching historical analysis:', error);
    throw new Error('Failed to fetch historical analysis. Please check the address and try again.');
  }
}
