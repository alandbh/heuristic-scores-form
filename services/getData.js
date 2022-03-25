import React from "react";

// import { Container } from './styles';

async function getData(whatToFetch = "players") {
    const params = {
        players: "getPlayers",
        heuristics: "getHeuristics",
        journeys: "getJourneys",
    };
    const response = await fetch(`/api/${params[whatToFetch]}`);
    const data = await response.json();

    return data;
}

export default getData;
