import express from "express";
var router = express.Router()

router.get('/', (req, res) => {
    res.send('Birds home page')
})

// define the about route
router.get('/about', (req, res) => {
    res.send('About birds')
})

export default router
