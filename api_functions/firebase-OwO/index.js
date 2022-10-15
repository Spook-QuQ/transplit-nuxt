module.exports = (serviceAccountConfig, databaseURL) => {
  const admin = require('./initializeAdmin')(serviceAccountConfig, databaseURL)
  return {
    r_db: admin.database(),
    admin
  }
}
