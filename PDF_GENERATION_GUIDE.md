
# PDF Generation System - Complete Guide

## Overview

This application uses **server-side PDF generation** to create professional, multi-page inspection and insurance reports. The system is built with:

- **Supabase Edge Functions** for server-side processing
- **pdf-lib** library for PDF creation from data (not DOM/HTML)
- **Data-driven architecture** - PDFs are built from JSON inspection objects
- **No client-side HTML manipulation or screenshotting**

## Architecture

### 1. Client-Side Flow

```
User completes inspection → Data saved to Supabase → User clicks "Download PDF" 
→ Client calls Edge Function → Edge Function generates PDF → PDF returned to client
```

### 2. Edge Functions

#### `generate-inspection-pdf`
- **Purpose**: Generate complete property inspection reports
- **Input**: `inspectionId` (UUID)
- **Output**: Multi-page PDF with all inspection data
- **Sections**:
  - Cover Page (logo, title, property address, date)
  - Executive Summary (condition, estimate, roof area, damage status)
  - AI Analysis & Findings (roof damage, structural issues)
  - Solar Compatibility Analysis
  - Roof Measurements & Facets (if available)
  - Quote Overview (roofing, solar, repairs)
  - Disclaimer & Terms

#### `generate-insurance-pdf`
- **Purpose**: Generate insurance verification reports with historical risk analysis
- **Input**: `inspectionId` (UUID), `historicalAnalysisId` (UUID)
- **Output**: Multi-page PDF with risk assessment data
- **Sections**:
  - Cover Page (shield icon, title, property address, date)
  - Executive Summary (risk levels, storm count, fire/flood risk)
  - Storm Event History (5-year analysis)
  - Risk Assessment (fire and flood risk factors)
  - Insurance Claims History
  - Recommendations
  - Data Sources
  - Disclaimer & Terms

### 3. Database Schema

#### `inspections` table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- property_address (text)
- inspection_date (timestamptz)
- overall_condition (text: 'excellent' | 'good' | 'fair' | 'poor')
- ai_analysis (jsonb)
- quote (jsonb)
- roof_diagram (jsonb)
- notes (text)
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `historical_analyses` table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- address (text)
- coordinates (jsonb)
- storm_events (jsonb)
- fire_risk (jsonb)
- flood_risk (jsonb)
- insurance_claims (jsonb)
- weather_patterns (jsonb)
- roof_age_patterns (jsonb)
- risk_scores (jsonb)
- ai_summary (text)
- data_sources_used (text[])
- analyzed_at (timestamptz)
- created_at (timestamptz)
```

## Usage

### Generating an Inspection PDF

```typescript
import { generateInspectionPDF } from '@/utils/pdfGenerator';
import { InspectionReport } from '@/types/inspection';

// Create inspection report object
const report: InspectionReport = {
  id: 'INS-123',
  propertyAddress: '123 Main St',
  inspectionDate: new Date(),
  images: [...],
  aiAnalysis: {...},
  quote: {...},
  roofDiagram: {...},
  notes: ''
};

// Generate and download PDF
await generateInspectionPDF(report, savedInspectionId);
```

### Generating an Insurance PDF

```typescript
import { generateInsuranceVerificationPDF } from '@/utils/insurancePdfGenerator';
import { InspectionReport } from '@/types/inspection';
import { HistoricalAnalysis } from '@/types/historicalData';

// Create report and analysis objects
const report: InspectionReport = {...};
const historicalAnalysis: HistoricalAnalysis = {...};

