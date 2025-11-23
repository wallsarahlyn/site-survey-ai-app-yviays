
# InspectAI API Setup Guide

This guide explains how to configure the API integrations for the InspectAI app.

## Overview

InspectAI uses Supabase Edge Functions to securely call external APIs:

1. **analyze-images** - Uses OpenAI GPT-4 Vision to analyze property images
2. **fetch-historical-data** - Fetches historical weather, storm, and risk data

## Required Environment Variables

You need to set up the following environment variables in your Supabase project:

### 1. OpenAI API Key (Required)
- **Variable Name:** `OPENAI_API_KEY`
- **Purpose:** Powers the AI image analysis feature
- **How to get it:**
  1. Go to https://platform.openai.com/
  2. Sign up or log in
  3. Navigate to API Keys section
  4. Create a new API key
  5. Copy the key (starts with `sk-`)

### 2. Google Maps API Key (Optional)
- **Variable Name:** `GOOGLE_MAPS_API_KEY`
- **Purpose:** Geocodes addresses to coordinates for historical data
- **How to get it:**
  1. Go to https://console.cloud.google.com/
  2. Create a new project or select existing
  3. Enable "Geocoding API"
  4. Create credentials (API Key)
  5. Copy the API key

### 3. OpenWeather API Key (Optional)
- **Variable Name:** `OPENWEATHER_API_KEY`
- **Purpose:** Fetches weather pattern data
- **How to get it:**
  1. Go to https://openweathermap.org/api
  2. Sign up for a free account
  3. Navigate to API Keys
  4. Copy your API key

### 4. NOAA API Key (Optional)
- **Variable Name:** `NOAA_API_KEY`
- **Purpose:** Fetches storm event data
- **How to get it:**
  1. Go to https://www.ncdc.noaa.gov/cdo-web/token
  2. Request a token via email
  3. Copy the token when received

## Setting Environment Variables in Supabase

### Via Supabase Dashboard:
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Edge Functions**
3. Scroll to **Secrets** section
4. Click **Add Secret**
5. Enter the variable name and value
6. Click **Save**

### Via Supabase CLI:
```bash
# Set a single secret
supabase secrets set OPENAI_API_KEY=your_key_here

# Set multiple secrets from a file
supabase secrets set --env-file .env.local
```

## Testing the APIs

### Test AI Image Analysis:
1. Sign in to the app (Profile tab)
2. Go to Inspection tab
3. Enter a property address
4. Upload property images
5. Click "Analyze with AI"

### Test Historical Data:
1. Sign in to the app (Profile tab)
2. Go to Insurance tab
3. Enter a property address
4. Click "Fetch Historical Data"

## API Costs

### OpenAI GPT-4 Vision:
- **Model:** gpt-4o
- **Cost:** ~$0.01-0.03 per image analysis
- **Usage:** Called when analyzing property images

### Google Maps Geocoding:
- **Free tier:** 40,000 requests/month
- **Cost after:** $5 per 1,000 requests

### OpenWeather:
- **Free tier:** 1,000 calls/day
- **Cost after:** Paid plans available

### NOAA:
- **Free:** No cost, but rate limited

## Fallback Behavior

If API keys are not configured:
- **AI Analysis:** Will use mock data with realistic patterns
- **Historical Data:** Will use mock data with realistic patterns
- **Geocoding:** Will use approximate coordinates

The app will continue to work with mock data, but real API integration provides:
- More accurate property assessments
- Real-time weather and storm data
- Actual historical risk analysis
- Better insurance underwriting data

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys periodically
- Monitor API usage to prevent unexpected costs
- Set up billing alerts in API provider dashboards

## Troubleshooting

### "API key not configured" error:
- Verify the environment variable name is correct
- Check that the secret is set in Supabase
- Redeploy the Edge Function after setting secrets

### "Failed to analyze images" error:
- Check OpenAI API key is valid
- Verify you have credits in your OpenAI account
- Check the Edge Function logs in Supabase

### "Failed to fetch historical data" error:
- Verify the address is valid
- Check API keys are configured
- Review Edge Function logs for specific errors

## Support

For issues with:
- **OpenAI API:** https://help.openai.com/
- **Google Maps API:** https://developers.google.com/maps/support
- **Supabase:** https://supabase.com/docs
- **InspectAI App:** Check the app logs and Edge Function logs in Supabase dashboard
