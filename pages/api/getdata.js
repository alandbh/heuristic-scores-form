import mongo from "./service";

export default async (req, res) => {
    const { collection } = await mongo("players");

    const movies = await collection.find({}).limit(20).toArray();
    console.log(movies);
    res.json(movies);
};
