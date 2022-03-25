import mongo from "./service";

export default async (req, res) => {
    const { collection } = await mongo("players");

    const players = await collection
        .find({})
        .sort({ [req.query.orderBy]: 1 })
        .limit(20000)
        .toArray();
    // console.log(players);
    res.json(players);
};
