module.exports = {
  ensureAuthenticated: (req) => {
    return req.isAuthenticated()
  },
  getUser: (req) => {
    return req.user
  }
}
