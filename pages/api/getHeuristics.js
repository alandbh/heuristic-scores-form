import mongo from "./service";

export default async (req, res) => {
    const { collection } = await mongo("heuristics");

    const re = req.query.find
        ? new RegExp(req.query.find, "g")
        : new RegExp(".*", "g");

    const sorting = req.query.orderBy || "slug";

    const heuristics = await collection
        // .find({ slug: { $regex: /^h_2/ } })
        .find({ slug: { $regex: re } })
        .sort({ [sorting]: 1 })
        .limit(20000)
        .toArray();
    // console.log(heuristics);
    res.json(heuristics);
};
