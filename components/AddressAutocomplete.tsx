
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from './IconSymbol';

interface AddressSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface AddressComponents {
  streetNumber?: string;
  route?: string;
  locality?: string;
  administrativeAreaLevel1?: string;
  postalCode?: string;
  country?: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
}

interface AddressAutocompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  onAddressSelect?: (address: AddressComponents) => void;
  placeholder?: string;
  editable?: boolean;
  multiline?: boolean;
  style?: any;
}

export function AddressAutocomplete({
  value,
  onChangeText,
  onAddressSelect,
  placeholder = 'Enter property address',
  editable = true,
  multiline = false,
  style,
}: AddressAutocompleteProps) {
  const { colors } = useTheme();
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Google Maps API key - should be stored in environment variables
  const GOOGLE_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Replace with actual key

  useEffect(() => {
    // Clear suggestions when value is empty
    if (!value || value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setError(null);
      return;
    }

    // Debounce the API call
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchAddressSuggestions(value);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [value]);

  const fetchAddressSuggestions = async (input: string) => {
    if (GOOGLE_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      // Show warning if API key is not configured
      setError('Google Maps API key not configured. Please add your API key to enable address autocomplete.');
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          input
        )}&types=address&components=country:us&key=${GOOGLE_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        const formattedSuggestions: AddressSuggestion[] = data.predictions.map(
          (prediction: any) => ({
            placeId: prediction.place_id,
            description: prediction.description,
            mainText: prediction.structured_formatting.main_text,
            secondaryText: prediction.structured_formatting.secondary_text,
          })
        );

        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } else if (data.status === 'ZERO_RESULTS') {
        setSuggestions([]);
        setShowSuggestions(false);
        setError('No addresses found. Please try a different search.');
      } else if (data.status === 'REQUEST_DENIED') {
        setError('Google Maps API access denied. Please check your API key configuration.');
        setSuggestions([]);
        setShowSuggestions(false);
      } else {
        console.error('Google Places API error:', data.status, data.error_message);
        setError('Failed to fetch address suggestions. Please try again.');
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error('Error fetching address suggestions:', err);
      setError('Network error. Please check your connection and try again.');
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    if (GOOGLE_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_components,formatted_address,geometry&key=${GOOGLE_API_KEY}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const result = data.result;
        const components: AddressComponents = {
          formattedAddress: result.formatted_address,
          latitude: result.geometry.location.lat,
          longitude: result.geometry.location.lng,
        };

        // Parse address components
        result.address_components.forEach((component: any) => {
          const types = component.types;
          if (types.includes('street_number')) {
            components.streetNumber = component.long_name;
          } else if (types.includes('route')) {
            components.route = component.long_name;
          } else if (types.includes('locality')) {
            components.locality = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            components.administrativeAreaLevel1 = component.short_name;
          } else if (types.includes('postal_code')) {
            components.postalCode = component.long_name;
          } else if (types.includes('country')) {
            components.country = component.long_name;
          }
        });

        return components;
      } else {
        console.error('Google Place Details API error:', data.status);
        setError('Failed to get address details. Please try again.');
        return null;
      }
    } catch (err) {
      console.error('Error fetching place details:', err);
      setError('Network error. Please check your connection and try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    onChangeText(suggestion.description);
    setShowSuggestions(false);
    setSuggestions([]);

    if (onAddressSelect) {
      const details = await getPlaceDetails(suggestion.placeId);
      if (details) {
        onAddressSelect(details);
      }
    }
  };

  const handleClearInput = () => {
    onChangeText('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <IconSymbol
            ios_icon_name="location.fill"
            android_material_icon_name="location_on"
            size={20}
            color={colors.textSecondary}
            style={styles.inputIcon}
          />
          <TextInput
            style={[
              styles.input,
              multiline && styles.multilineInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: error ? colors.error : colors.border,
              },
            ]}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
          />
          {value.length > 0 && editable && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearInput}
            >
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="cancel"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
          {isLoading && (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={styles.loadingIndicator}
            />
          )}
        </View>
      </View>

      {error && (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: `${colors.error}15`, borderColor: colors.error },
          ]}
        >
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="warning"
            size={16}
            color={colors.error}
          />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <View
          style={[
            styles.suggestionsContainer,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <ScrollView
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={suggestion.placeId}
                style={[
                  styles.suggestionItem,
                  {
                    borderBottomColor: colors.border,
                    borderBottomWidth: index < suggestions.length - 1 ? 1 : 0,
                  },
                ]}
                onPress={() => handleSelectSuggestion(suggestion)}
              >
                <View style={styles.suggestionIcon}>
                  <IconSymbol
                    ios_icon_name="mappin.circle.fill"
                    android_material_icon_name="place"
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.suggestionTextContainer}>
                  <Text style={[styles.suggestionMainText, { color: colors.text }]}>
                    {suggestion.mainText}
                  </Text>
                  <Text
                    style={[styles.suggestionSecondaryText, { color: colors.textSecondary }]}
                  >
                    {suggestion.secondaryText}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {GOOGLE_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' && (
        <View
          style={[
            styles.warningContainer,
            { backgroundColor: '#FFF9E6', borderColor: '#F59E0B' },
          ]}
        >
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="warning"
            size={20}
            color="#F59E0B"
          />
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>Google Maps API Not Configured</Text>
            <Text style={styles.warningText}>
              To enable address autocomplete and validation:
            </Text>
            <Text style={styles.warningStep}>
              1. Get a Google Maps API key from Google Cloud Console
            </Text>
            <Text style={styles.warningStep}>
              2. Enable Places API and Geocoding API
            </Text>
            <Text style={styles.warningStep}>
              3. Replace YOUR_GOOGLE_MAPS_API_KEY in AddressAutocomplete.tsx
            </Text>
            <Text style={styles.warningStep}>
              4. Restrict the API key to your app's bundle ID/package name
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingLeft: 48,
    paddingRight: 48,
    fontSize: 16,
  },
  multilineInput: {
    height: 80,
    paddingTop: 16,
    paddingBottom: 16,
    textAlignVertical: 'top',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  loadingIndicator: {
    position: 'absolute',
    right: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  suggestionsContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 300,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  suggestionSecondaryText: {
    fontSize: 14,
    lineHeight: 18,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 12,
  },
  warningTextContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    marginBottom: 8,
    lineHeight: 20,
  },
  warningStep: {
    fontSize: 13,
    color: '#92400E',
    marginTop: 4,
    lineHeight: 18,
  },
});
