import {atom} from 'recoil';

export const emailState = atom<string>({
  key: 'emailState',
  default: '',
});

export const passwordState = atom<string>({
  key: 'passwordState',
  default: '',
});

export const nameState = atom<string>({
  key: 'nameState',
  default: '',
});

export const nicknameState = atom<string>({
  key: 'nicknameState',
  default: '',
});

export const genderState = atom<string>({
  key: 'genderState',
  default: '',
});

export const birthdateState = atom<string>({
  key: 'birthdateState',
  default: '',
});

export const calendarTypeState = atom<string>({
  key: 'calendarTypeState',
  default: '1',
});

export const birthTimeState = atom<string>({
  key: 'birthTimeState',
  default: '모름',
});

export const tokenState = atom<{
  accessToken: string | null;
  refreshToken: string | null;
  fcmToken: string | null;
}>({
  key: 'tokenState',
  default: {
    accessToken: null,
    refreshToken: null,
    fcmToken: null,
  },
});

export const fcmTokenState = atom<string | null>({
    key: 'fcmTokenState',
    default:null,
    });



export const isLoggedInState = atom<boolean>({
  key: 'isLoggedInState',
  default: false,
});