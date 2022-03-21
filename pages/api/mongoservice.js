// import { MongoClient } from "mongodb";
import mongo from "./service";
export default async function handler(req, res) {
    const yourCollection = mongo("players");

    if (req.method === "POST") {
        const data = req.body;
        const result = await yourCollection.insertOne(data);
        console.log(result);
        client.close();
        res.status(201).json({ message: "Data inserted successfully!" });
    }
}
