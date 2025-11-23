
# InspectAI API Setup Guide

This guide explains how to configure the API integrations for the InspectAI app.

## Overview

InspectAI uses multiple APIs to provide comprehensive property inspection features:

1. **OpenAI GPT-4 Vision** - AI-powered image analysis (via Supabase Edge Functions)
2. **Google Maps API** - Address autocomplete, validation, and geocoding
3. **Historical Data APIs** - Weather, storm, and risk data (via Supabase Edge Functions)

## Required API Keys

### 1. OpenAI API Key (Required for AI Analysis)
- **Variable Name:** `OPENAI_API_KEY`
- **Purpose:** Powers the AI image analysis feature
- **Where to set:** Supabase Edge Functions secrets
- **How to get it:**
  1. Go to https://platform.openai.com/
  2. Sign up or log in
  3. Navigate to API Keys section
  4. Create a new API key
  5. Copy the key (starts with `sk-`)

**Setting in Supabase:**
```bash
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

### 2. Google Maps API Key (Required for Address Features)
- **Variable Name:** `GOOGLE_MAPS_API_KEY`
- **Purpose:** Address autocomplete, validation, and geocoding
- **Where to set:** Client-side code (AddressAutocomplete.tsx)
- **How to get it:**
  1. Go to https://console.cloud.google.com/
  2. Create a new project or select existing
  3. Enable the following APIs:
     - **Places API** (for address autocomplete)
     - **Geocoding API** (for address validation and coordinates)
     - **Maps JavaScript API** (optional, for satellite imagery)
  4. Go to "Credentials" → "Create Credentials" → "API Key"
  5. Copy the API key
  6. **Important:** Restrict the API key:
     - For mobile apps: Add your iOS bundle ID and Android package name
     - For web: Add your domain (e.g., natively.dev)
     - Restrict to only the APIs you enabled above

**Setting in the app:**
1. Open `components/AddressAutocomplete.tsx`
2. Find the line: `const GOOGLE_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';`
3. Replace `'YOUR_GOOGLE_MAPS_API_KEY'` with your actual API key

**Example:**
```typescript
const GOOGLE_API_KEY = 'AIzaSyC1234567890abcdefghijklmnopqrstuv';
```

### 3. OpenWeather API Key (Optional)
- **Variable Name:** `OPENWEATHER_API_KEY`
- **Purpose:** Fetches weather pattern data
- **Where to set:** Supabase Edge Functions secrets
- **How to get it:**
  1. Go to https://openweathermap.org/api
  2. Sign up for a free account
  3. Navigate to API Keys
  4. Copy your API key

**Setting in Supabase:**
```bash
supabase secrets set OPENWEATHER_API_KEY=your-key-here
```

### 4. NOAA API Key (Optional)
- **Variable Name:** `NOAA_API_KEY`
- **Purpose:** Fetches storm event data
- **Where to set:** Supabase Edge Functions secrets
- **How to get it:**
  1. Go to https://www.ncdc.noaa.gov/cdo-web/token
  2. Request a token via email
  3. Copy the token when received

**Setting in Supabase:**
```bash
supabase secrets set NOAA_API_KEY=your-token-here
```

## Google Maps API Setup (Detailed)

### Step 1: Create a Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Enter project name (e.g., "InspectAI")
4. Click "Create"

### Step 2: Enable Required APIs
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for and enable each of these APIs:
   - **Places API** - For address autocomplete suggestions
   - **Geocoding API** - For converting addresses to coordinates
   - **Maps JavaScript API** - (Optional) For satellite imagery

### Step 3: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key immediately

### Step 4: Restrict API Key (Important for Security)
1. Click on the newly created API key to edit it
2. Under "Application restrictions":
   - For **iOS**: Select "iOS apps" and add your bundle ID
   - For **Android**: Select "Android apps" and add your package name and SHA-1 fingerprint
   - For **Web**: Select "HTTP referrers" and add your domain
3. Under "API restrictions":
   - Select "Restrict key"
   - Check only the APIs you enabled (Places API, Geocoding API, etc.)
4. Click "Save"

### Step 5: Set Up Billing (Required)
Google Maps APIs require a billing account, but they offer:
- **$200 free credit per month**
- Pay-as-you-go pricing after free credit

**Pricing (as of 2024):**
- Places Autocomplete: $2.83 per 1,000 requests (first 100,000 free monthly)
- Geocoding: $5.00 per 1,000 requests (first 40,000 free monthly)

