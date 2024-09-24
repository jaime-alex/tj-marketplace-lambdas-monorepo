import express from "express";
import {run} from "../services/mongo-db";
var router = express.Router()

router.get('/', async (req, res) => {
    await run().then(res => {
        console.log("success")
    }).catch((err: any) => {
        console.error("error", err)
    })
    res.send('Birds home page')
})

// define the about route
router.get('/about', (req, res) => {
    res.send('About birds')
})

export default router
