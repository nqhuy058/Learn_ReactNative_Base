import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomePage from '.';
import ProfileScreen from './profile.screen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { height: 60, paddingBottom: 5, paddingTop: 5 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = '';

                    if (route.name === 'Home') {
                        iconName = 'home';
                        return (
                            <MaterialCommunityIcons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'account' : 'account-outline';
                        return (
                            <MaterialCommunityIcons
                                name={iconName}
                                size={size}
                                color={color}
                            />
                        );
                    }
                },
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={HomePage} 
                options={{
                    title: "Trang chủ"
                }}
            />

            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{
                    title: "Tôi"
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;