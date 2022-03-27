import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import getData from "../services/getData";
import { useEffect, useState } from "react";
import PlayerSelect from "../components/Playerselect/Playerselect";
import JourneySelect from "../components/Journeyselect/Journeyselect";
import Header from "../components/Header/Header";

import React from "react";
import Loader from "../components/Wave/Wave";

// import { Container } from './styles';

function evaluation() {
    const [players, setPlayers] = useState([]);
    const [allPlayers, setAllPlayers] = useState([]);
    const [activePlayer, setActivePlayer] = useState(null);

    const [journeys, setJourneys] = useState([]);
    const [activeJourney, setActiveJourney] = useState(null);

    const [allHeuristics, setAllHeuristics] = useState([]);

    // Fetching all Players from Database
    useEffect(async () => {
        setAllPlayers(await getData("players", "name"));
        // console.log(await getData("players", "name"));
    }, []);

    //Fetching all Journeys
    useEffect(async () => {
        setJourneys(await getData("journeys"));
    }, [allPlayers]);

    // Selecting the FIRST JOURNEY
    useEffect(() => {
        setActiveJourney(journeys[0]);
    }, [journeys]);

    // Filtering Players from JOURNEY

    useEffect(() => {
        const playersFromJourney =
            activeJourney && allPlayers.length > 0
                ? activeJourney.players.map((id) => {
                      return allPlayers.filter((player) => player.id === id)[0];
                  })
                : [];

        // sort by name
        const sortedPlayers = playersFromJourney.sort(function (a, b) {
            const nameA = a.name.toUpperCase(); // ignore upper and lowercase
            const nameB = b.name.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
        // console.log("FILTERED", sortedPlayers);
        setPlayers(sortedPlayers);
    }, [activeJourney]);

    useEffect(async () => {
        setActivePlayer(players[0]);
    }, [players]);

    /**
     *
     * HEURISTICS
     */

    //Fetching all HEURISTICS based on active JOURNEY

    useEffect(async () => {
        const heuristicsList = activeJourney
            ? activeJourney.heuristics.join()
            : "";
        const filteredHeuristics = await getData(
            "heuristics",
            "slug",
            heuristicsList
        );
        setAllHeuristics(filteredHeuristics);
        // console.log(filteredHeuristics);
    }, [activeJourney]);

    return (
        <div>
            <Head>
                <title>Evaluation - Heuristics Collector</title>
                <meta name="description" content="Heuristics collector" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header className="active">
                <JourneySelect
                    setActiveJourney={setActiveJourney}
                    activeJourney={activeJourney}
                    journeys={journeys}
                ></JourneySelect>
                <PlayerSelect
                    setActivePlayer={setActivePlayer}
                    activePlayer={activePlayer}
                    players={players}
                ></PlayerSelect>
            </Header>

            <main>
                <h1 className={styles.title}>
                    {activePlayer ? activePlayer.name : ""}
                </h1>

                <p>{activeJourney ? activeJourney.title : ""}</p>

                {console.log(activeJourney)}

                <pre style={{ maxWidth: 500, whiteSpace: "pre-line" }}>
                    {JSON.stringify(activeJourney)}
                </pre>
            </main>
        </div>
    );
}

export default evaluation;
