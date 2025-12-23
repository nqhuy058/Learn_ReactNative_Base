import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import InforCard from '../card/infor.card';
import ShareButton from '../button/share.button';
import { APP_COLOR } from '../../utils/constants/constant';
import { ThemeColors } from '../theme/themeContext';

interface ProfileMenuProps {
    user: any;
    onEditPress: () => void;
    isDarkTheme: boolean;
    toggleTheme: () => void;
    onLogout: () => void;
    colors: ThemeColors;
}

const ProfileMenu = ({ user, onEditPress, isDarkTheme, toggleTheme, onLogout, colors }: ProfileMenuProps) => {
    const styles = createStyles(colors);

    return (
        <View>
            <View style={styles.userNameSection}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>
            </View>

            <View style={styles.menuSection}>
                <InforCard
                    icon="pencil"
                    label="Chỉnh sửa thông tin"
                    onPress={onEditPress}
                    textColor={colors.text}
                />
                <View style={styles.themeRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="theme-light-dark" size={24} color={colors.text} style={{ marginRight: 15 }} />
                        <Text style={{ fontSize: 16, color: colors.text }}>Giao diện tối</Text>
                    </View>
                    <Switch
                        value={isDarkTheme}
                        onValueChange={toggleTheme}
                        trackColor={{ false: '#767577', true: APP_COLOR.BLUE_LIGHT }}
                        thumbColor={'#f4f3f4'}
                    />
                </View>
            </View>

            <ShareButton tittle="Đăng xuất" onPress={onLogout} btnStyle={styles.logoutButton} textStyle={styles.logoutButtonText} />
        </View>
    );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    userNameSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4
    },
    userEmail: {
        fontSize: 14,
        color: colors.subText
    },
    menuSection: {
        marginBottom: 24,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card
    },
    themeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.card
    },
    logoutButton: {
        backgroundColor: 'transparent',
        borderRadius: 15,
        paddingVertical: 12,
        marginBottom: 24,
        width: '70%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: APP_COLOR.BLUE_LIGHT
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: APP_COLOR.BLUE_LIGHT,
        textAlign: 'center'
    },
});

export default ProfileMenu;