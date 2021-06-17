const express = require('express')
const app = express();
const cors = require('cors')

app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
      next();
    } else {
      express.json()(req, res, next);
    }
});

const initializeDb = require('./db.js')

const routes = require('./routes')

const port = 3001;

initializeDb()
.then(db => {
    const server = routes(app, db).listen(port, () => console.log(`Listening on : http://localhost:${port}`))    
}).catch(err => {
    console.error('Failed to make all database connections!')
    console.error(err)
    process.exit(1)
})






