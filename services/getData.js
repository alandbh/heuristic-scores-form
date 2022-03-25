import React from "react";

// import { Container } from './styles';

async function getData(whatToFetch = "players", orderBy = "_id", find = "") {
    const collection = {
        players: "getPlayers",
        heuristics: "getHeuristics",
        journeys: "getJourneys",
    };

    const response = await fetch(
        `/api/${collection[whatToFetch]}?orderBy=${orderBy}&find=${find}`
    );
    const data = await response.json();

    console.log(data);

    return data;
}

export default getData;
