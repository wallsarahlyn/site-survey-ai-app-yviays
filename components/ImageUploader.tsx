
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useThemeContext } from '@/contexts/ThemeContext';
import { UploadedImage } from '@/types/inspection';
import { IconSymbol } from './IconSymbol';

interface ImageUploaderProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

export default function ImageUploader({ images, onImagesChange, maxImages = 10 }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useThemeContext();

  const pickImages = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Maximum Images', `You can only upload up to ${maxImages} images.`);
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }

      setIsLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxImages - images.length,
      });

      if (!result.canceled && result.assets) {
        const newImages: UploadedImage[] = result.assets.map((asset, index) => ({
          id: `${Date.now()}-${index}`,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName || `image-${Date.now()}-${index}.jpg`,
          uploadedAt: new Date(),
        }));

        onImagesChange([...images, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const takePhoto = async () => {
    if (images.length >= maxImages) {
      Alert.alert('Maximum Images', `You can only upload up to ${maxImages} images.`);
      return;
    }

    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access your camera.');
        return;
      }

      setIsLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const newImage: UploadedImage = {
          id: `${Date.now()}`,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName || `photo-${Date.now()}.jpg`,
          uploadedAt: new Date(),
        };

        onImagesChange([...images, newImage]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter(img => img.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]} 
          onPress={pickImages}
          disabled={isLoading}
        >
          <IconSymbol 
            ios_icon_name="photo.on.rectangle" 
            android_material_icon_name="photo_library" 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.buttonText}>Choose Photos</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton, { backgroundColor: colors.secondary }]} 
          onPress={takePhoto}
          disabled={isLoading}
        >
          <IconSymbol 
            ios_icon_name="camera.fill" 
            android_material_icon_name="camera_alt" 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {images.length > 0 && (
        <View style={styles.imagesContainer}>
          <Text style={[styles.imageCount, { color: colors.textSecondary }]}>{images.length} image(s) uploaded</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {images.map((image) => (
              <View key={image.id} style={styles.imageWrapper}>
                <Image source={{ uri: image.uri }} style={[styles.image, { backgroundColor: colors.border }]} />
                <TouchableOpacity 
                  style={[styles.removeButton, { backgroundColor: colors.card }]}
                  onPress={() => removeImage(image.id)}
                >
                  <IconSymbol 
                    ios_icon_name="xmark.circle.fill" 
                    android_material_icon_name="cancel" 
                    size={24} 
                    color={colors.error} 
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  imagesContainer: {
    marginTop: 8,
  },
  imageCount: {
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  imageScroll: {
    flexDirection: 'row',
  },
  imageWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 12,
  },
});
