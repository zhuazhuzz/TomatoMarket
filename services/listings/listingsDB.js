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

class ListingDatabase {
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
    this.listingCluster = this.db.collection("listings");
  }

  async close() {
    this.client.close();
  }

  async createListing(id, name, image, price) {
    await this.listingCluster.insertOne({
        id,
        name,
        image,
        price
    });
  }

  async deleteListing(id) {
    await this.listingCluster.deleteOne({ id: { $eq: id } });
  }

  async allListings() {
    return await this.listingCluster.find({}).toArray();
  }
}

const listingDB = new ListingDatabase(url);
export { listingDB };