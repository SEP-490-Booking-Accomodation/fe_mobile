import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const AmenitiesModal = ({ visible, onClose, amenities = [], selectedAmenities = [], onSelectAmenity }) => {
  const { t } = useTranslation();

  const handleSelectAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      onSelectAmenity(selectedAmenities.filter(item => item !== amenity));
    } else {
      onSelectAmenity([...selectedAmenities, amenity]);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('amenities')}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.amenitiesList}>
            {amenities.map((amenity, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.amenityItem,
                  selectedAmenities.includes(amenity) && styles.selectedAmenityItem,
                ]}
                onPress={() => handleSelectAmenity(amenity)}
              >
                <Text style={[
                  styles.amenityText,
                  selectedAmenities.includes(amenity) && styles.selectedAmenityText,
                ]}>
                  {amenity}
                </Text>
                {selectedAmenities.includes(amenity) && (
                  <FontAwesome5 name="check" size={16} color="#4E72E3" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>{t('done')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  amenitiesList: {
    padding: 16,
  },
  amenityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  selectedAmenityItem: {
    backgroundColor: 'rgba(78, 114, 227, 0.1)',
  },
  amenityText: {
    fontSize: 16,
    color: '#333',
  },
  selectedAmenityText: {
    color: '#4E72E3',
    fontWeight: '500',
  },
  doneButton: {
    backgroundColor: '#4E72E3',
    margin: 16,
    padding: 16,
    borderRadius: 100,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AmenitiesModal; 