import mongo from "./service";

export default async function handler(req, res) {
    const { collection, client } = await mongo("heuristics");

    if (req.method === "POST") {
        const data = req.body;
        const result = await collection.insertOne(data);

        // console.log(result);
        client.close();
        res.status(201).json({ message: "Heuristics inserted successfully!" });
    }
}
