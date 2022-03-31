import mongo from "./service";

export default async (req, res) => {
    const { collection } = await mongo("players");

    const is_array = req.query.find.includes(",");

    const re = req.query.find
        ? new RegExp(req.query.find, "g")
        : new RegExp(".*", "g");

    let findArray = req.query.find.split(",").map((item) => Number(item));
    console.log(findArray);

    // const findMany = is_array ? { $in: findArray } : { $regex: re };
    const findMany = req.query.find
        ? { id: { $in: findArray } }
        : { slug: { $regex: re } };
    const sorting = req.query.orderBy || "slug";

    const players = await collection
        .find(findMany)
        .sort({ [sorting]: 1 })
        .limit(20000)
        .toArray();
    // console.log(players);
    res.json(players);
};
