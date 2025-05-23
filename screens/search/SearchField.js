import { AntDesign } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import { useTranslation } from "react-i18next"

const SearchField = ({
  placeholder = "search_placeholder",
  onChangeText,
  onSubmitEditing,
  value,
  backIcon = true,
  filterIcon = true,
  onPressBack,
  onPressBackIcon,
  onPressFilterIcon = () => {},
  style,
  inputStyle,
  editable = true,
  enableSearch = false,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleSearchPress = () => {
    if (enableSearch) {
      return
    }
    navigation.goBack()
    navigation.navigate("SearchScreen", { searchQuery: value })
  }

  const handleBackPress = () => {
    if (onPressBackIcon) {
      onPressBackIcon()
    } else if (onPressBack) {
      onPressBack()
    } else {
      navigation.goBack()
    }
  }

  const handleSubmit = () => {
    if (onSubmitEditing) {
      onSubmitEditing()
    }
    Keyboard.dismiss()
  }

  return (
    <View style={[styles.wrapper, style]}>
      {backIcon && (
        <TouchableOpacity onPress={handleBackPress} style={styles.iconBackContainer}>
          <View style={styles.iconBack}>
            <Icon name="arrow-back-outline" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
      
      {enableSearch ? (
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={[styles.input, inputStyle]}
            placeholder={t(placeholder)}
            placeholderTextColor="#aaa"
            onChangeText={onChangeText}
            onSubmitEditing={handleSubmit}
            value={value}
            editable={editable}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      ) : (
        <TouchableOpacity style={styles.touchSearchContainer} onPress={handleSearchPress}>
          <View style={styles.searchContainer}>
            <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={[styles.input, inputStyle]}
              placeholder={t(placeholder)}
              placeholderTextColor="#aaa"
              onChangeText={onChangeText}
              value={value}
              editable={false}
            />
          </View>
        </TouchableOpacity>
      )}

      {filterIcon && (
        <TouchableOpacity onPress={onPressFilterIcon}>
          <View style={styles.iconFilter}>
            <AntDesign name="filter" size={26} color="#fff" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    // flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f7f7f7",
    borderRadius: 30,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  touchSearchContainer: {
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
    color: "#4E72E3",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  iconBackContainer: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  iconBack: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "#6F8EF1",
  },

  iconFilter: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#6F8EF1",
    marginLeft: 20,
  },
})

export default SearchField
