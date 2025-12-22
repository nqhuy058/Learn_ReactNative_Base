import ShareButton from "../../components/button/share.button";
import ShareInput from "../../components/input/share.input";
import { APP_COLOR } from "../../utils/constant";
import { ForgotPasswordSchema } from "../../utils/validate.chema";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { forgotPasswordApi, resetPasswordApi } from "../../utils/api/api";

const ForgotPasswordModal = () => {
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<any>();

    const email = route.params?.email;

    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    useEffect(() => {
        if (!email) {
            Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không tìm thấy email yêu cầu.' });
            navigation.goBack();
        }
    }, [email]);

    useEffect(() => {
        let timer: any;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleConfirmCode = async (values: any) => {
        setLoading(true);
        try {
            await resetPasswordApi({
                email: email,
                code: values.code,
                newPassword: values.password
            });

            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: 'Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.'
            });

            navigation.popToTop();
            navigation.replace('login');

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Thất bại',
                text2: error.response?.data?.message || 'Mã OTP không đúng hoặc đã hết hạn.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        // Nếu đang đếm ngược thì chặn không cho bấm
        if (countdown > 0) return;

        try {
            // Gọi API gửi lại mã
            await forgotPasswordApi(email);

            // Set đếm ngược 30s
            setCountdown(30);

            Toast.show({
                type: 'success',
                text1: 'Thành công',
                text2: `Đã gửi lại mã tới ${email}`
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Thất bại',
                text2: error.response?.data?.message || 'Không thể gửi lại mã.'
            });
        }
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
                            <Pressable
                                style={({ pressed }) => ([
                                    styles.resendContainer,
                                    { opacity: pressed || countdown > 0 ? 0.5 : 1 }
                                ])}
                                onPress={handleResendCode}
                                disabled={countdown > 0}
                            >
                                <Text style={[
                                    styles.resendText,
                                    countdown > 0 && { color: APP_COLOR.GREY }
                                ]}>
                                    {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
                                </Text>
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