import {Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import colors from '../constants/colors';
import Fonts from '../constants/fonts';

type PROPS = {
  onPress: () => void;
  text?: string | 'PRIMARY' | 'SECONDARY' | 'NONESTYLE';
  type?: 'PRIMARY' | 'SECONDARY' | 'NONESTYLE';
};

const CustomBtn = ({onPress, text = 'PRIMARY', type = 'PRIMARY'}: PROPS) => {
  return (
    <Pressable onPress={onPress} style={styles[`container_${type}`]}>
      <Text style={styles[`text_${type}`]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container_PRIMARY: {
    backgroundColor: colors.secondaryColorNavy,
    width: '100%',
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },

  container_SECONDARY: {
    backgroundColor: colors.primaryColorSky,
    width: '100%',
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },

  container_NONESTYLE: {
    backgroundColor: colors.white,
    width: '100%',
    padding: 15,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  text_PRIMARY: {
    fontFamily: Fonts.MapoFont,
    letterSpacing: 3,
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text_SECONDARY: {
    fontFamily: Fonts.MapoFont,
    letterSpacing: 3,
    color: colors.black,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text_NONESTYLE: {
    color: colors.black,
    fontFamily: Fonts.MapoFont,
    letterSpacing: 3,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CustomBtn;