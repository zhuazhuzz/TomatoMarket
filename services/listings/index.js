import { randomBytes } from 'crypto';
import { listingDB } from './listingsDB.js'
import express from "express"
import cors from 'cors'
import morgan from 'morgan'
import winston from 'winston'

const app = express()

app.use(cors())
app.use(express.json())

app.use(morgan(':date[iso] :method :url', {
    stream: { write: (message) => listingLogger.info(message.trim()) }
}));

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `[Process ID: ${process.pid}] ${timestamp} [${level}]: ${message}`;
});
export const listingLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'Listing.log' })
    ]
});

await listingDB.connect()

app.get('/listing', async (req, res) => {
    try {
        const allListings = await listingDB.allListings()
        listingLogger.info("OK STATUS, /listing GET REQUEST")
        res.json(allListings)
    } catch(err) {
        listingLogger.info("404 STATUS, /listing GET REQUEST")
        res.status(404).send(`Error: ${err}`, "Failed to retrieve all listings of items")
    }
})

app.post('/listing', async (req, res) => {
    try {
        const id = randomBytes(4).toString('hex');
        const { name, image, price }= req.body
        await listingDB.createListing(id, name, btoa(image), price)
        listingLogger.info("OK STATUS, /listing POST REQUEST")
        res.send("Inserted Listing into DB")
    } catch(err) {
        listingLogger.info("404 STATUS, /listing POST REQUEST")
        res.status(404).send(`Error: ${err}`, "Failed to add a listing to database")
    }
})

app.delete('/listing/:id', async (req, res) => {
    try {
        const id = req.params.id
        await listingDB.deleteListing(id)
        listingLogger.info("OK STATUS, /listing/:id DELETE REQUEST")
        res.send("Deleted from DB")
    } catch(err) {
        listingLogger.info("404 STATUS, /listing/:id DELETE REQUEST")
        res.status(404).send(`Error: ${err}`, "Failed to delete listing from database")
    }
})

app.listen(4000, () => {
    console.log("\x1b[32m", "Listings Service is running on PORT 4000")
})