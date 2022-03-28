import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import getData from "../services/getData";
import { useEffect, useState } from "react";
import PlayerSelect from "../components/Playerselect/Playerselect";
import JourneySelect from "../components/Journeyselect/Journeyselect";
import Header from "../components/Header/Header";
import HeuristicNode from "../components/HeuristicNode/HeuristicNode";

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

    const [hscore, setHeuScore] = useState(null);

    function setHeuristicScore(hSlug, hscoreValue, note) {
        setHeuScore(hscoreValue);

        if (activePlayer && activeJourney) {
            activePlayer.scores[activeJourney.slug] = {
                [hSlug]: {
                    score: hscoreValue,
                    note,
                },
            };
            // activePlayer.scores[activeJourney.slug][slug].score = hscoreValue;
            // activePlayer.scores[activeJourney.slug][slug].none = note;
            // activePlayer.scores[activeJourney.slug] = "alannnn";
            console.log("SCORE", activePlayer);
        }
    }

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
        const filteredHeuristics = activeJourney
            ? await getData("heuristics", "slug", heuristicsList)
            : [];
        setAllHeuristics(filteredHeuristics);
        // debugger;
        // console.log(filteredHeuristics);

        const allGroups = filteredHeuristics.map(
            (heuristic) => heuristic.group
        );
        const uniqueGroups = [...new Set(allGroups)];
        console.log(uniqueGroups);
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
                <p>O SCORE É: {hscore ? hscore.h_1_1 : ""}</p>

                <div>
                    <section>
                        <div className="sectionHeader">
                            <h1>1 Need Recognition</h1>
                            <div className="sectionScore">
                                <span>25 of 30</span>
                                <img src="/minichart.png" />
                            </div>
                        </div>

                        <div className="sectionContainer">
                            <div className="heuristicWrapper">
                                <HeuristicNode
                                    slug="h_1_1"
                                    setScore={(score) =>
                                        setHeuristicScore(
                                            "h_1_1",
                                            score,
                                            "uma nota"
                                        )
                                    }
                                    title={"Is the navigation obvious bla bla"}
                                    description={
                                        "Customer should be able to move easily through the different sections."
                                    }
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <pre style={{ maxWidth: 500, whiteSpace: "pre-line" }}>
                    {JSON.stringify(activeJourney)}
                </pre>
            </main>
        </div>
    );
}

export default evaluation;
