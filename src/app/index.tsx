import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import StorageService, { StorageKeys } from "../utils/storage/storage";
import { getProfileApi } from "../utils/api/api";
import { useAppContext } from "../context/app.context";
import { useEffect, useState } from "react";

const RootPage = () => {
    const { setUser } = useAppContext();
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const checkAuth = async () => {
        try {

            const token = await StorageService.getItem(StorageKeys.ACCESS_TOKEN);

            if (!token) {
                navigation.replace("login");
                return;
            }

            // Có token -> Gọi API check profile
            const res = await getProfileApi();

            if (res && res.data) {
                setUser(res.data);
                navigation.replace('(tabs)');
            } else {
                // Token hết hạn hoặc không hợp lệ -> Xóa và về Login
                await StorageService.removeItem(StorageKeys.ACCESS_TOKEN);
                navigation.replace("login");
            }
        } catch (e) {
            await StorageService.removeItem(StorageKeys.ACCESS_TOKEN);
            navigation.replace("login");
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <>

        </>
    );
};

export default RootPage;