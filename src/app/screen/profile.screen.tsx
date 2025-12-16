import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ScrollView,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { APP_COLOR } from '../../utils/constant';
import { useAppContext } from '../../context/app.context';
import ShareButton from '../../components/button/share.button';
import ShareInput from '../../components/input/share.input';
import UserAvatar from '../../components/avatar/user.avatar';
import InforCard from '../../components/card/infor.card';
import Toast from 'react-native-toast-message';
import { useTheme } from '../../theme/themeContext';

const ProfileScreen = ({ navigation }: any) => {
  const { user, updateUser, clearUser } = useAppContext();
  const { theme, toggleTheme, colors } = useTheme();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAvatarModalVisible, setAvatarModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });

  const handleSaveProfile = () => {
    if (!editedUser.firstName.trim() || !editedUser.lastName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    updateUser({
      firstName: editedUser.firstName,
      lastName: editedUser.lastName,
      email: editedUser.email,
    });

    Toast.show({
      type: 'success',
      text1: 'Cập nhật thành công',
      text2: 'Thông tin cá nhân đã được cập nhật',
    });

    setIsEditMode(false);
  };

  const handlePickCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchCamera(options as any, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: response.error,
        });
      } else {
        const base64 = `data:image/jpeg;base64,${response.assets[0].base64}`;
        updateUser({ avatar: base64 });
        setAvatarModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Cập nhật ảnh đại diện thành công',
        });
      }
    });
  };

  const handlePickGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      maxHeight: 200,
      maxWidth: 200,
    };

    launchImageLibrary(options as any, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: response.error,
        });
      } else {
        const base64 = `data:image/jpeg;base64,${response.assets[0].base64}`;
        updateUser({ avatar: base64 });
        setAvatarModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Cập nhật ảnh đại diện thành công',
        });
      }
    });
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', onPress: () => { } },
      {
        text: 'Đồng ý',
        onPress: () => {
          clearUser();
          navigation.replace('login');
          Toast.show({
            type: 'success',
            text1: 'Đã đăng xuất',
          });
        },
      },
    ]);
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Vui lòng đăng nhập trước</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Kiểm tra nếu avatar là base64 thì dùng Image, nếu không thì dùng text
  const isBase64Avatar = user.avatar?.startsWith('data:image');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          {isBase64Avatar ? (
            <Pressable
              style={styles.imageAvatarContainer}
              onPress={() => setAvatarModalVisible(false)}
            >
              <Image
                source={{ uri: user.avatar }}
                style={styles.imageAvatar}
              />
              {isEditMode && (
                <Pressable
                  style={styles.cameraButton}
                  onPress={() => setAvatarModalVisible(true)}
                >
                  <MaterialIcons name="camera" size={16} color={APP_COLOR.WHITE} />
                </Pressable>
              )}
            </Pressable>
          ) : (
            <UserAvatar
              avatar={user.avatar || '👨'}
              size="large"
              showCamera={isEditMode}
              onCameraPress={() => setAvatarModalVisible(true)}
            />
          )}
        </View>

        {/* User Info */}
        <View style={styles.userInfoSection}>
          {isEditMode ? (
            <>
              <Text style={styles.sectionTitle}>Chỉnh sửa thông tin</Text>
              <ShareInput
                title='Họ'
                value={editedUser.firstName}
                onChangeText={(text: string) =>
                  setEditedUser({ ...editedUser, firstName: text })
                }
              />
              <ShareInput
                title="Tên"
                value={editedUser.lastName}
                onChangeText={(text: string) =>
                  setEditedUser({ ...editedUser, lastName: text })
                }
              />
              <ShareInput
                title="Ngày sinh"
                value={user.dob}
                editable={false}
              />
              <ShareInput
                title="Email"
                value={editedUser.email}
                editable={false}
              />
              <View style={styles.buttonGroup}>
                <ShareButton
                  tittle="Lưu"
                  onPress={handleSaveProfile}
                  btnStyle={[styles.button, styles.saveButton]}
                  textStyle={styles.buttonText}
                />
                <ShareButton
                  tittle="Hủy"
                  onPress={() => setIsEditMode(false)}
                  btnStyle={[styles.button, styles.cancelButton]}
                  textStyle={[styles.buttonText, styles.cancelButtonText]}
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.userNameSection}>
                <View>
                  <Text style={styles.userName}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text style={styles.userEmail}>
                    {user.email}
                  </Text>
                </View>
              </View>

              {/* Menu Items */}
              <View style={styles.menuSection}>
                <InforCard
                  icon="pencil"
                  label="Chỉnh sửa thông tin"
                  onPress={() => {
                    setEditedUser({
                      firstName: user.firstName,
                      lastName: user.lastName,
                      email: user.email,
                    });
                    setIsEditMode(true);
                  }}
                />

                <InforCard
                  icon="moon-waning-crescent"
                  label="Chế độ tối"
                  status={theme === 'light' ? 'Tắt' : 'Bật'}
                  onPress={toggleTheme}
                />
              </View>

              {/* Logout Button */}
              <ShareButton
                tittle="Đăng xuất"
                onPress={handleLogout}
                btnStyle={styles.logoutButton}
                textStyle={styles.logoutButtonText}
              />
            </>
          )}
        </View>
      </ScrollView>

      {/* Avatar Modal */}
      <Modal
        visible={isAvatarModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setAvatarModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn ảnh đại diện</Text>
            <View style={styles.modalButtonGroup}>
              <ShareButton
                tittle="Chụp ảnh"
                onPress={handlePickCamera}
                btnStyle={styles.modalBtn}
                textStyle={styles.modalBtnText}
              />
              <ShareButton
                tittle="Chọn từ thư viện"
                onPress={handlePickGallery}
                btnStyle={styles.modalBtn}
                textStyle={styles.modalBtnText}
              />
            </View>
            <ShareButton
              tittle="Đóng"
              onPress={() => setAvatarModalVisible(false)}
              btnStyle={[styles.modalBtn, styles.closeBtn]}
              textStyle={styles.modalBtnTextClose}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR.WHITE,
  },
  scrollContent: {
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: APP_COLOR.GREY,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: APP_COLOR.BLACK,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  imageAvatarContainer: {
    position: 'relative',
  },
  imageAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: APP_COLOR.BLUE_LIGHT,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: APP_COLOR.WHITE,
  },
  userInfoSection: {
    paddingHorizontal: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: APP_COLOR.BLACK,
    alignSelf: 'center',
  },
  userNameSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: APP_COLOR.BLACK,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: APP_COLOR.GREY,
  },
  menuSection: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    alignSelf: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: APP_COLOR.BLUE_LIGHT,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: APP_COLOR.WHITE,
  },
  cancelButtonText: {
    color: APP_COLOR.BLACK,
  },
  logoutButton: {
    backgroundColor: APP_COLOR.BLUE_LIGHT,
    borderRadius: 15,
    paddingVertical: 12,
    marginBottom: 24,
    width: '70%',
    alignSelf: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: APP_COLOR.WHITE,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: APP_COLOR.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: APP_COLOR.BLACK,
  },
  modalButtonGroup: {
    gap: 12,
    marginBottom: 12,
  },
  modalBtn: {
    backgroundColor: APP_COLOR.BLUE_LIGHT,
    borderRadius: 12,
    paddingVertical: 12,
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: APP_COLOR.WHITE,
  },

  modalBtnTextClose: {
    fontSize: 14,
    fontWeight: 'bold',
    color: APP_COLOR.BLACK,
  },
  closeBtn: {
    backgroundColor: '#f0f0f0',
  },
});

export default ProfileScreen;