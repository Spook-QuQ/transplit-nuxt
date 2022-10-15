import firebase from 'firebase/app'
import 'firebase/auth'

const { firebaseConfig } = process.env

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