### Step 6: Add API Key to Your App
1. Open `components/AddressAutocomplete.tsx`
2. Replace `'YOUR_GOOGLE_MAPS_API_KEY'` with your actual API key
3. Save the file

## Testing the APIs

### Test AI Image Analysis:
1. Sign in to the app (Profile tab)
2. Go to Inspection tab
3. Enter a property address
4. Upload property images
5. Click "Analyze with AI"

### Test Address Autocomplete:
1. Go to Insurance tab or Drawing tab
2. Start typing an address in the address field
3. You should see autocomplete suggestions appear
4. Select an address to validate and geocode it

### Test Historical Data:
1. Sign in to the app (Profile tab)
2. Go to Insurance tab
3. Enter a property address using autocomplete
4. Click "Fetch Historical Data"

## API Costs & Usage

### OpenAI GPT-4 Vision:
- **Model:** gpt-4o
- **Cost:** ~$0.01-0.03 per image analysis
- **Usage:** Called when analyzing property images
- **Monthly estimate:** $10-50 for 500-1,000 analyses

### Google Maps:
- **Free tier:** $200 credit per month
- **Places Autocomplete:** $2.83 per 1,000 requests
- **Geocoding:** $5.00 per 1,000 requests
- **Monthly estimate:** Free for most users (under $200/month)

### OpenWeather:
- **Free tier:** 1,000 calls/day
- **Cost after:** Paid plans available
- **Monthly estimate:** Free for most users

### NOAA:
- **Free:** No cost, but rate limited
- **Monthly estimate:** $0

## Fallback Behavior

If API keys are not configured:
- **AI Analysis:** Will use mock data with realistic patterns
- **Address Autocomplete:** Will show a warning message and allow manual entry
- **Historical Data:** Will use mock data with realistic patterns
- **Geocoding:** Will use approximate coordinates

The app will continue to work with mock data, but real API integration provides:
- More accurate property assessments
- Validated and standardized addresses
- Real-time weather and storm data
- Actual historical risk analysis
- Better insurance underwriting data

## Security Best Practices

1. **Never commit API keys to version control**
   - Add API keys to `.gitignore`
   - Use environment variables for sensitive data

2. **Restrict API keys properly**
   - Limit to specific APIs
   - Limit to specific platforms (iOS, Android, Web)
   - Add bundle ID/package name restrictions

3. **Monitor API usage**
   - Set up billing alerts in Google Cloud Console
   - Monitor OpenAI usage dashboard
   - Review Supabase Edge Function logs

4. **Rotate API keys periodically**
   - Change keys every 3-6 months
   - Immediately rotate if compromised

5. **Use different keys for development and production**
   - Create separate Google Cloud projects
   - Use separate OpenAI API keys

## Troubleshooting

### "Google Maps API key not configured" error:
- Verify you replaced `'YOUR_GOOGLE_MAPS_API_KEY'` in AddressAutocomplete.tsx
- Check that the API key is correct (no extra spaces)
- Ensure Places API is enabled in Google Cloud Console

### "REQUEST_DENIED" error:
- Check that Places API and Geocoding API are enabled
- Verify API key restrictions allow your app
- Ensure billing is set up in Google Cloud Console

### "Failed to analyze images" error:
- Check OpenAI API key is valid
- Verify you have credits in your OpenAI account
- Check the Edge Function logs in Supabase

### "Failed to fetch historical data" error:
- Verify the address is valid
- Check API keys are configured in Supabase
- Review Edge Function logs for specific errors

### Address autocomplete not showing suggestions:
- Verify Google Maps API key is set correctly
- Check that Places API is enabled
- Ensure you're typing at least 3 characters
- Check browser/app console for error messages

## Support & Resources

### Google Maps API:
- Documentation: https://developers.google.com/maps/documentation
- Support: https://developers.google.com/maps/support
- Pricing: https://developers.google.com/maps/billing-and-pricing/pricing

### OpenAI API:
- Documentation: https://platform.openai.com/docs
- Support: https://help.openai.com/
- Pricing: https://openai.com/pricing

### Supabase:
- Documentation: https://supabase.com/docs
- Support: https://supabase.com/support
- Edge Functions: https://supabase.com/docs/guides/functions

### InspectAI App:
- Check the app logs for detailed error messages
- Review Edge Function logs in Supabase dashboard
- Check browser console for client-side errors
