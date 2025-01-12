import React, { useState } from 'react';
import { Modal, Text, View } from 'react-native';
import ButtonGroup from '../components/ButtonGroup';
import MultiSelectButtonGroup from '../components/MultiSelectButtonGroup';
import IconButton from '../components/IconButton';
import BottomTabs from '../components/BottomTabs';
import Filter from '../components/Filter';
import Tag from '../components/Tag';
import MapWithPopup from '../components/MapWithPopup';

const HomeScreen = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndexes1, setSelectedIndexes1] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#E5E7EB' }}>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <BottomTabs navigation={navigation} />
      </View>
    </View>
  );
};

export default HomeScreen;
