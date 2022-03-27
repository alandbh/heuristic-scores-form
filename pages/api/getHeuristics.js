import mongo from "./service";

export default async (req, res) => {
    const { collection } = await mongo("heuristics");

    const is_array = req.query.find.includes(",");

    // console.log(req.query.find.split(","));
    // console.log(is_array);

    const re = req.query.find
        ? new RegExp(req.query.find, "g")
        : new RegExp(".*", "g");

    const findMany = is_array
        ? { $in: req.query.find.split(",") }
        : { $regex: re };
    const sorting = req.query.orderBy || "slug";

    const heuristics = await collection
        // .find({ slug: { $regex: /^h_2/ } })
        .find({ slug: findMany })
        .sort({ [sorting]: 1 })
        .limit(20000)
        .toArray();
    // console.log(heuristics);
    res.json(heuristics);
};
