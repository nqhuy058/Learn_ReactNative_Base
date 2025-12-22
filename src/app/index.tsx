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
                // 1. Lấy token từ bộ nhớ
                const token = await AsyncStorage.getItem("access_token");

                if (!token) {
                    console.log("RootPage: Không tìm thấy token -> Login");
                    navigation.replace("login");
                    return;
                }

                // 2. Gọi API kiểm tra
                console.log("RootPage: Có token, đang gọi API /me...");
                const res = await getProfileApi();

                // 3. Kiểm tra kết quả
                // Lưu ý: Axios trả về object response, dữ liệu user nằm trong res.data
                if (res && res.data) {
                    console.log("RootPage: Token hợp lệ -> Vào App");
                    
                    // QUAN TRỌNG: Phải set res.data, không set res nguyên cục
                    setUser(res.data); 
                    
                    navigation.replace('(tabs)');
                } else {
                    console.log("RootPage: API không trả về data -> Login");
                    await AsyncStorage.removeItem("access_token");
                    navigation.replace("login");
                }
            } catch (e) {
                // Nếu lỗi mạng (502, Network Error) cũng sẽ nhảy vào đây
                console.log("RootPage Error:", e);
                
                // Xóa token lỗi để tránh vòng lặp
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