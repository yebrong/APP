import React, {useState} from 'react';
import {View, Text, ImageBackground, StyleSheet, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Fonts from '../../constants/fonts';
import Images from '../../constants/images';
import CustomProgressBar from '../../components/CustomProgressBar';
import DateTimePicker from '../../components/DateTimePicker';
import CustomBtn from '../../components/CustomBtn';
import {DiaryEmotionProps} from '../../types/diary.type';
import {useRecoilValue} from 'recoil';
import {tokenState} from '../../atoms/authAtom';
import {makeApiRequest} from '../../utils/api';

const DiaryEmotion = ({route, navigation}: DiaryEmotionProps) => {
  const {diaryId, emotionId} = route?.params || {}; // 감정 추가 시 diaryId가 없을 수 있음
  const [selectedColors, setSelectedColors] = useState({
    green: '#FFFFFF',
    blue: '#FFFFFF',
    red: '#FFFFFF',
    orange: '#FFFFFF',
    black: '#FFFFFF',
  });

  const [selectedLevels, setSelectedLevels] = useState({
    joy: 0,
    sadness: 0,
    anger: 0,
    anxiety: 0,
    boredom: 0,
  });

  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜 저장
  const accessToken = useRecoilValue(tokenState); // accessToken 가져옴

  const handleColorChange = (colorName: string, color: string) => {
    setSelectedColors(prevColors => ({
      ...prevColors,
      [colorName]: color || '#FFFFFF',
    }));
  };

  const handleLevelChange = (emotionName: string) => (value: number) => {
    setSelectedLevels(prevLevels => ({
      ...prevLevels,
      [emotionName]: value,
    }));
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const saveEmotionData = async () => {
    try {
      const emotionData = {
        joy: selectedLevels.joy,
        sadness: selectedLevels.sadness,
        anger: selectedLevels.anger,
        anxiety: selectedLevels.anxiety,
        boredom: selectedLevels.boredom,
        date: formatDate(selectedDate),
      };

      const apiUrl = emotionId
        ? `diaries/self-emotions/${emotionId}` // 감정 수정 요청
        : 'diaries/self-emotions'; // 새 감정 추가 요청
      const method = emotionId ? 'PUT' : 'POST';

      const response = await makeApiRequest(
        method,
        apiUrl,
        emotionData,
        'application/json',
        accessToken || undefined,
      );

      if (response.status === 200 || response.status === 201) {
        if (method === 'POST') {
          Alert.alert('감정 추가 성공', '감정이 성공적으로 추가되었습니다.', [
            {
              text: '확인',
              onPress: () => navigation.navigate('Dailys'), // 'Dailys'로 이동 (diaryId 불필요)
            },
          ]);
        } else {
          Alert.alert('감정 수정 성공', '감정이 성공적으로 수정되었습니다.', [
            {
              text: '확인',
              onPress: () =>
                navigation.navigate('MyDiary', {
                  diaryId, // diaryId와 emotionId를 전달하여 'MyDiary'로 이동
                  emotionId: emotionId,
                }),
            },
          ]);
        }
      } else {
        console.error(
          '감정 데이터 처리 실패:',
          response.data?.errorMessage || '알 수 없는 오류',
        );
        Alert.alert(
          '감정 처리 실패',
          response.data?.errorMessage || '감정 처리에 실패했습니다.',
        );
      }
    } catch (error: any) {
      console.error('서버 요청 중 오류 발생:', error);
      Alert.alert(
        '서버 요청 중 오류 발생',
        error.message || '오류가 발생했습니다.',
      );
    }
  };

  return (
    <ImageBackground
      style={{height: '100%'}}
      resizeMode={'cover'}
      source={Images.backgroundImage}>
      <View style={styles.container}>
        <DateTimePicker
          defaultValue={selectedDate}
          onDateChange={value => setSelectedDate(value)}
        />
        <Text style={styles.title}>
          {emotionId ? '감정 수정하기' : '데일리 감정 측정'}
        </Text>
        <Text style={styles.text}>0-100 단위</Text>
        <View style={styles.progressbar}>
          <CustomProgressBar
            colorName="green"
            emoji="😊"
            emotionLabel="기쁨"
            onColorChange={(colorName, color) =>
              handleColorChange(colorName, color)
            }
            onLevelChange={handleLevelChange('joy')}
          />
          <CustomProgressBar
            colorName="blue"
            emoji="😭"
            emotionLabel="슬픔"
            onColorChange={(colorName, color) =>
              handleColorChange(colorName, color)
            }
            onLevelChange={handleLevelChange('sadness')}
          />
          <CustomProgressBar
            colorName="red"
            emoji="😤"
            emotionLabel="화남"
            onColorChange={(colorName, color) =>
              handleColorChange(colorName, color)
            }
            onLevelChange={handleLevelChange('anger')}
          />
          <CustomProgressBar
            colorName="orange"
            emoji="😰"
            emotionLabel="불안"
            onColorChange={(colorName, color) =>
              handleColorChange(colorName, color)
            }
            onLevelChange={handleLevelChange('anxiety')}
          />
          <CustomProgressBar
            colorName="black"
            emoji="😑"
            emotionLabel="따분"
            onColorChange={(colorName, color) =>
              handleColorChange(colorName, color)
            }
            onLevelChange={handleLevelChange('boredom')}
          />

          <LinearGradient
            colors={[
              selectedColors.green,
              selectedColors.blue,
              selectedColors.red,
              selectedColors.orange,
              selectedColors.black,
            ]}
            style={styles.gradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          />
        </View>
        <CustomBtn
          onPress={saveEmotionData}
          text={emotionId ? '감정 수정하기' : '감정 추가하기'}
          type="SECONDARY"
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.MapoFont,
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 12,
    letterSpacing: 5,
  },
  text: {
    fontFamily: Fonts.MapoFont,
    fontSize: 16,
    textAlign: 'right',
  },
  progressbar: {
    gap: 30,
  },
  gradient: {
    height: 34,
    borderRadius: 8,
    marginVertical: 20,
  },
});

export default DiaryEmotion;
