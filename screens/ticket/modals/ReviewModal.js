import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Animated,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

import { AntDesign } from '@expo/vector-icons'; // Make sure you have expo/vector-icons installed
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('window');

const ReviewModal = ({ visible, onClose, onSubmit, bookingId }) => {
    const { t } = useTranslation();
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const slideAnim = useRef(new Animated.Value(height)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: height,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, slideAnim]);

    const handleSubmit = () => {
        if (rating === 0) {
            alert(t('rating_required'));
            return;
        }

        onSubmit({
            bookingId,
            rating,
            content: review
        });

        // Reset form
        setRating(0);
        setReview('');
        onClose();
    };

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: height,
            duration: 300,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <AntDesign
                        name={i <= rating ? 'star' : 'staro'}
                        size={30}
                        color={i <= rating ? '#F59E0B' : '#D1D5DB'}
                        style={styles.star}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    const ratingTexts = {
        1: t('very_dissatisfied'),
        2: t('dissatisfied'),
        3: t('neutral'),
        4: t('satisfied'),
        5: t('very_satisfied'),
    };
    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.keyboardView}
                        >
                            <Animated.View
                                style={[
                                    styles.modalContainer,
                                    { transform: [{ translateY: slideAnim }] }
                                ]}
                            >
                                <View style={styles.handle} />

                                <Text style={styles.title}>{t('review')}</Text>

                                <View style={styles.ratingContainer}>
                                    {renderStars()}
                                </View>

                                <Text style={styles.ratingText}>
                                    {rating === 0 ? t('choose_rating') : ratingTexts[rating]}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t('share_experience')}
                                    multiline
                                    numberOfLines={5}
                                    value={review}
                                    onChangeText={setReview}
                                />

                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity
                                        style={[styles.button, styles.cancelButton]}
                                        onPress={handleClose}
                                    >
                                        <Text style={styles.cancelButtonText}>{t('cancel')}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.submitButton,
                                            rating === 0 ? styles.disabledButton : null
                                        ]}
                                        onPress={handleSubmit}
                                        disabled={rating === 0}
                                    >
                                        <Text style={styles.submitButtonText}>{t('submit_review')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    keyboardView: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    star: {
        marginHorizontal: 5,
    },
    ratingText: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
        color: '#4B5563',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 12,
        height: 120,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        borderRadius: 8,
        padding: 15,
        flex: 1,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#4B5563',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#4E72E3',
        marginLeft: 10,
    },
    disabledButton: {
        backgroundColor: '#A5B4FC',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: '600',
    },
});

export default ReviewModal;