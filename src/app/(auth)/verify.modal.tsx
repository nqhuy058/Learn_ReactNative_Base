import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ShareInput from '../../components/input/share.input';
import ShareButton from '../../components/button/share.button';
import { APP_COLOR } from '../../utils/constants/constant';
import { verifyCodeApi, resendCodeApi } from '../../utils/api/api';
import { VerifySchema } from '../../utils/validate/validate.chema';

// Validate mã OTP phải đủ 6 số
const VerifyModal = () => {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const route = useRoute<any>();
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Lấy email được truyền từ màn hình Đăng ký
    const email = route.params?.email;

    // Nếu không có email (truy cập trực tiếp), quay về login
    useEffect(() => {
        if (!email) {
            navigation.replace('login');
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

    const handleVerify = async (values: { code: string }) => {
        setLoading(true);
        try {
            const cleanCode = values.code.trim();

            const res = await verifyCodeApi({
                email: email,
                code: cleanCode
            });

            if (res) {
                Toast.show({
                    type: 'success',
                    text1: 'Xác thực thành công!',
                    text2: 'Vui lòng đăng nhập để tiếp tục.'
                });
                // Chuyển về trang đăng nhập
                navigation.replace('login');
            }
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Xác thực thất bại',
                text2: error.response?.data?.message || 'Mã OTP không chính xác.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        // Nếu đang đếm ngược thì không cho bấm
        if (countdown > 0) return;

        try {
            await resendCodeApi({ email });
            setCountdown(30);

            Toast.show({
                type: 'success',
                text1: 'Đã gửi lại mã',
                text2: 'Vui lòng kiểm tra email của bạn.'
            });
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Gửi mã thất bại',
                text2: error.response?.data?.message || 'Vui lòng thử lại sau.'
            });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.container}>
                            {/* Nút Back */}
                            <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
                                <MaterialIcons name="arrow-left" size={30} color={APP_COLOR.GREY} />
                            </Pressable>

                            <View style={styles.headerContainer}>
                                <Text style={styles.title}>Xác thực tài khoản</Text>
                                <Text style={styles.subtitle}>
                                    Vui lòng nhập mã OTP 6 số đã được gửi đến email:
                                    <Text style={{ fontWeight: 'bold', color: APP_COLOR.BLACK }}> {email}</Text>
                                </Text>
                            </View>

                            <Formik
                                initialValues={{ code: '' }}
                                validationSchema={VerifySchema}
                                onSubmit={handleVerify}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                    <View style={styles.formContainer}>
                                        <ShareInput
                                            title="Mã OTP"
                                            placeholder="Nhập 6 chữ số"
                                            keyboardType="number-pad"
                                            value={values.code}
                                            onChangeText={handleChange('code')}
                                            onBlur={handleBlur('code')}
                                            error={errors.code}
                                            touched={touched.code}
                                            editable={!loading}
                                            onSubmitEditing={() => handleSubmit()}
                                        />

                                        <ShareButton
                                            tittle="Xác nhận"
                                            onPress={handleSubmit as any}
                                            loading={loading}
                                            btnStyle={styles.verifyButton}
                                            textStyle={styles.verifyButtonText}
                                        />

                                        <View style={styles.resendContainer}>
                                            <Text style={styles.resendLabel}>Chưa nhận được mã? </Text>
                                            <Pressable
                                                onPress={handleResendCode}
                                                disabled={countdown > 0} // Vô hiệu hóa nút bấm
                                                style={({ pressed }) => ({
                                                    opacity: pressed ? 0.5 : 1
                                                })}
                                            >
                                                <Text style={[
                                                    styles.resendLink,
                                                    countdown > 0 && { color: APP_COLOR.GREY } // Đổi màu khi disabled
                                                ]}>
                                                    {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại'}
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: APP_COLOR.WHITE,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        marginBottom: 20,
    },
    headerContainer: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: APP_COLOR.BLACK,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: APP_COLOR.GREY,
        lineHeight: 22,
    },
    formContainer: {
        flex: 1,
    },
    verifyButton: {
        marginTop: 30,
        backgroundColor: APP_COLOR.BLUE_LIGHT,
        borderRadius: 25,
        paddingVertical: 12,
    },
    verifyButtonText: {
        color: APP_COLOR.WHITE,
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    resendLabel: {
        color: APP_COLOR.GREY,
        fontSize: 15,
    },
    resendLink: {
        color: APP_COLOR.BLUE_LIGHT,
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default VerifyModal;