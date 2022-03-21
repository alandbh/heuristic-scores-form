import mongo from "./service";

export default async function handler(req, res) {
    const { collection, client } = await mongo("players");

    const _query = { nome: req.query.player };
    // console.log("asasasasa");
    // console.log(req.query.player);

    if (req.method === "POST") {
        const data = req.body;
        const result = await collection.replaceOne(_query, data, {
            unique: true,
        });
        console.log(result);
        client.close();
        res.status(201).json({ message: "Data inserted successfully!" });
    }
}
