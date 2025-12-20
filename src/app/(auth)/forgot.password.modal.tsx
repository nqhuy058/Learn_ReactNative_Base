import ShareButton from "../../components/button/share.button";
import ShareInput from "../../components/input/share.input";
import { APP_COLOR } from "../../utils/constant";
import { ForgotPasswordSchema } from "../../utils/validate.chema";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const ForgotPasswordModal = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const email = navigation.getState().routes.find(route => route.name === 'forgotPassword')?.params?.email || '';

    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const handleConfirmCode = async (values: any) => {
        const { code } = values;

        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            if (code === '123456') {
                Toast.show({
                    type: 'success',
                    text1: 'Thành công',
                    text2: 'Mật khẩu đã được đặt lại thành công (Mock).'
                });

                // Quay lại màn hình đăng nhập
                navigation.goBack();
                navigation.goBack();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Lỗi',
                    text2: 'Mã xác nhận không đúng.'
                });
            }
        }, 2000);
    };

    const handleResendCode = async () => {
        Toast.show({
            type: 'info',
            text1: 'Đang gửi...',
            text2: 'Đang gửi lại mã xác nhận...'
        });

        setTimeout(() => {
            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: `Đã gửi lại mã tới ${email}`
            });
        }, 2000);
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={APP_COLOR.BLACK} />
                    </Pressable>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>Xác nhận tài khoản</Text>
                            <Text style={styles.subtitle}>
                                Chúng tôi đã gửi mã tới <Text style={{ fontWeight: 'bold' }}>{email}</Text>. Vui lòng nhập mã đó để xác nhận tài khoản của bạn.
                            </Text>
                            <Formik
                                initialValues={{ code: '', password: '', confirmPassword: '' }}
                                validationSchema={ForgotPasswordSchema}
                                onSubmit={handleConfirmCode}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                    <>
                                        <ShareInput
                                            placeholder="Nhập mã xác nhận"
                                            keyboardType="number-pad"
                                            onChangeText={handleChange('code')}
                                            onBlur={handleBlur('code')}
                                            value={values.code}
                                            error={errors.code}
                                            touched={touched.code}
                                            returnKeyType="next"
                                            onSubmitEditing={() => {
                                                passwordRef.current?.focus();
                                            }}
                                            blurOnSubmit={false}
                                        />
                                        <ShareInput
                                            ref={passwordRef}
                                            placeholder="Mật khẩu mới"
                                            secureTextEntry
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                            error={errors.password}
                                            touched={touched.password}
                                            returnKeyType="next"
                                            onSubmitEditing={() => {
                                                confirmPasswordRef.current?.focus();
                                            }}
                                            blurOnSubmit={false}
                                        />
                                        <ShareInput
                                            ref={confirmPasswordRef}
                                            placeholder="Xác nhận mật khẩu mới"
                                            secureTextEntry
                                            onChangeText={handleChange('confirmPassword')}
                                            onBlur={handleBlur('confirmPassword')}
                                            value={values.confirmPassword}
                                            error={errors.confirmPassword}
                                            touched={touched.confirmPassword}
                                            returnKeyType="done"
                                            onSubmitEditing={handleSubmit as any}
                                        />

                                        <ShareButton
                                            tittle="Tiếp tục"
                                            onPress={handleSubmit as any}
                                            loading={loading}
                                            btnStyle={styles.button}
                                            textStyle={styles.buttonText}
                                        />
                                    </>
                                )}
                            </Formik>

                            <Pressable style={styles.resendContainer} onPress={handleResendCode}>
                                <Text style={styles.resendText}>Gửi lại mã</Text>
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.WHITE,
    },
    header: {
        paddingTop: 10,
        paddingHorizontal: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    innerContainer: {
        paddingHorizontal: 24,
        paddingTop: '5%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: APP_COLOR.BLACK,
    },
    subtitle: {
        fontSize: 16,
        color: APP_COLOR.GREY,
        marginBottom: 24,
        lineHeight: 22,
    },
    button: {
        backgroundColor: APP_COLOR.BLUE_LIGHT,
        borderRadius: 25,
        paddingVertical: 14,
        marginTop: 16,
    },
    buttonText: {
        color: APP_COLOR.WHITE,
        fontWeight: 'bold',
        fontSize: 16,
    },
    resendContainer: {
        marginTop: 24,
        alignItems: 'center',
    },
    resendText: {
        color: APP_COLOR.BLUE_LIGHT,
        fontWeight: 'bold',
        fontSize: 15,
    }
});

export default ForgotPasswordModal;