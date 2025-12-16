import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppProvider } from '../context/app.context';
import { ThemeProvider } from '../theme/themeContext';
import LoginPage from './\(auth\)/login';
import SignUpModal from './\(auth\)/signup.modal';
import ProfileScreen from './screen/profile.screen';

const Stack = createNativeStackNavigator();

const RootLayout = () => {
    return (
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
                                name="profile"
                                component={ProfileScreen}
                                options={{
                                    headerShown: false,
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                    <Toast />
                </SafeAreaProvider>
            </AppProvider>
        </ThemeProvider>
    );
};

export default RootLayout;