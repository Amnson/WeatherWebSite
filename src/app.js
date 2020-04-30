const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Set up static directory to serve
app.use(express.static(publicDirectoryPath))


app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'John Williamson'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'John Williamson'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        help: 'This page will help you.',
        title: 'Help',
        name: 'John Williamson'
    })
})

app.get('/weather', (req, res) => {
if (!req.query.address) {
    return res.send({
        error: 'You must provide an address'       
    })
}

geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
        return res.send({ error })
    }

    forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
            return res.send({ error })
        }

        res.send({
            forecast: forecastData,
            location,
            address: req.query.address
         })
     })
})


})



// app.get('/products', (req, res) => {
// if (!req.query.search) {
//     return res.send({
//         error: 'You must provide a search term'
//     })
// }

//     console.log(req.query)
//     res.send({
//         products: []
//     })
// })


//Setting up 404 Errors
app.get('/help/*', (req, res) => {
    res.render('404Page', {
        title: '404 Error',
        name: 'John Williamson',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404Page', {
        title: '404 Error',
        name: 'John Williamson',
        errorMessage: 'Page not Found'
    })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000')
})
