import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Image, ActivityIndicator, Keyboard, Platform, PermissionsAndroid, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { debounce } from 'lodash';
import useSWR, { SWRConfig } from 'swr';
import { swrConfig } from '../../utils/swr-config';
import Geolocation from 'react-native-geolocation-service';
// Import API
import { fetchLocations, fetchWeatherForecast } from '../../utils/api/weather.api';
// Import Components
import WeatherHeader from '../../components/home/weather.header';
import WeatherBody from '../../components/home/weather.body';
import WeatherFooter from '../../components/home/weather.footer';

export interface LocationData {
    name: string;
    country: string;
}

export interface WeatherData {
    location?: LocationData;
    current?: any;
    forecast?: any;
}

// Tạo hàm fetcher cho SWR (SWR sẽ dùng hàm này để gọi API)
// key chính là tham số truyền vào (ở đây là cityName)
const weatherFetcher = async (cityName: string) => {
    // Nếu chưa có tên thành phố thì không gọi
    if (!cityName) return null;
    return await fetchWeatherForecast({ cityName, days: '7' });
};

const HomePageContent = () => {
    const [showSearch, toggleSearch] = useState<boolean>(false);
    const [locations, setLocations] = useState<LocationData[]>([]);

    // State lưu từ khóa tìm kiếm hiện tại (mặc định là null)
    const [currentQuery, setCurrentQuery] = useState<string | null>(null);

    // Tham số thứ 1: Key (nếu key null, SWR sẽ tạm dừng). Khi key thay đổi, SWR tự gọi lại.
    // Tham số thứ 2: Hàm fetcher
    const { data: weather, error, isLoading, mutate } = useSWR<WeatherData>(
        currentQuery,
        weatherFetcher
    );

    const handleSearch = (value: string) => {
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then((data) => {
                setLocations(data || []);
            });
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    // Khi chọn địa điểm từ Search -> Cập nhật currentQuery -> SWR tự chạy
    const handleLocation = (loc: LocationData) => {
        setLocations([]);
        toggleSearch(false);
        Keyboard.dismiss();
        setCurrentQuery(loc.name); // Thay đổi cái này 
    }
    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`📍 Đã lấy được tọa độ: ${latitude}, ${longitude}`);
                // Cập nhật query -> SWR sẽ tự động chạy fetcher
                setCurrentQuery(`${latitude},${longitude}`);
            },
            (error) => {
                console.log("❌ Lỗi lấy vị trí:", error.code, error.message);
                setCurrentQuery('Hanoi'); // Fallback
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const auth = await Geolocation.requestAuthorization('whenInUse');
            if (auth === 'granted') getLocation();
            else setCurrentQuery('Hanoi');
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: "Cấp quyền vị trí",
                        message: "App cần biết vị trí để hiển thị thời tiết chính xác.",
                        buttonNeutral: "Hỏi lại sau",
                        buttonNegative: "Hủy",
                        buttonPositive: "Đồng ý"
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) getLocation();
                else setCurrentQuery('Hanoi');
            } catch (err) {
                console.warn(err);
                setCurrentQuery('Hanoi');
            }
        }
    };

    useEffect(() => {
        requestLocationPermission();
    }, []);


    const { current, location, forecast } = weather || {};

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"light-content"} />
            <Image
                blurRadius={70}
                source={require('../../assets/images/bg.png')}
                style={styles.backgroundImage}
            />

            {/* Chỉ hiện loading khi chưa có data lần nào */}
            {isLoading && !weather ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={{ color: 'white', marginTop: 10 }}>Đang định vị...</Text>
                </View>
            ) : (
                <SafeAreaView style={styles.safeArea}>
                    <WeatherHeader
                        showSearch={showSearch}
                        toggleSearch={toggleSearch}
                        locations={locations}
                        handleTextDebounce={handleTextDebounce}
                        handleLocation={handleLocation}
                    />

                    {error && <Text style={{ color: 'white', textAlign: 'center' }}>Lỗi tải dữ liệu</Text>}

                    {current ? (
                        <WeatherBody current={current} location={location} forecast={forecast} />
                    ) : null}

                    {forecast && <WeatherFooter forecast={forecast} />}
                </SafeAreaView>
            )}
        </View>
    );
};

// Bọc SWR Config để kích hoạt tính năng tự refresh khi app active
const HomePage = () => {
    return (
        <SWRConfig value={swrConfig}>
            <HomePageContent />
        </SWRConfig>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        flex: 1,
        display: 'flex',
    }
});

export default HomePage;