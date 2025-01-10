import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import CustomButton from './Button';

/**
 * @example
 * <ConfirmationPopup
         visible={isPopupVisible}
         title="Hủy đặt phòng"
         message="Bạn có chắc chắn muốn huỷ đặt phòng này không?"
         cancelText="Huỷ"
         confirmText="Đăng xuất"
         onCancel={handleCancel}
         onConfirm={handleConfirm}
       />
 * @param {visible, title, message, confirmText, cancelText, onConfirm, onCancel} props 
 * @returns PopupConfirm
 */


export default function PopupConfirm(props) {
    const {
        visible,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm,
        onCancel,
    } = props;

    return (
        <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
            >
            <CustomButton
                  title={cancelText}
                  backgroundColor="#fff"
                  disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                  titleColor="#000000"
                  disabledTitleColor="#FFFFFF"
                  loading={null}
                  disabled={null}
                  onPress={onCancel}
                  style={{minWidth : 120, maxWidth :150, borderWidth:1, borderColor: "#cecece"}}
                />
            </TouchableOpacity>
            <TouchableOpacity
            >
              <CustomButton
                  title={confirmText}
                  backgroundColor="#101828"
                  disabledBackgroundColor="rgba(26, 39, 65, 0.5)"
                  titleColor="#fff"
                  disabledTitleColor="#FFFFFF"
                  loading={null}
                  disabled={null}
                  onPress={onConfirm}
                  style={{minWidth : 120, maxWidth :150}}
                />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    );
}

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      width: '80%',
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 10,
    },
    message: {
      fontSize: 16,
      color: '#7D7D7D',
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    cancelButton: {
      borderColor: '#D9D9D9',
      borderWidth: 1,
      backgroundColor: '#fff',
    },
    confirmButton: {
      backgroundColor: '#000',
    },
    cancelText: {
      color: '#000',
      fontWeight: 'bold',
    },
    confirmText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });