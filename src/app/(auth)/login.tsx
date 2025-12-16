import ShareButton from "../../components/button/share.button";
import ShareInput from "../../components/input/share.input";
import { APP_COLOR } from "../../utils/constant";
import { LoginSchema } from "../../utils/validate.chema";
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Formik } from "formik";
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAppContext } from "../../context/app.context";

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const { user } = useAppContext();

    const handleLogin = async (values: { email: string, password: string }) => {
        setLoading(true);
        const { email, password } = values;

        await new Promise(resolve => setTimeout(() => resolve(true), 1000));

        try {
            // Kiểm tra thông tin đăng nhập
            if (email === 'huy@gmail.com' && password === '123456') {
                Toast.show({ type: 'success', text1: 'Đăng nhập thành công!' });
                navigation.replace('profile');
            }
            else if (user && user.email === email && user.password === password) {
                Toast.show({ type: 'success', text1: 'Đăng nhập thành công!' });
                navigation.replace('profile');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Đăng nhập thất bại',
                    text2: 'Email hoặc mật khẩu không đúng.'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Lỗi',
                text2: 'Vui lòng thử lại.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoiding}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        <View style={styles.container}>
                            <View style={styles.logoContainer}>
                                <MaterialIcons name="message" size={100} color="white" />
                            </View>

                            <Formik
                                validationSchema={LoginSchema}
                                initialValues={{ email: '', password: '' }}
                                onSubmit={handleLogin}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                    <View style={styles.contentContainer}>
                                        <View style={styles.form}>
                                            <ShareInput
                                                placeholder="email"
                                                keyboardType="email-address"
                                                onChangeText={handleChange('email')}
                                                onBlur={handleBlur('email')}
                                                value={values.email}
                                                error={errors.email}
                                                touched={touched.email}
                                            />

                                            <ShareInput
                                                placeholder="Mật khẩu"
                                                secureTextEntry={true}
                                                onChangeText={handleChange('password')}
                                                onBlur={handleBlur('password')}
                                                value={values.password}
                                                error={errors.password}
                                                touched={touched.password}
                                            />

                                            <ShareButton
                                                loading={loading}
                                                tittle="Đăng nhập"
                                                onPress={handleSubmit as any}
                                                textStyle={{
                                                    color: APP_COLOR.WHITE,
                                                    fontSize: 16,
                                                    fontWeight: 'bold',
                                                }}
                                                btnStyle={{
                                                    backgroundColor: APP_COLOR.BLUE_LIGHT,
                                                    borderRadius: 25,
                                                    paddingVertical: 12,
                                                    marginTop: 8
                                                }}
                                            />
                                            <Text style={styles.forgotPassword} onPress={() => Alert.alert("Thông báo", "Chức năng quên mật khẩu chưa được hỗ trợ.")}>
                                                Quên mật khẩu?
                                            </Text>
                                        </View>

                                        <View style={styles.bottomSection}>
                                            <Pressable style={styles.createAccountButton} onPress={() => navigation.navigate('signup' as never)}>
                                                <Text style={styles.createAccountText}>Create new account</Text>
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
    keyboardAvoiding: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: APP_COLOR.BLUE,
    },
    logoContainer: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 150,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 32,
        justifyContent: 'space-between',
    },
    form: {
        width: '100%',
        marginTop: 10,
    },
    forgotPassword: {
        textAlign: 'center',
        color: APP_COLOR.BLACK,
        fontWeight: 'bold',
        marginTop: 24,
        fontSize: 15,
    },
    bottomSection: {
        width: '100%',
        paddingTop: 20,
    },
    createAccountButton: {
        borderWidth: 1.5,
        borderColor: APP_COLOR.BLUE_LIGHT,
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
    },
    createAccountText: {
        color: APP_COLOR.BLUE_LIGHT,
        fontWeight: 'bold',
        fontSize: 16,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32,
    },
});

export default LoginPage;