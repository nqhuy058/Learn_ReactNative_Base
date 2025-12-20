import { APP_COLOR } from '../../utils/constant';
import { FontAwesome } from '@react-native-vector-icons/fontawesome';
import { forwardRef, useState } from "react";
import { KeyboardTypeOptions, Platform, ReturnKeyTypeOptions, StyleProp, StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";

interface IProps {
    title?: string;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    value: any;
    setValue?: (v: any) => void;
    onChangeText?: any;
    onBlur?: any;
    error?: any;
    touched?: any;
    editable?: any;
    placeholder?: string;
    multiline?: boolean;
    numberOfLines?: number;
    style?: StyleProp<ViewStyle>;
    returnKeyType?: ReturnKeyTypeOptions; // 'next', 'done', 'go', ...
    onSubmitEditing?: () => void;         // Hàm chạy khi bấm nút enter trên phím
    blurOnSubmit?: boolean;               // Có ẩn bàn phím khi submit không?
    textColor?: string;
}

const ShareInput = forwardRef<TextInput, IProps>((props, ref) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
    const { title, keyboardType, secureTextEntry = false,
        value, setValue, onChangeText, onBlur,
        error, touched, editable = true, placeholder = "",
        multiline = false, numberOfLines, returnKeyType,
        onSubmitEditing, blurOnSubmit, textColor = APP_COLOR.BLACK,
    } = props;

    return (
        <View style={styles.inputGroup}>
            {title && (
                <Text style={[
                    styles.label,
                    { color: textColor }
                ]}>
                    {title}
                </Text>
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    ref={ref}
                    editable={editable}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={(e) => {
                        if (onBlur)
                            onBlur(e);
                        setIsFocused(false);
                    }}
                    keyboardType={keyboardType}
                    placeholder={placeholder}
                    placeholderTextColor="#65676B"
                    style={[
                        styles.input,
                        isFocused && styles.inputFocused,
                        multiline && { height: 100, textAlignVertical: 'top' }
                    ]}
                    secureTextEntry={secureTextEntry && !isShowPassword}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    blurOnSubmit={blurOnSubmit}
                />
                {secureTextEntry &&
                    <FontAwesome
                        style={styles.eye}
                        name={isShowPassword ? "eye" : "eye-slash"}
                        size={18}
                        color={"#65676B"}
                        onPress={() => setIsShowPassword(!isShowPassword)}
                    />
                }
            </View>
            {error && touched && <Text style={styles.errorText}>{error}</Text>}
        </View>
    )
});

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
    },
    inputContainer: {
        position: "relative",
        justifyContent: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 15,
        backgroundColor: APP_COLOR.WHITE,
        fontSize: 16,
        color: APP_COLOR.BLACK,
    },
    inputFocused: {
        borderColor: APP_COLOR.BLACK,
        backgroundColor: APP_COLOR.WHITE,
    },
    eye: {
        position: 'absolute',
        right: 15,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    }
})

export default ShareInput;