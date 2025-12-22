import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProfileApi } from "../utils/api/api"; 
import { useAppContext } from "../context/app.context";
import { useEffect, useState } from "react";

const RootPage = () => {
    const { setUser } = useAppContext();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    useEffect(() => {
        async function prepare() {
            try {
                // Lấy token từ bộ nhớ
                const token = await AsyncStorage.getItem("access_token");

                if (!token) {
                    navigation.replace("login");
                    return;
                }

                // Gọi API kiểm tra
                const res = await getProfileApi();

                // Kiểm tra kết quả
                if (res && res.data) {
                    setUser(res.data); 
                    navigation.replace('(tabs)');
                } else {
                    await AsyncStorage.removeItem("access_token");
                    navigation.replace("login");
                }
            } catch (e) {
                await AsyncStorage.removeItem("access_token");
                navigation.replace("login");
            }
        }

        prepare();
    }, []);

    return (
        <>
           
        </>
    );
};

export default RootPage;