import React, { useRef } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import ShareInput from '../input/share.input';
import ShareButton from '../button/share.button';
import { APP_COLOR } from '../../utils/constant';
import { ThemeColors } from '../theme/themeContext';

interface EditProfileFormProps {
    user: any;
    editedUser: any;
    setEditedUser: (u: any) => void;
    onSave: () => void;
    onCancel: () => void;
    colors: ThemeColors;
}

const EditProfileForm = ({ user, editedUser, setEditedUser, onSave, onCancel, colors }: EditProfileFormProps) => {
    const styles = createStyles(colors);
    const nameRef = useRef<TextInput>(null);

    return (
        <View>
            <Text style={styles.sectionTitle}>Chỉnh sửa thông tin</Text>
            <ShareInput
                title='Họ'
                value={editedUser.firstName}
                onChangeText={(text: string) => setEditedUser({ ...editedUser, firstName: text })}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => nameRef.current?.focus()}
                blurOnSubmit={false}
                textColor={colors.text}
            />
            <ShareInput
                ref={nameRef}
                title="Tên"
                value={editedUser.lastName}
                onChangeText={(text: string) => setEditedUser({ ...editedUser, lastName: text })}
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={onSave}
                textColor={colors.text}
            />
            <ShareInput
                title="Ngày sinh"
                value={user.dob}
                editable={false}
                style={styles.inputDisabled}
                textColor={colors.text}
            />
            <ShareInput
                title="Email"
                value={editedUser.email}
                editable={false}
                style={styles.inputDisabled}
                textColor={colors.text}
            />

            <View style={styles.buttonGroup}>
                <ShareButton tittle="Lưu" onPress={onSave} btnStyle={[styles.button, styles.saveButton]} textStyle={styles.buttonText} />
                <ShareButton tittle="Hủy" onPress={onCancel} btnStyle={[styles.button, styles.cancelButton]} textStyle={[styles.buttonText, styles.cancelButtonText]} />
            </View>
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: colors.text,
        alignSelf: 'center'
    },
    input: {
        backgroundColor: colors.card,
        color: colors.text,
        borderColor: colors.border
    },
    inputDisabled: {
        backgroundColor: colors.card,
        color: colors.subText,
        borderColor: colors.border,
        opacity: 0.7
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
        alignSelf: 'center'
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 12
    },
    saveButton: {
        backgroundColor: APP_COLOR.BLUE_LIGHT
    },
    cancelButton: {
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: APP_COLOR.WHITE
    },
    cancelButtonText: {
        color: colors.text
    },
});

export default EditProfileForm;