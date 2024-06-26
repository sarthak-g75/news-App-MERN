// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getStorage } from '@firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBUk9PMPDEyJyim-iq_S45cUHbXr-Fbg34',
  authDomain: 'news-app-cf0e3.firebaseapp.com',
  projectId: 'news-app-cf0e3',
  storageBucket: 'news-app-cf0e3.appspot.com',
  messagingSenderId: '315904406522',
  appId: '1:315904406522:web:572650f92af26d11e06a43',
  measurementId: 'G-JQEPMX4297',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const imageDB = getStorage(app)
