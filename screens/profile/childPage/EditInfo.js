import { StyleSheet } from "react-native";

export default function EditInfo() {
    const renderHeader = () => (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.arrowBack}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#4E72E3" />
          </TouchableOpacity>
          <Text style={styles.textHeader}>Hồ sơ </Text>
        </View>
      );
}

const styles = StyleSheet.create({});