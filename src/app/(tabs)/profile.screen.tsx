import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useAppContext } from '../../context/app.context';
import { useTheme } from '../../components/theme/themeContext';
import AvatarSection from '../../components/profile/avatar.section';
import AvatarPickerModal from '../../components/profile/avatar.picker.modal';
import EditProfileForm from '../../components/profile/profile.edit';
import ProfileMenu from '../../components/profile/profile.menu';

const ProfileScreen = ({ navigation }: any) => {
  const { user, updateUser } = useAppContext();
  const { theme, toggleTheme, colors } = useTheme();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleSaveProfile = (values: any) => {
    updateUser({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      dob: values.dob,
    });
    Toast.show({ type: 'success', text1: 'Cập nhật thành công', text2: 'Thông tin cá nhân đã được cập nhật' });
    setIsEditMode(false);
  };

  const handleUpdateAvatar = (response: any) => {
    if (response.didCancel) return;
    if (response.error) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: response.error });
    } else {
      const base64 = `data:image/jpeg;base64,${response.assets[0].base64}`;
      updateUser({ avatar: base64 });
      setAvatarModalVisible(false);
      Toast.show({ type: 'success', text1: 'Cập nhật ảnh thành công' });
    }
  };

  const handlePickCamera = () => {
    launchCamera({ mediaType: 'photo', includeBase64: true, maxHeight: 500, maxWidth: 500 } as any, handleUpdateAvatar);
  };

  const handlePickGallery = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true, maxHeight: 500, maxWidth: 500 } as any, handleUpdateAvatar);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đồng ý', onPress: () => { navigation.replace('login'); Toast.show({ type: 'success', text1: 'Đã đăng xuất' }); } },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerContainer}>
          <Text style={{ fontSize: 16, color: colors.subText }}>Vui lòng đăng nhập trước</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Hồ sơ cá nhân</Text>
        </View>

        {/* Avatar */}
        <AvatarSection
          avatar={user.avatar}
          isEditMode={isEditMode}
          onPressCamera={() => setAvatarModalVisible(true)}
          colors={colors}
        />

        {/* Thông tin chi tiết */}
        <View style={styles.userInfoSection}>
          {isEditMode ? (
            <EditProfileForm
              user={user}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditMode(false)}
              colors={colors}
            />
          ) : (
            <ProfileMenu
              user={user}
              onEditPress={() => {
                setEditedUser({ firstName: user.firstName, lastName: user.lastName, email: user.email });
                setIsEditMode(true);
              }}
              isDarkTheme={theme === 'dark'}
              toggleTheme={toggleTheme}
              onLogout={handleLogout}
              colors={colors}
            />
          )}
        </View>
      </ScrollView>

      {/* Modal chọn ảnh */}
      <AvatarPickerModal
        visible={isAvatarModalVisible}
        onClose={() => setAvatarModalVisible(false)}
        onCamera={handlePickCamera}
        onGallery={handlePickGallery}
        colors={colors}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1
  },
  userInfoSection: {
    paddingHorizontal: 16,
    flex: 1
  },
});

export default ProfileScreen;