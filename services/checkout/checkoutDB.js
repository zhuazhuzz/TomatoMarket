import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

let url = process.env.MONGODB_URL

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

class CheckoutDatabase {
  constructor(url) {
    this.url = url;
  }

  async connect() {
    this.client = await MongoClient.connect(this.url, {
      serverApi: ServerApiVersion.v1,
    });
    this.db = this.client.db("mongotest326");
    await this.init();
  }

  async init() {
    this.checkoutCluster = this.db.collection("checkout");
  }

  async close() {
    this.client.close();
  }

  async createCheckoutItem(id, name, image, totalPrice, quantity) {
    await this.checkoutCluster.insertOne({
        id,
        name,
        image,
        totalPrice,
        quantity
    });
  }

  async deleteCheckoutItem(id) {
    await this.checkoutCluster.deleteOne({ id: { $eq: id } });
  }

  async deleteCheckoutAll() {
    await this.checkoutCluster.deleteMany({});
  }

  async allCheckoutItems() {
    return await this.checkoutCluster.find({}).toArray();
  }
}

const checkoutDB = new CheckoutDatabase(url);
export { checkoutDB };