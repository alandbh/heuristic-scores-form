import mongo from "./service";

export default async function handler(req, res) {
    const { collection, client } = await mongo("players");

    const query = { nome: "Dafitti" };

    if (req.method === "POST") {
        const data = req.body;
        const result = await collection.insertOne(data);
        // {nome: "Dafitti"}
        // const result = await collection.replaceOne(query, data, {
        //     unique: true,
        // });
        console.log(result);
        client.close();
        res.status(201).json({ message: "Data inserted successfully!" });
    }
}
