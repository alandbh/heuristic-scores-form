import { MongoClient } from "mongodb";

export default async function mongo(collection) {
    const client = await MongoClient.connect(process.env.MONGO);

    const db = client.db();
    const _collection = db.collection(collection);

    return { db, collection: _collection, client };
}
