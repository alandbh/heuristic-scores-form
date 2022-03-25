import mongo from "./service";

export default async (req, res) => {
    const { collection } = await mongo("players");

    const players = await collection.find({}).limit(20).toArray();
    // console.log(players);
    res.json(players);
};
