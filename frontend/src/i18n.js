import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "sentimentAnalysis": "Sentiment Analysis",
      "beyondImagination": "Beyond Imagination",
      "oneAnalysisAway": "One analysis away from market insights.",
      "news": "News",
      "text": "Text",
      "url": "URL",
      "analyze": "Analyze",
      "analyzing": "Analyzing...",
      // Add more translations here
    }
  },
  es: {
    translation: {
      "sentimentAnalysis": "Análisis de Sentimiento",
      "beyondImagination": "Más Allá de la Imaginación",
      "oneAnalysisAway": "A un análisis de distancia de los insights del mercado.",
      "news": "Noticias",
      "text": "Texto",
      "url": "URL",
      "analyze": "Analizar",
      "analyzing": "Analizando...",
      // Add more translations here
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;