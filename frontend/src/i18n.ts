import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
  en: {
    translation: {
      "Welcome": "Welcome to Biokompetensiya",
      "VirtualLabs": "Virtual Labs",
      "AITutor": "AI Tutor",
      "Progress": "Progress Tracking",
      "StartLearning": "Start Learning Now",
      "ViewDemo": "View Demo",
      "Login": "Log in",
      "Signup": "Sign up"
    }
  },
  uz: {
    translation: {
      "Welcome": "Biokompetensiya ga xush kelibsiz",
      "VirtualLabs": "Virtual Laboratoriyalar",
      "AITutor": "Sun'iy Intellekt Tyutori",
      "Progress": "O'zlashtirishni Kuzatish",
      "StartLearning": "O'qishni Boshlash",
      "ViewDemo": "Dernoni Ko'rish",
      "Login": "Kirish",
      "Signup": "Ro'yxatdan o'tish"
    }
  },
  ru: {
    translation: {
      "Welcome": "Добро пожаловать в Biokompetensiya",
      "VirtualLabs": "Виртуальные Лаборатории",
      "AITutor": "ИИ Репетитор",
      "Progress": "Отслеживание Прогресса",
      "StartLearning": "Начать Обучение",
      "ViewDemo": "Посмотреть Демо",
      "Login": "Войти",
      "Signup": "Регистрация"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
