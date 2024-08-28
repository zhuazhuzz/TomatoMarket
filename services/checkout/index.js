import { randomBytes } from 'crypto';
import { checkoutDB } from './checkoutDB.js'
import express from "express"
import cors from 'cors'
import morgan from 'morgan'
import winston from 'winston'

const app = express()

app.use(cors())
app.use(express.json())

app.use(morgan(':date[iso] :method :url', {
    stream: { write: (message) => checkoutLogger.info(message.trim()) }
}));

const customFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `[Process ID: ${process.pid}] ${timestamp} [${level}]: ${message}`;
});
export const checkoutLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        customFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'Checkout.log' })
    ]
});

await checkoutDB.connect()


app.get('/checkout', async (req, res) => {
    try {
        const allCheckoutItems = await checkoutDB.allCheckoutItems()
        checkoutLogger.info("Status OK GET Request at endpoint /checkout in Checkout Service")
        res.json(allCheckoutItems)
    } catch(err) {
        checkoutLogger.info("Caught Error in GET Request to Checkout Service at endpoint /checkout, status 404")
        res.status(404).send(`Error: ${err}`, "Failed to retrieve all checkout items")
    }
})

app.post('/checkout', async (req, res) => {
    try {
        const { id, name, image, totalPrice, quantity } = req.body
        await checkoutDB.createCheckoutItem(id, name, image, (parseFloat(totalPrice)*parseFloat(quantity)), quantity)
        checkoutLogger.info("Status OK POST Request to Checkout Service at endpoint /checkout")
        res.send("Inserted Checkout Item into DB")
    } catch(err) {
        checkoutLogger.info("Caught Error in POST Request to checkout service, /checkpoint endpoint")
        res.status(404).send(`Error: ${err}`, "Failed to add a checkout item to database")
    }
})

app.delete('/checkout/:id', async (req, res) => {
    try {
        const id = req.params.id
        await checkoutDB.deleteCheckoutItem(id)
        checkoutLogger.info("Status OK, DELETE Request to Checkout Service at endpoint /checkout/:id")
        res.send("Deleted from DB")
    } catch(err) {
        checkoutLogger.info("Caught Error in DELETE Request to Checkout Service at /checkout/:id")
        res.status(404).send(`Error: ${err}`, "Failed to delete checkout item from database")
    }
})

app.delete('/removeall', async (req, res) => {
    try {
        await checkoutDB.deleteCheckoutAll()
        checkoutLogger.info("Status OK /removeall from Checkout Service")
        res.send("Deleted ALL items from DB")
    } catch(err) {
        checkoutLogger.info("404 Error /removeall endpoint at Checkout Service")
        res.status(404).send(`Error: ${err}`, "Failed to delete checkout from database collections")
    }
})

app.listen(4001, () => {
    console.log("\x1b[32m", "Checkout Service is running on PORT 4001")
})