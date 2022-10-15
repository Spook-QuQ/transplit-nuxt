import firebase from '~/plugins/firebase'

export const state = _=> ({
  login: false,
  user: null,
  logInModal: {
    dialog: false,
    type: null,
    currentLoginMethod: null,
    googleAuthPopUpOpening: false,
  },
  snackbar: false,
  snackbarMessage: null,
  data: {
    history: {
      isLoaded: false, // 作ったけど使わないことにした。
      content: []
    }
  }
})

export const mutations = {
  dialogToggle (state, type) {
    state.logInModal.currentLoginMethod = null
    state.logInModal.dialog = !state.logInModal.dialog
    if (type) state.logInModal.type = type
    else state.logInModal.type = null
  },
  setCurrentLoginMethod (state, method) {
    state.logInModal.currentLoginMethod = method
  },
  toggleGoogleAuthPopUpOpening (state, on_off) {
    if (on_off) state.logInModal.googleAuthPopUpOpening = on_off
    else state.logInModal.googleAuthPopUpOpening = !state.logInModal.googleAuthPopUpOpening
  },
  setUser (state, user) {
    const {
      // uid,
      displayName,
      email
    } = user

    // console.log(idToken)

    state.user = {
      // uid,
      displayName,
      email,
      // idToken
    }
    state.login = true
  },
  logout (state) {
    state.login = false,
    state.user = null
    state.data.history.content = []
  },
  setSnackbar (state, text) {
    state.snackbarMessage = text
    state.snackbar = Boolean(text)
  },
  setHistory (state, history) {
    // console.log(history)
    state.data.history.content = history.reverse()
    state.data.history.isLoaded = true
  }
}

export const actions = {
  initUser (context) {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) context.commit('setUser', user)
    })
  },
  async registerEmail (context, form) {
    const { email, password } = form
    return firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
      // context.commit('setUser', result.user)
      context.commit('dialogToggle', false)
      context.dispatch('launchSnackbar', 'Logged-in')
    }).catch(error => {
      context.dispatch('launchSnackbar', error.message)
      throw error
    })
  },
  loginEmail (context, form) {
    const { email, password } = form
    firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
      // context.commit('setUser', result.user)
      context.commit('dialogToggle', false)
      context.dispatch('launchSnackbar', 'Logged-in')
    }).catch((error) => {
      context.dispatch('launchSnackbar', error.message)
      throw error
    });
  },
  loginGoogle (context) {
    context.commit('toggleGoogleAuthPopUpOpening', true)
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider).then(result => {
      // const user = result.user
      // console.log(result)
      context.commit('toggleGoogleAuthPopUpOpening', false)
      // context.commit('setUser', result.user)
      context.commit('dialogToggle', false)
      context.dispatch('launchSnackbar', 'Logged-in')
    }).catch(error => {
      // console.log('error : ' + error.code)
      context.commit('toggleGoogleAuthPopUpOpening', false)
      context.dispatch('launchSnackbar', error.message)
    })
  },
  logout (context) {
    firebase.auth().signOut().then(() => {
      context.commit('logout')
      context.dispatch('launchSnackbar', 'Logged-out')
    }).catch(error => {
      // console.log(error.code)
      context.dispatch('launchSnackbar', 'Error')
    })
  },
  launchSnackbar (context, text) {
    context.commit('setSnackbar', text)
    setTimeout(() => {
      context.commit('setSnackbar', null)
    }, 4000)
  },
  async getIdToken () {
    if (!firebase.auth().currentUser) return
    return await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
  }
}
