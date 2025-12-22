import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import { useAppContext } from '../../context/app.context';
import { useTheme } from '../../components/theme/themeContext';
import AvatarSection from '../../components/profile/avatar.section';
import AvatarPickerModal from '../../components/profile/avatar.picker.modal';
import EditProfileForm from '../../components/profile/profile.edit';
import ProfileMenu from '../../components/profile/profile.menu';
import { updateProfileApi } from '../../utils/api/api'; // <--- Import API

const ProfileScreen = ({ navigation }: any) => {
  const { user, setUser, logout } = useAppContext(); 
  const { theme, toggleTheme, colors } = useTheme();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // <--- Thêm state loading

  // State lưu tạm thông tin khi user ấn Sửa
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    dob: user?.dob || '',
  });

  // --- XỬ LÝ CẬP NHẬT THÔNG TIN ---
  const handleSaveProfile = async (values: any) => {
    setIsLoading(true);
    try {
      // 1. Gọi API cập nhật
      const res = await updateProfileApi({
        firstName: values.firstName,
        lastName: values.lastName,
        dob: values.dob,
        // email thường không cho phép sửa trực tiếp ở đây
      });

      if (res.data) {
        // 2. Cập nhật thành công -> Lưu dữ liệu mới vào Context
        // Backend trả về: { message: "...", user: { ... } }
        setUser(res.data.user);

        Toast.show({ type: 'success', text1: 'Cập nhật thành công' });
        setIsEditMode(false);
      }
    } catch (error: any) {
      console.log("Update Error:", error);
      Toast.show({
        type: 'error',
        text1: 'Cập nhật thất bại',
        text2: error.response?.data?.message || 'Lỗi kết nối'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- XỬ LÝ CẬP NHẬT AVATAR ---
  const handleUpdateAvatar = async (response: any) => {
    if (response.didCancel) return;
    if (response.error) {
      Toast.show({ type: 'error', text1: 'Lỗi chọn ảnh', text2: response.error });
      return;
    }

    // Lấy chuỗi base64
    const base64 = `data:image/jpeg;base64,${response.assets[0].base64}`;

    // Đóng modal chọn ảnh
    setAvatarModalVisible(false);
    setIsLoading(true); // Hiện loading

    try {
      // 1. Gọi API cập nhật avatar
      const res = await updateProfileApi({ avatar: base64 });

      if (res.data) {
        // 2. Cập nhật context để UI tự đổi ảnh mới
        setUser(res.data.user);
        Toast.show({ type: 'success', text1: 'Cập nhật ảnh thành công' });
      }
    } catch (error: any) {
      console.log("Avatar Error:", error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi cập nhật ảnh',
        text2: error.response?.data?.message || 'Vui lòng thử lại'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickCamera = () => {
    launchCamera({ mediaType: 'photo', includeBase64: true, maxWidth: 500, maxHeight: 500, quality: 0.7 } as any, handleUpdateAvatar);
  };

  const handlePickGallery = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true, maxWidth: 500, maxHeight: 500, quality: 0.7 } as any, handleUpdateAvatar);
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đồng ý',
        onPress: () => {
          logout(); 
          navigation.replace('login');
          Toast.show({ type: 'success', text1: 'Đã đăng xuất' });
        }
      },
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

      {/* Hiển thị Loading Overlay khi đang gọi API */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary || '#0084FF'} />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} pointerEvents={isLoading ? 'none' : 'auto'}>
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
                // Reset form data về giá trị hiện tại của user trước khi sửa
                setEditedUser({ firstName: user.firstName, lastName: user.lastName, email: user.email, dob: user.dob || '' });
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
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  }
});

export default ProfileScreen;