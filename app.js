const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const session = require('express-session')
var parseurl = require('parseurl')
var cors = require('cors')

// cross origin allowing special routes to access the API (i.e. development of frontend)
var corsOptions = {
    origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
    credentials: false,
    methods: ['GET'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// express web framework
const app = express()
// view engine setup
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'pug')
// logger running on dev
app.use(logger('dev'))
app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

// SESSION

app.use(session({
    secret: '42uihgdui32uh4iunds34h566009ssmf',
    key: 'user_sid',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 600000
    }
}))

app.use(function (req, res, next) {

    if (!req.session.views) {
        req.session.views = {}
    }

    // get the url pathname
    var pathname = parseurl(req).pathname
    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

    next()
})
// END

// routing core point
require('./src/routes/web')(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

app.listen(4200, function () {
    console.log('Example app listening on port 4200!')
})

module.exports = app
