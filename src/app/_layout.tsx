import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppProvider } from '../context/app.context';
import { ThemeProvider } from '../components/theme/themeContext';
import LoginPage from './\(auth\)/login';
import SignUpModal from './\(auth\)/signup.modal';
import RequestPasswordModal from './(auth)/request.password.modal';
import TabNavigator from './(tabs)/_layout';
import ForgotPasswordModal from './(auth)/forgot.password.modal';
import RootPage from '.';
import VerifyPage from './(auth)/verify.modal';
import { TamaguiProvider } from 'tamagui';
import config from '../../tamagui.config';
const Stack = createNativeStackNavigator();

const RootLayout = () => {
    return (
        <TamaguiProvider config={config}>
            <ThemeProvider>
                <AppProvider>
                    <SafeAreaProvider>
                        <NavigationContainer>
                            <Stack.Navigator
                                screenOptions={{
                                    headerShown: false,
                                }}
                            >
                                <Stack.Screen
                                    name="root"
                                    component={RootPage}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="login"
                                    component={LoginPage}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="signup"
                                    component={SignUpModal}
                                    options={{
                                        headerShown: false,
                                        presentation: "transparentModal",
                                    }}
                                />
                                <Stack.Screen
                                    name="(tabs)"
                                    component={TabNavigator}
                                    options={{
                                        headerShown: false,
                                    }}
                                />
                                <Stack.Screen
                                    name="requestPassword"
                                    component={RequestPasswordModal}
                                    options={{
                                        headerShown: false,
                                        presentation: "transparentModal",
                                    }}
                                />
                                <Stack.Screen
                                    name="forgotPassword"
                                    component={ForgotPasswordModal}
                                    options={{
                                        headerShown: false,
                                        presentation: "transparentModal",
                                    }}
                                />
                                <Stack.Screen
                                    name="verify"
                                    component={VerifyPage}
                                    options={{
                                        headerShown: false,
                                        presentation: "transparentModal",
                                    }}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                        <Toast />
                    </SafeAreaProvider>
                </AppProvider>
            </ThemeProvider>
        </TamaguiProvider>
    );
};

export default RootLayout;