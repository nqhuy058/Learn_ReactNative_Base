import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, StatusBar, Image, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { debounce } from 'lodash';

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

const HomePage = () => {
    const [showSearch, toggleSearch] = useState<boolean>(false);
    const [locations, setLocations] = useState<LocationData[]>([]);
    const [weather, setWeather] = useState<WeatherData | null>(null); // Sửa type để chấp nhận null
    const [loading, setLoading] = useState<boolean>(true);

    const handleSearch = (value: string) => {
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then((data: LocationData[]) => {
                // Chỉ cập nhật nếu có dữ liệu, nếu null thì bỏ qua hoặc set rỗng
                if (data) {
                    setLocations(data);
                } else {
                    setLocations([]);
                }
            });
        }
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

    const handleLocation = (loc: LocationData) => {
        setLocations([]);
        toggleSearch(false);
        setLoading(true);
        Keyboard.dismiss();

        fetchWeatherForecast({
            cityName: loc.name,
            days: '7'
        }).then((data: WeatherData) => {
            setWeather(data);
            setLoading(false);
        }).catch(err => {
            console.log("Lỗi gọi API thời tiết:", err);
            setLoading(false);
        });
    }

    useEffect(() => {
        // Gọi mặc định khi vào app
        fetchWeatherForecast({
            cityName: 'Hanoi',
            days: '7'
        }).then((data: WeatherData) => {
            console.log("Dữ liệu thời tiết nhận được:", data); // Log để kiểm tra
            if (data) {
                setWeather(data);
            }
        }).catch(err => {
            console.log("Lỗi khởi tạo API thời tiết:", err);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    // --- SỬA QUAN TRỌNG: Thêm "|| {}" để tránh crash khi weather là null ---
    const { current, location, forecast } = weather || {};

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"light-content"} />
            <Image
                blurRadius={70}
                source={require('../../assets/images/bg.png')}
                style={styles.backgroundImage}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            ) : (
                <SafeAreaView style={styles.safeArea}>

                    {/* Header */}
                    <WeatherHeader
                        showSearch={showSearch}
                        toggleSearch={toggleSearch}
                        locations={locations}
                        handleTextDebounce={handleTextDebounce}
                        handleLocation={handleLocation}
                    />

                    {/* Body - Chỉ hiển thị khi có dữ liệu current */}
                    {current ? (
                        <WeatherBody
                            current={current}
                            location={location}
                            forecast={forecast}
                        />
                    ) : (
                        // Hiển thị view trống nếu không có dữ liệu để tránh undefined
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            {/* Bạn có thể thêm Text báo lỗi ở đây nếu muốn */}
                        </View>
                    )}

                    {/* Footer - Chỉ hiển thị khi có dữ liệu forecast */}
                    {forecast && (
                        <WeatherFooter
                            forecast={forecast}
                        />
                    )}

                </SafeAreaView>
            )}
        </View>
    );
};

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