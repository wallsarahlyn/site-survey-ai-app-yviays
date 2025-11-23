
import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator, TextInputProps } from 'react-native';
import { useThemeContext } from '@/contexts/ThemeContext';
import { IconSymbol } from './IconSymbol';

interface AddressComponents {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  streetNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChangeText?: (text: string) => void;
  onAddressSelect: (addressComponents: AddressComponents) => void;
  placeholder?: string;
  multiline?: boolean;
}

interface AddressSuggestion {
  description: string;
  place_id: string;
}

export function AddressAutocomplete({ 
  value, 
  onChangeText,
  onAddressSelect, 
  placeholder = 'Enter address',
  multiline = false,
}: AddressAutocompleteProps) {
  const { colors } = useThemeContext();
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (inputValue.length > 2) {
        fetchSuggestions(inputValue);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValue]);

  const fetchSuggestions = async (query: string) => {
    // Note: Google Maps API integration would go here
    // For now, we'll use a simple validation approach
    console.log('Address autocomplete query:', query);
    
    // Mock suggestions for demonstration
    // In production, this would call Google Places API
    const mockSuggestions: AddressSuggestion[] = [
      { description: query, place_id: '1' },
    ];
    
    setSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion: AddressSuggestion) => {
    setInputValue(suggestion.description);
    
    // Mock address components - in production, this would come from Google Places Details API
    const mockAddressComponents: AddressComponents = {
      formattedAddress: suggestion.description,
      latitude: 37.7749, // Mock coordinates
      longitude: -122.4194,
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA',
    };
    
    onAddressSelect(mockAddressComponents);
    if (onChangeText) {
      onChangeText(suggestion.description);
    }
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleChangeText = (text: string) => {
    setInputValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
    if (text.length === 0) {
      const emptyAddress: AddressComponents = {
        formattedAddress: '',
        latitude: 0,
        longitude: 0,
      };
      onAddressSelect(emptyAddress);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
        <IconSymbol 
          ios_icon_name="location.fill" 
          android_material_icon_name="location_on" 
          size={20} 
          color={colors.textSecondary} 
        />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={inputValue}
          onChangeText={handleChangeText}
          onFocus={() => inputValue.length > 2 && setShowSuggestions(true)}
          onBlur={handleBlur}
          autoCapitalize="words"
          autoCorrect={false}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
        {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={[styles.suggestionsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
                onPress={() => handleSelectSuggestion(item)}
              >
                <IconSymbol 
                  ios_icon_name="mappin.circle.fill" 
                  android_material_icon_name="place" 
                  size={18} 
                  color={colors.primary} 
                />
                <Text style={[styles.suggestionText, { color: colors.text }]}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    minHeight: 40,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 55,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
  },
});
