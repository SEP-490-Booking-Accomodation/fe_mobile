import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
  en: {
    translation: require('../locales/en/translation.json')
  },
  vi: {
    translation: require('../locales/vi/translation.json')
  },
  ja: {
    translation: require('../locales/ja/translation.json')
  }
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    const storedLanguage = await AsyncStorage.getItem('user_language');
    callback(storedLanguage || 'vi');
  },
  init: () => {},
  cacheUserLanguage: (language) => {
    AsyncStorage.setItem('user_language', language);
  }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;