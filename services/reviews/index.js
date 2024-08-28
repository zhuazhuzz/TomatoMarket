import { randomBytes } from 'crypto';
import { reviewDB } from './reviewsDB.js'
import express from "express"
import cors from 'cors'
import morgan from 'morgan'
import winston from 'winston'

const app = express()

app.use(cors())
app.use(express.json())

app.use(morgan(':date[iso] :method :url', {
    stream: { write: (message) => reviewLogger.info(message.trim()) }
}));

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `[Process ID: ${process.pid}] ${timestamp} [${level}]: ${message}`;
});
export const reviewLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'Review.log' })
    ]
});

await reviewDB.connect()

app.get('/reviews/:id', async (req, res) => {
    try {
        const product_id = req.params.id
        const allReviews = await reviewDB.allReview(product_id)
        reviewLogger.info("OK STATUS, /reviews/:id GET REQUEST")
        res.json(allReviews)
    } catch(err) {
        reviewLogger.info("404 STATUS, /reviews/:id GET REQUEST")
        res.status(404).send(`Error: ${err}`, "Failed to retrieve all reviews of this product")
    }
})

app.post('/reviews', async (req, res) => {
    try {
        const id = randomBytes(4).toString('hex');
        const { product_id, content } = req.body
        await reviewDB.createReview(product_id, id, content)
        reviewLogger.info("OK STATUS, /reviews POST REQUEST")
        res.send("Inserted Review into DB")
    } catch(err) {
        reviewLogger.info("404 STATUS, /reviews POST REQUEST")
        res.status(404).send(`Error: ${err}`, "Failed to add a listing to database")
    }
})

app.delete('/reviews', async (req, res) => {
    try {
        const { product_id, review_id } = req.body
        await reviewDB.deleteReview(product_id, review_id)
        reviewLogger.info("OK STATUS, /reviews DELETE REQUEST")
        res.send("Deleted from DB")
    } catch(err) {
        reviewLogger.info("404 STATUS, /reviews DELETE REQUEST")
        res.status(404).send(`Error: ${err}`, "Failed to delete review from database")
    }
})

app.listen(4002, () => {
    console.log("\x1b[32m", "Review Service is running on PORT 4002")
})