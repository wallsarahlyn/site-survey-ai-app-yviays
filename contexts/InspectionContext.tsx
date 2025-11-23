
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { RoofDiagram, AIAnalysisResult, ServiceQuote, UploadedImage } from '@/types/inspection';
import { HistoricalAnalysis } from '@/types/historicalData';

interface InspectionContextType {
  roofDiagram: RoofDiagram | null;
  setRoofDiagram: (diagram: RoofDiagram | null) => void;
  images: UploadedImage[];
  setImages: (images: UploadedImage[]) => void;
  analysis: AIAnalysisResult | null;
  setAnalysis: (analysis: AIAnalysisResult | null) => void;
  quote: ServiceQuote | null;
  setQuote: (quote: ServiceQuote | null) => void;
  propertyAddress: string;
  setPropertyAddress: (address: string) => void;
  historicalAnalysis: HistoricalAnalysis | null;
  setHistoricalAnalysis: (analysis: HistoricalAnalysis | null) => void;
  resetInspection: () => void;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [roofDiagram, setRoofDiagram] = useState<RoofDiagram | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [quote, setQuote] = useState<ServiceQuote | null>(null);
  const [propertyAddress, setPropertyAddress] = useState('');
  const [historicalAnalysis, setHistoricalAnalysis] = useState<HistoricalAnalysis | null>(null);

  const resetInspection = () => {
    setRoofDiagram(null);
    setImages([]);
    setAnalysis(null);
    setQuote(null);
    setPropertyAddress('');
    setHistoricalAnalysis(null);
  };

  return (
    <InspectionContext.Provider
      value={{
        roofDiagram,
        setRoofDiagram,
        images,
        setImages,
        analysis,
        setAnalysis,
        quote,
        setQuote,
        propertyAddress,
        setPropertyAddress,
        historicalAnalysis,
        setHistoricalAnalysis,
        resetInspection,
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection() {
  const context = useContext(InspectionContext);
  if (context === undefined) {
    throw new Error('useInspection must be used within an InspectionProvider');
  }
  return context;
}
