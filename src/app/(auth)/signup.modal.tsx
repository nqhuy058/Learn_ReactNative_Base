import ShareButton from "../../components/button/share.button";
import ShareInput from "../../components/input/share.input";
import { APP_COLOR } from "../../utils/constant";
import { SignUpSchema } from "../../utils/validate.chema";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppContext } from "../../context/app.context";

const SignUpModal = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const { setUser } = useAppContext();

    const handleSignUp = async (values: any) => {
        setLoading(true);
        const { firstName, lastName, email, password, dob } = values;

        try {
            // Lưu dữ liệu vào Context
            const userData = {
                firstName,
                lastName,
                email,
                password,
                dob: dob.toLocaleDateString('vi-VN'),
                createdAt: new Date().toISOString()
            };

            setUser(userData);

            Toast.show({
                type: 'success',
                text1: 'Đăng ký thành công!',
                text2: 'Bây giờ bạn có thể đăng nhập.'
            });

            setTimeout(() => {
                setLoading(false);
                navigation.goBack();
            }, 1000);

        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Đã có lỗi xảy ra',
                text2: error?.message ?? 'Vui lòng thử lại.'
            });
        } 
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <Pressable onPress={() => navigation?.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-left" size={24} color={APP_COLOR.BLACK} />
                    </Pressable>
                </View>

                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                        dob: new Date(),
                    }}
                    validationSchema={SignUpSchema}
                    onSubmit={handleSignUp}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={styles.innerContainer}>
                                    <Text style={styles.title}>Tạo tài khoản</Text>
                                    <Text style={styles.subtitle}>Điền các thông tin cá nhân của bạn.</Text>

                                    <View style={styles.nameContainer}>
                                        <View style={{ flex: 1 }}>
                                            <ShareInput
                                                placeholder="Họ"
                                                onChangeText={handleChange('firstName')}
                                                onBlur={handleBlur('firstName')}
                                                value={values.firstName}
                                                error={errors.firstName}
                                                touched={touched.firstName}
                                            />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <ShareInput
                                                placeholder="Tên"
                                                onChangeText={handleChange('lastName')}
                                                onBlur={handleBlur('lastName')}
                                                value={values.lastName}
                                                error={errors.lastName}
                                                touched={touched.lastName}
                                            />
                                        </View>
                                    </View>

                                    <Pressable
                                        onPress={() => setDatePickerVisible(true)}
                                        style={{ marginBottom: 12 }}
                                    >
                                        <View pointerEvents="none">
                                            <ShareInput
                                                placeholder="Ngày sinh"
                                                value={values.dob.toLocaleDateString('vi-VN')}
                                                editable={false}
                                                error={errors.dob}
                                                touched={touched.dob}
                                            />
                                        </View>
                                    </Pressable>

                                    {isDatePickerVisible && (
                                        <DateTimePicker
                                            value={values.dob}
                                            mode="date"
                                            display="default"
                                            onChange={(event, selectedDate) => {
                                                if (selectedDate) {
                                                    setFieldValue('dob', selectedDate);
                                                }
                                                setDatePickerVisible(false);
                                            }}
                                            maximumDate={new Date()}
                                        />
                                    )}

                                    <ShareInput
                                        placeholder="Email"
                                        keyboardType="email-address"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        value={values.email}
                                        error={errors.email}
                                        touched={touched.email}
                                    />

                                    <ShareInput
                                        placeholder="Mật khẩu"
                                        secureTextEntry
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        value={values.password}
                                        error={errors.password}
                                        touched={touched.password}
                                    />

                                    <ShareInput
                                        placeholder="Xác nhận mật khẩu"
                                        secureTextEntry
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        value={values.confirmPassword}
                                        error={errors.confirmPassword}
                                        touched={touched.confirmPassword}
                                    />

                                    <ShareButton
                                        tittle="Tạo tài khoản"
                                        onPress={handleSubmit as any}
                                        loading={loading}
                                        btnStyle={styles.button}
                                        textStyle={styles.buttonText}
                                    />
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.WHITE
    },
    header: {
        paddingTop: 10,
        paddingHorizontal: 16
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center'
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center'
    },
    innerContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
        color: APP_COLOR.BLACK
    },
    subtitle: {
        fontSize: 16,
        color: APP_COLOR.GREY,
        marginBottom: 24
    },
    nameContainer: {
        flexDirection: 'row',
        gap: 16
    },
    button: {
        backgroundColor: APP_COLOR.BLUE_LIGHT,
        borderRadius: 25,
        paddingVertical: 14,
        marginTop: 16
    },
    buttonText: {
        color: APP_COLOR.WHITE,
        fontWeight: 'bold',
        fontSize: 16
    }
});

export default SignUpModal;