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

class ReviewDatabase {
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
    this.reviewCluster = this.db.collection("reviews");
  }

  async close() {
    this.client.close();
  }

  async createReview(product_id, review_id, content) {
    await this.reviewCluster.insertOne({
        product_id,
        review_id,
        content
    });
  }

  async deleteReview(product_id, review_id) {
    await this.reviewCluster.deleteOne({ product_id: { $eq: product_id }, review_id: { $eq: review_id } });
  }

  async allReview(product_id) {
    return await this.reviewCluster.find({ product_id: { $eq: product_id } }).toArray();
  }
}

const reviewDB = new ReviewDatabase(url);
export { reviewDB };