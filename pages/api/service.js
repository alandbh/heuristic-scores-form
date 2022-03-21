import { MongoClient } from "mongodb";

export default async function mongo(collection) {
    const client = await MongoClient.connect(
        "mongodb+srv://rgaPocGcp:jQQXzzlVYbek5rxn@omnistack.mhbna.mongodb.net/rgaPocGcp?retryWrites=true&w=majority"
    );

    const db = client.db();
    const _collection = db.collection(collection);

    return { db, collection: _collection, client };
}
