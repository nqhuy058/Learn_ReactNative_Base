import React from 'react';
import { View, Text, Modal, Pressable, StyleSheet } from 'react-native';
import ShareButton from '../button/share.button';
import { APP_COLOR } from '../../utils/constants/constant';
import { ThemeColors } from '../../components/theme/themeContext';

interface AvatarPickerModalProps {
    visible: boolean;
    onClose: () => void;
    onCamera: () => void;
    onGallery: () => void;
    colors: ThemeColors;
}

const AvatarPickerModal = ({ visible, onClose, onCamera, onGallery, colors }: AvatarPickerModalProps) => {
    const styles = createStyles(colors);

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.modalBackdrop} onPress={onClose}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Chọn ảnh đại diện</Text>
                    <View style={styles.modalButtonGroup}>
                        <ShareButton
                            tittle="Chụp ảnh"
                            onPress={onCamera}
                            backgroundColor={APP_COLOR.BLUE_LIGHT}
                            textStyle={styles.modalBtnText}
                        />
                        <ShareButton
                            tittle="Chọn từ thư viện"
                            onPress={onGallery}
                            backgroundColor={APP_COLOR.BLUE_LIGHT}
                            textStyle={styles.modalBtnText}
                        />
                    </View>
                    <ShareButton
                        tittle="Đóng"
                        onPress={onClose}
                        backgroundColor={colors.card}
                        borderWidth={1}
                        borderColor={colors.border}
                        textStyle={styles.modalBtnTextClose}
                    />
                </View>
            </Pressable>
        </Modal>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 32
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: colors.text
    },
    modalButtonGroup: {
        gap: 12,
        marginBottom: 12
    },
    modalBtn: {
        backgroundColor: APP_COLOR.BLUE_LIGHT,
        borderRadius: 12,
        paddingVertical: 12
    },
    modalBtnText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: APP_COLOR.WHITE
    },
    modalBtnTextClose: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text
    },
    closeBtn: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border
    },
});

export default AvatarPickerModal;