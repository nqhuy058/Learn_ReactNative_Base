import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile Screen</Text>
            {/* Nơi đây sẽ là form chỉnh sửa profile */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default EditScreen;