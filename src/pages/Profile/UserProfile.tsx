import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import Profile from '../../../assets/images/userprofile.svg';
import LoudSpeacker from '../../../assets/images/loudspeaker.svg';
import Images from '../../constants/images';
import Fonts from '../../constants/fonts';
import colors from '../../constants/colors';
import Setting from '../../..//assets/images/setting.svg';
import ReportManage from './Report/ReportManage/ReportManage';
import {profileProps, profileEditProps} from '../../types/profile.type';
import EditProfile from './EditProfile';
import AddProfile from '../../components/AddProfile';
import {useNavigation} from '@react-navigation/native';

function UserProfile({navigation}: profileProps) {
  // const navigateToSetting = () => {
  //   navigation.navigate('EditProfile');
  // };
  const navigateToNotice = () => {
    console.warn('공지사항');
  };
  const navigateToEditProfie = () => {
    navigation.navigate('AddProfile');
  };

  const navigateToAlarm = () => {
    console.warn('알람');
  };
  const navigateToLock = () => {
    console.warn('잠금');
  };

  const navigateToMail = () => {
    console.warn('메일보내기');
  };

  const userLogout = () => {
    console.warn('로그아웃');
  };

  const userWithdraw = () => {
    console.warn('유저탈퇴');
  };

  const userSection = [
    {
      text: '내 정보 수정',
      type: 'label',
      action: navigateToEditProfie,
    },
    {text: '알림 설정', type: 'label', action: navigateToAlarm},
    {text: '어플보호 잠금', type: 'toggle', action: navigateToLock},
    {
      text: '오류 제보',
      type: 'label',
      action: navigateToMail,
    },
  ];

  return (
    <ImageBackground
      style={{height: '100%'}}
      resizeMode={'cover'}
      source={Images.backgroundImage}>
      <View>
        <View style={styles.container}>
          <View style={styles.loudspeacker}>
            <TouchableOpacity onPress={navigateToNotice}>
              <LoudSpeacker />
            </TouchableOpacity>
          </View>
          <View style={styles.profile}>
            <Profile />
            <View style={styles.setting}>
              <EditProfile />
            </View>
            <Text style={styles.title}>억지로 웃는 고양이</Text>
            <Text style={styles.email}>email@gmail.com</Text>
          </View>
          <View style={styles.usersection}>
            {userSection.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => item.action()}>
                <View style={styles.usersectionlist}>
                  <Text style={styles.title}>{item.text}</Text>
                  {item.type === 'toggle' && <Switch />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.status}>
            <TouchableOpacity onPress={userLogout}>
              <Text style={styles.title}>로그아웃 </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={userWithdraw}>
              <Text style={styles.title}>탈퇴하기 </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 60,
    position: 'relative',
  },

  loudspeacker: {
    position: 'absolute',
    top: 10,
    left: 15,
  },

  profile: {
    alignItems: 'center',
    gap: 5,
    padding: 14,
    width: '100%',
    borderBottomColor: colors.darkBrown,
    borderBottomWidth: 1,
    position: 'relative',
  },

  setting: {
    position: 'absolute',
    right: 30,
    top: 86,
  },

  title: {
    fontSize: 20,
    fontFamily: Fonts.MapoFont,
  },

  email: {
    color: colors.darkBrown,
    fontSize: 15,
    fontFamily: Fonts.MapoFont,
  },
  usersection: {
    width: '100%',
    height: 380,
    justifyContent: 'center',
    marginVertical: 10,
    padding: 10,
    borderBottomColor: colors.darkBrown,
    borderBottomWidth: 1,
  },

  usersectionlist: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 10,
  },
  user: {
    fontSize: 20,
    fontFamily: Fonts.MapoFont,
  },
  status: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
});
export default UserProfile;