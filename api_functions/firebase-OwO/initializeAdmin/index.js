const admin = require('firebase-admin')
module.exports = (serviceAccountConfig, databaseURL) => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountConfig),
    databaseURL
  })
  return admin
}
