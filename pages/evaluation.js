import Head from "next/head";
import styles from "../styles/Home.module.scss";
import getData from "../services/getData";
import { useEffect, useState } from "react";
import { useLocalStorage } from "./api/utils";
import PlayerSelect from "../components/Playerselect/Playerselect";
import JourneySelect from "../components/Journeyselect/Journeyselect";
import Header from "../components/Header/Header";
import HeuristicNode from "../components/HeuristicNode/HeuristicNode";

import React from "react";

function orderBy(array, param) {
    return array.sort((a, b) => a[param].localeCompare(b[param]));
}

function getPlayersFromJourney(journey, allPlayers) {
    if (journey && allPlayers.length > 0) {
    }
    const unsortedPlayers = journey.players.map((plId) => {
        return allPlayers.filter((player) => player.id === plId)[0];
    });
    return orderBy(unsortedPlayers, "slug");
}

function getHeuristicsFromJourney(journey, allHeuristics) {
    if (journey && allHeuristics.length > 0) {
        return journey.heuristics.map((hSlug) => {
            return allHeuristics.filter(
                (heuristic) => heuristic.slug === hSlug
            )[0];
        });
    }
}

function getHeuristcGroups(allHeuristics) {
    if (allHeuristics.length > 0) {
        const allGroups = allHeuristics.map((heuristic) => heuristic.group);
        const uniqueGroups = [...new Set(allGroups)];

        const groupsWithHeuristics = [];

        uniqueGroups.map((group) => {
            groupsWithHeuristics.push({
                name: group,
                heuristics: allHeuristics.filter(
                    (heuristic) => heuristic.group === group
                ),
            });
        });

        return groupsWithHeuristics;
    }

    return [];
}
function objIsEmpty(obj) {
    return obj.constructor === Object && Object.keys(obj).length === 0;
}
// import { Container } from './styles';

// let localActivePlayer = {};

