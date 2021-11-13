module.exports = {
  ensureAuthenticated: (req) => {
    return req.isAuthenticated()
  },
  getUser: (req) => {
    return req.user
  },
  role: (isAdmin) => {
    return (isAdmin === 1) ? 'admin' : 'user'
  },
  switchRole: (isAdmin) => {
    return (isAdmin === 1) ? 'set as user' : 'set as admin'
  }
}
