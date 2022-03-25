import mongo from "./service";

export default async function handler(req, res) {
    const { collection, client } = await mongo("journeys");

    if (req.method === "POST") {
        const data = req.body;
        const result = await collection.insertOne(data);

        console.log(result);
        client.close();
        res.status(201).json({ message: "Journeys inserted successfully!" });
    }
}
