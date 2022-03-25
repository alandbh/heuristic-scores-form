import mongo from "./service";

export default async (req, res) => {
    const { collection } = await mongo("heuristics");

    const heuristics = await collection.find({}).limit(20).toArray();
    // console.log(heuristics);
    res.json(heuristics);
};