function evaluation() {
    const [allPlayers, setAllPlayers] = useLocalStorage("allPlayers", []);
    const [players, setPlayers] = useLocalStorage("players", []);
    const [activePlayer, setActivePlayer] = useLocalStorage(
        "activePlayer",
        null
    );

    const [journeys, setJourneys] = useLocalStorage("journeys", []);
    const [activeJourney, setActiveJourney] = useLocalStorage(
        "activeJourney",
        null
    );

    const [allHeuristics, setAllHeuristics] = useLocalStorage(
        "allHeuristics",
        []
    );
    const [heuristics, setHeuristics] = useLocalStorage("heuristics", []);
    const [groups, setGroups] = useLocalStorage("groups", []);

    const [loadedData, setLoadedData] = useState({
        journeys: false,
        allPlayers: false,
        heuristics: false,
        activePlayer: false,
        activeJourney: false,
        players: false,
    });

    const [localActivePlayer, setLocalActivePlayer] = useState({});
    /**
     *
     * Fetching All Data From Database
     */
    useEffect(() => {
        // All Journeys

        getData("journeys").then((data) => {
            console.log("dentro", data);
            setJourneys(data);
            setLoadedData((loadedData.journeys = true));
            // loadedData.journeys = true;
        });

        // Fetching all Players
        getData("players").then((data) => {
            setAllPlayers(data);
            setLoadedData((loadedData.allPlayers = true));
            // loadedData.allPlayers = true;
        });

        // Fetching all Heuristics
        getData("heuristics").then((data) => {
            setAllHeuristics(data);
            setLoadedData((loadedData.heuristics = true));
        });
    }, []);

    // Selecting the FIRST JOURNEY
    useEffect(() => {
        if (journeys.length > 0 && activeJourney === null) {
            console.log("setando journey", journeys[0]);
            setActiveJourney(journeys[0]);
            // setLoadedData((loadedData.activeJourney = true));
        }
    }, [journeys]);

    /**
     *
     * HEURISTICS
     */

    // Getting  HEURISTICS based on active JOURNEY

    useEffect(() => {
        setHeuristics(getHeuristicsFromJourney(activeJourney, allHeuristics));
    }, [activeJourney, allHeuristics]);

    // Setting Heuristic Groups
    useEffect(() => {
        setGroups(getHeuristcGroups(allHeuristics));
    }, [allHeuristics, activePlayer]);

    /**
     *
     * PLAYERS
     *
     */

    // Filtering Players from ACTIVE JOURNEY

    useEffect(() => {
        // console.log("mudou", loadedData.activeJourney);
        console.log("mudou journey");
        if (
            activeJourney !== null &&
            activeJourney !== undefined &&
            allPlayers.length > 0
        ) {
            console.log("mudou journey - Setting Players");
            const playersFromJourney = getPlayersFromJourney(
                activeJourney,
                allPlayers
            );
            setPlayers(playersFromJourney);
        }
        // loadedData.players = true;
    }, [activeJourney]);

    // Selecting the FIRST PLAYER
    useEffect(() => {
        if (players.length > 0) {
            console.log("PRIMEIRO PLAYER", activePlayer);
            setActivePlayer(players[0]);
        }
    }, [players]);

    /**
     *
     * UPDATING THE ACTIVE PLAYER'S SCORE
     *
     * @param {string} hSlug
     * @param {number} hscoreValue
     * @param {string} note
     */
    let updatedActivePlayer;

    function setHeuristicScore(hSlug, values) {
        console.log("SETANDO SCORE", hSlug, values);
        if (hSlug && values && activePlayer) {
            updatedActivePlayer = { ...activePlayer };
            updatedActivePlayer.scores[activeJourney.slug][hSlug] = {
                score: values.score,
                note: values.note,
            };

            // setTimeout(() => {
            //     setActivePlayer({ ...updatedActivePlayer });
            // }, 1000);

            // setActivePlayer({ ...updatedActivePlayer });

            localStorage.setItem("localActivePlayer", "");
            localStorage.setItem(
                "localActivePlayer",
                JSON.stringify({ ...updatedActivePlayer })
            );

            // localActivePlayer = { ...updatedActivePlayer };

            setLocalActivePlayer({ ...updatedActivePlayer });

            // loadedData.activePlayer = true;
            // setLoadedData((loadedData.activePlayer = true));
        }
    }

    function getHeuristicsByGroup(group) {
        const heuristicsByGroup = heuristics.filter(
            (heuristic) => heuristic.group === group
        );
        return heuristicsByGroup;
    }

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, [journeys]);

    function check() {
        return loadedData && groups !== undefined && groups !== null;
    }

    return (
        check() && (
            <div>
                <Head>
                    <title>Evaluation - Heuristics Collector</title>
                    <meta name="description" content="Heuristics collector" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                {players && journeys && journeys.length > 0 ? (
                    <Header>
                        <JourneySelect
                            activeJourney={activeJourney}
                            journeys={journeys}
                            setActiveJourney={setActiveJourney}
                        ></JourneySelect>
                        <PlayerSelect
                            activePlayer={activePlayer}
                            players={players}
                            setActivePlayer={setActivePlayer}
                        ></PlayerSelect>
                    </Header>
                ) : (
                    <div>Espera</div>
                )}
                <main>
                    {activePlayer !== null ? (
                        groups.map((group, index) => {
                            let aaa;
                            return (
                                <section key={index}>
                                    <h1>
                                        <span>{index + 1 + ". "}</span>
                                        {group.name}
                                    </h1>

                                    {group.heuristics
                                        .filter((heuristic) =>
                                            activeJourney.heuristics.includes(
                                                heuristic.slug
                                            )
                                        )
                                        .map((heuristic, index) => {
                                            // debugger;

                                            return (
                                                <HeuristicNode
                                                    key={index}
                                                    slug={heuristic.slug}
                                                    activeJourney={
                                                        activeJourney.slug
                                                    }
                                                    title={heuristic.title}
                                                    description={
                                                        heuristic.description
                                                    }
                                                    activePlayer={activePlayer}
                                                    setScore={(slug, values) =>
                                                        setHeuristicScore(
                                                            slug,
                                                            values
                                                        )
                                                    }
                                                />
                                            );
                                        })}
                                </section>
                            );
                        })
                    ) : (
                        <div>Carregando</div>
                    )}

                    <pre>{JSON.stringify(localActivePlayer)}</pre>
                </main>
            </div>
        )
    );
}

export default evaluation;
