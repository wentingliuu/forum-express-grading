const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const helpers = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const session = require('express-session')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
}))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/image', express.static(__dirname + '/image'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.loginUser = helpers.getUser(req)
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)

module.exports = app
