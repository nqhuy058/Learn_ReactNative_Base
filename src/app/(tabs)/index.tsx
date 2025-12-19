import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { CalendarDaysIcon } from 'react-native-heroicons/outline';

const HomePage = () => {
    const [showSearch, toggleSearch] = useState(false);
    const [location, setLocation] = useState([1, 2, 3]);

    const handleLocation = (loc: any) => {
        console.log("Location: ", loc);
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"light-content"} />
            <Image
                blurRadius={70}
                source={require('../../assets/images/bg.png')}
                style={styles.backgroundImage}
            />
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.searchSectionWrapper, { height: '7%' }]}>
                    <View
                        style={[
                            styles.searchBar,
                            { backgroundColor: showSearch ? 'rgba(255, 255, 255, 0.3)' : 'transparent' }
                        ]}
                    >
                        {
                            showSearch ? (
                                <TextInput
                                    placeholder="Search city"
                                    placeholderTextColor={'lightgray'}
                                    style={styles.searchInput}
                                />
                            ) : null
                        }
                        <TouchableOpacity
                            onPress={() => toggleSearch(!showSearch)}
                            style={[
                                styles.searchButton,
                                { backgroundColor: showSearch ? 'transparent' : 'rgba(255, 255, 255, 0.3)' }
                            ]}
                        >
                            <MagnifyingGlassIcon size={25} color="white" />
                        </TouchableOpacity>
                    </View>
                    {
                        location.length > 0 && showSearch ? (
                            <View style={styles.locationList}>
                                {
                                    location.map((loc, index) => {
                                        let showBorder = index + 1 !== location.length;
                                        return (
                                            <TouchableOpacity
                                                onPress={() => handleLocation(loc)}
                                                key={index}
                                                style={[
                                                    styles.locationItem,
                                                    showBorder ? styles.locationItemBorder : null
                                                ]}
                                            >
                                                <MapPinIcon size={20} color="gray" />
                                                <Text style={styles.locationText}>Ha Noi, Viet Nam</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        ) : null
                    }
                </View>

                <View style={styles.infoSection}>
                    {/* Location*/}
                    <Text style={styles.cityName}>
                        Ha noi,
                        <Text style={styles.countryName}>
                            {" " + "Viet Nam"}
                        </Text>
                    </Text>
                    {/* Weather image */}
                    <View style={styles.weatherImageContainer}>
                        <Image
                            source={require('../../assets/images/partlycloudy.png')}
                            style={styles.weatherImage}
                        />
                    </View>

                    <View style={styles.temperatureContainer}>
                        <Text style={styles.temperatureText}>
                            23&#176;C
                        </Text>
                        <Text style={styles.weatherStatusText}>
                            Partly cloudy
                        </Text>
                    </View>

                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Image
                                source={require('../../assets/icons/wind.png')}
                                style={styles.statIcon}
                            />
                            <Text style={styles.statText}>
                                22km
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Image
                                source={require('../../assets/icons/drop.png')}
                                style={styles.statIcon}
                            />
                            <Text style={styles.statText}>
                                23%
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Image
                                source={require('../../assets/icons/sun.png')}
                                style={styles.statIcon}
                            />
                            <Text style={styles.statText}>
                                6:05 AM
                            </Text>
                        </View>
                    </View>
                </View>

                {/* for next day */}
                <View style={styles.forecastSection}>
                    <View style={styles.forecastHeader}>
                        <CalendarDaysIcon size={22} color="white" />
                        <Text style={styles.forecastHeaderText}>
                            Daily forecast
                        </Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                    >
                        {/* Duplicate Items mapping simulated for brevity, applied style to all */}
                        {[1, 2, 3, 4, 5].map((item, index) => (
                            <View
                                key={index}
                                style={[styles.forecastCard, { backgroundColor: 'rgba(255, 255, 255, 0.3)' }]}
                            >
                                <Image
                                    source={require('../../assets/images/heavyrain.png')}
                                    style={styles.forecastIcon}
                                />
                                <Text style={styles.forecastDay}>
                                    Monday
                                </Text>
                                <Text style={styles.forecastTemp}>
                                    26&#176;C
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </SafeAreaView>
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
    safeArea: {
        flex: 1,
        display: 'flex',
    },
    searchSectionWrapper: {
        marginHorizontal: 16,
        position: 'relative',
        zIndex: 50,
    },
    searchBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 30,
        overflow: 'hidden',
    },
    searchInput: {
        paddingLeft: 24,
        paddingBottom: 4,
        flex: 1,
        fontSize: 16,
        color: 'white',
        backgroundColor: 'transparent',
    },
    searchButton: {
        padding: 12,
        borderRadius: 9999,
        margin: 4,
    },
    locationList: {
        position: 'absolute',
        width: '100%',
        backgroundColor: 'rgb(209 213 219)',
        top: 64,
        borderRadius: 24,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        paddingHorizontal: 16,
        marginBottom: 4,
    },
    locationItemBorder: {
        borderBottomWidth: 2,
        borderBottomColor: 'rgb(156 163 175)',
    },
    locationText: {
        color: 'black',
        fontSize: 18,
        marginLeft: 8,
    },
    infoSection: {
        marginHorizontal: 16,
        flex: 1,
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    cityName: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
    },
    countryName: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgb(209 213 219)',
    },
    weatherImageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    weatherImage: {
        width: 208,
        height: 208,
    },
    temperatureContainer: {
        alignItems: 'center',
        gap: 8,
    },
    temperatureText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: 60,
        marginLeft: 20,
    },
    weatherStatusText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        letterSpacing: 1,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statIcon: {
        width: 24,
        height: 24,
    },
    statText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    forecastSection: {
        marginBottom: 8,
        gap: 12,
    },
    forecastHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        gap: 8,
    },
    forecastHeaderText: {
        color: 'white',
        fontSize: 16,
    },
    forecastCard: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 96,
        borderRadius: 24,
        paddingVertical: 12,
        marginRight: 16,
        gap: 4,
    },
    forecastIcon: {
        width: 44,
        height: 44,
    },
    forecastDay: {
        color: 'white',
    },
    forecastTemp: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
    }
});

export default HomePage;