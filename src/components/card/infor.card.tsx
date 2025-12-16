import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { APP_COLOR } from '../../utils/constant';

interface InforCardProps {
    icon: string;
    label: string;
    status?: string;
    onPress?: () => void;
    showChevron?: boolean;
}

const InforCard = ({
    icon,
    label,
    status,
    onPress,
    showChevron = true,
}: InforCardProps) => {
    return (
        <Pressable style={styles.container} onPress={onPress} disabled={!onPress}>
            <View style={styles.leftContent}>
                <MaterialIcons name={icon} size={24} color={APP_COLOR.BLACK} />
                <Text style={styles.label}>{label}</Text>
            </View>
            <View style={styles.rightContent}>
                {status && <Text style={styles.status}>{status}</Text>}
                {showChevron && (
                    <MaterialIcons name="chevron-right" size={20} color={APP_COLOR.GREY} />
                )}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    label: {
        fontSize: 16,
        color: APP_COLOR.BLACK,
        fontWeight: '500',
        marginLeft: 12,
    },
    rightContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    status: {
        fontSize: 12,
        color: APP_COLOR.GREY,
    },
});

export default InforCard;