// Generate and download PDF
await generateInsuranceVerificationPDF(
  report,
  historicalAnalysis,
  inspectionId,
  historicalAnalysisId
);
```

## PDF Styling

### Color Scheme
- **Primary Color**: `rgb(0.15, 0.38, 0.92)` - Blue (#2563EB)
- **Text Color**: `rgb(0.13, 0.13, 0.13)` - Dark Gray (#212121)
- **Secondary Text**: `rgb(0.46, 0.46, 0.46)` - Medium Gray (#757575)
- **Background**: `rgb(0.96, 0.96, 0.96)` - Light Gray (#F5F5F5)

### Risk/Condition Colors
- **Excellent/Low**: `rgb(0.06, 0.73, 0.51)` - Green (#10B981)
- **Good/Moderate**: `rgb(0.96, 0.62, 0.04)` - Orange (#F59E0B)
- **Fair/High**: `rgb(0.94, 0.27, 0.27)` - Red (#EF4444)
- **Poor/Very High**: `rgb(0.72, 0.11, 0.11)` - Dark Red (#B91C1C)

### Page Layout
- **Page Size**: 8.5" × 11" (612 × 792 points)
- **Margins**: 0.75" (54 points) on all sides
- **Content Width**: 7" (504 points)
- **Fonts**: 
  - Helvetica (body text)
  - Helvetica Bold (headings)
  - Times Roman (formal sections)

### Components
- **Info Cards**: 60pt height, colored left border, background fill
- **Section Headers**: Full-width colored bar with white text
- **Page Footers**: Property address (left), page number (right)
- **Tables**: Alternating row colors, header row with primary color

## Key Features

### ✅ Data-Driven Generation
- PDFs are built entirely from JSON data objects
- No DOM manipulation or HTML rendering
- No client-side screenshotting or printing

### ✅ Multi-Page Support
- Automatic page breaks with proper spacing
- Consistent headers and footers on all pages
- Content never cut off mid-section

### ✅ Professional Formatting
- Cover pages with branding
- Color-coded risk indicators
- Tables with proper alignment
- Bullet lists with proper indentation

### ✅ Conditional Sections
- Sections only appear if data is available
- Graceful handling of missing data
- No empty pages or broken layouts

### ✅ Security
- User authentication required
- Row-level security on database tables
- Users can only access their own reports

## Error Handling

### Client-Side
```typescript
try {
  await generateInspectionPDF(report, inspectionId);
  Alert.alert('Success', 'PDF generated successfully!');
} catch (error) {
  console.error('PDF generation error:', error);
  Alert.alert('Error', error.message || 'Failed to generate PDF');
}
```

### Server-Side
- Missing authentication → 401 Unauthorized
- Missing inspection data → 400 Bad Request
- Database errors → Logged and returned as error response
- PDF generation errors → Caught and returned with details

## Performance Considerations

### Server-Side Processing
- PDF generation happens on Supabase Edge Functions (Deno runtime)
- No client-side performance impact
- Suitable for large reports with many pages

### Optimization Tips
1. **Save inspections before generating PDFs** - Reduces data transfer
2. **Use inspection IDs** - Fetch data server-side instead of sending full objects
3. **Cache fonts** - pdf-lib embeds fonts once per document
4. **Limit image sizes** - Keep uploaded images under 5MB each

## Troubleshooting

### "Missing authorization header"
- User is not signed in
- Solution: Check authentication status before calling PDF functions

### "Inspection not found"
- Inspection ID doesn't exist or belongs to another user
- Solution: Verify inspection was saved successfully

### "Failed to generate PDF"
- Edge Function error during PDF creation
- Solution: Check Edge Function logs in Supabase dashboard

### PDF is blank or incomplete
- Missing required data fields
- Solution: Ensure all required fields are populated in inspection object

## Future Enhancements

### Potential Additions
- [ ] Photo embedding in PDFs (currently text-only)
- [ ] Custom branding/logo upload
- [ ] Multiple PDF templates (residential, commercial, etc.)
- [ ] Email delivery of PDFs
- [ ] PDF storage in Supabase Storage
- [ ] Batch PDF generation for multiple inspections
- [ ] PDF encryption/password protection
- [ ] Digital signatures

### Performance Improvements
- [ ] Background PDF generation with webhooks
- [ ] PDF caching for frequently accessed reports
- [ ] Compression for smaller file sizes
- [ ] Parallel processing for multiple PDFs

## API Reference

### `generateInspectionPDF(report, inspectionId?)`
Generates a complete inspection report PDF.

**Parameters:**
- `report` (InspectionReport): The inspection data object
- `inspectionId` (string, optional): UUID of saved inspection

**Returns:** Promise<void>

**Throws:** Error if generation fails

### `generateInsuranceVerificationPDF(report, historicalAnalysis, inspectionId?, historicalAnalysisId?)`
Generates an insurance verification report PDF.

**Parameters:**
- `report` (InspectionReport): The inspection data object
- `historicalAnalysis` (HistoricalAnalysis): The historical analysis data
- `inspectionId` (string, optional): UUID of saved inspection
- `historicalAnalysisId` (string, optional): UUID of saved analysis

**Returns:** Promise<void>

**Throws:** Error if generation fails

### `saveInspection(report)`
Saves an inspection report to the database.

**Parameters:**
- `report` (InspectionReport): The inspection data to save

**Returns:** Promise<string | null> - The inspection ID or null if failed

### `saveHistoricalAnalysis(analysis)`
Saves a historical analysis to the database.

**Parameters:**
- `analysis` (HistoricalAnalysis): The analysis data to save

**Returns:** Promise<string | null> - The analysis ID or null if failed

## Testing

### Manual Testing
1. Complete an inspection with all fields filled
2. Click "Save Inspection"
3. Click "Download Full PDF Report"
4. Verify PDF opens and contains all sections
5. Check formatting, colors, and page breaks

### Edge Function Testing
```bash
# Test inspection PDF generation
curl -X POST https://[project-ref].supabase.co/functions/v1/generate-inspection-pdf \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{"inspectionId": "[uuid]"}'

# Test insurance PDF generation
curl -X POST https://[project-ref].supabase.co/functions/v1/generate-insurance-pdf \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{"inspectionId": "[uuid]", "historicalAnalysisId": "[uuid]"}'
```

## Support

For issues or questions:
1. Check Edge Function logs in Supabase dashboard
2. Review error messages in app console
3. Verify database tables have correct data
4. Ensure user is authenticated

## License

This PDF generation system is part of the Property Inspection App and follows the same license terms.
