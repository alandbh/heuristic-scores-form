import mongo from "./service";

export default async (req, res) => {
    const { collection } = await mongo("journeys");

    const journeys = await collection.find({}).limit(20).toArray();
    // console.log(journeys);
    res.json(journeys);
};
