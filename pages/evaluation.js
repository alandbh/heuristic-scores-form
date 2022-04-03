import Head from "next/head";
import styles from "../styles/Evaluation.module.scss";
import getData from "../services/getData";
import { useEffect, useState, useCallback } from "react";
import { useLocalStorage, updadePlayer } from "./api/utils";
import PlayerSelect from "../components/Playerselect/Playerselect";
import JourneySelect from "../components/Journeyselect/Journeyselect";
import Header from "../components/Header/Header";
import HeuristicNode from "../components/HeuristicNode/HeuristicNode";

import React from "react";
import debounce from "lodash.debounce";
import Sectionheader from "../components/Sectionheader";

let count = 0;

// setInterval(() => {
//     count++;

//     if (typeof window !== "undefined") {
//         let _localActivePlayer = JSON.parse(
//             localStorage.getItem("localActivePlayer")
//         );
//         delete _localActivePlayer._id;
//         console.log("TEMPO SALVAR - ", _localActivePlayer);
//         updadePlayer(_localActivePlayer);
//     }
// }, 30 * 1000);

// setInterval()

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
        const unsortedHeuristics = journey.heuristics.map((hSlug) => {
            return allHeuristics.filter(
                (heuristic) => heuristic.slug === hSlug
            )[0];
        });

        return orderBy(unsortedHeuristics, "slug");
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

    // setInterval(() => {
    //     count++;

    //     if (typeof window !== "undefined") {
    //         let _localActivePlayer = JSON.parse(
    //             localStorage.getItem("localActivePlayer")
    //         );
    //         delete _localActivePlayer._id;
    //         console.log("TEMPO SALVAR - DENTROO", count);
    //         //updadePlayer(_localActivePlayer);
    //     }
    // }, 30 * 1000);

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
    useEffect(
        debounce(() => {
            if (journeys.length > 0 && activeJourney === null) {
                console.log("setando journey", journeys[0]);
                setActiveJourney(journeys[0]);
                // setLoadedData((loadedData.activeJourney = true));

                console.log("DEBOUUU222");
            }
        }, 500),

        [journeys]
    );

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
        if (heuristics !== undefined) {
            setGroups(getHeuristcGroups(heuristics));
        }
    }, [heuristics]);

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
            // debugger;
            setPlayers(playersFromJourney);
            setPlayerHasChanged(true);
        }
        // loadedData.players = true;
    }, [activeJourney]);

    // Selecting the FIRST PLAYER

    useEffect(
        debounce(() => {
            console.log("ACTIVE PLAYER");
            if (players.length > 0) {
                console.log("PRIMEIRO PLAYER", activePlayer);
                setActivePlayer(players[0]);
            }
        }, 500),
        [players]
    );
    // useEffect(() => {
    //     if (players.length > 0) {
    //         console.log("PRIMEIRO PLAYER", activePlayer);
    //         setActivePlayer(players[0]);
    //     }
    // }, [players]);

    /**
     *
     * UPDATING THE ACTIVE PLAYER'S SCORE
     *
     * @param {string} hSlug
     * @param {number} hscoreValue
     * @param {string} note
     */
    let updatedActivePlayer;

    // const memoSetHeuristicScore = useCallback((hSlug, values) => {
    // });

    const memoSetHeuristicScore = debounce((hSlug, values) => {
        console.log("MEMO FORA AQUI", count++);
        setHeuristicScore(hSlug, values);
    }, 1000);

    if (count > 0) {
        // memoSetHeuristicScore.cancel();
    }

    let debCount = 0;
    const debSetScore = debounce((localPlayer) => {
        console.log("MEMO AQUI SALVANDO", localPlayer, debCount++);
        let _localPlayer = { ...localPlayer };
        delete _localPlayer._id;
        updadePlayer(_localPlayer);
        if (playerHasChanged) {
            // debugger;
            setActivePlayer(_localPlayer);
        }

        // cancelDebounce();
    }, 0.5 * 1000);
    // function debSave(player) {
    //     debSetScore();
    // }
    if (debCount > 0) {
        // debSetScore.cancel();
    }

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

            // debSave(updatedActivePlayer);
            debSetScore(updatedActivePlayer);

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
        if (
            loadedData &&
            groups !== undefined &&
            groups !== null &&
            activeJourney !== undefined &&
            activeJourney !== null &&
            activePlayer !== null
        ) {
            console.log("CARREGOU");
            return true;
        } else {
            return false;
        }
    }

    const [playerHasChanged, setPlayerHasChanged] = useState(false);
    const [journeyHasChanged, setJourneyHasChanged] = useState(false);

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
                            setJourneyHasChanged={setJourneyHasChanged}
                        ></JourneySelect>
                        <PlayerSelect
                            activePlayer={activePlayer}
                            players={players}
                            setActivePlayer={setActivePlayer}
                            setPlayerHasChanged={setPlayerHasChanged}
                        ></PlayerSelect>
                    </Header>
                ) : (
                    <div>Espera</div>
                )}
                <main className="grid gap-5 md:grid-cols-12 grid-cols-1">
                    <div className="col-start-3 col-span-6">
                        {activePlayer !== null ? (
                            groups.map((group, index) => {
                                let aaa;
                                return (
                                    <section
                                        className={styles.section}
                                        key={index}
                                    >
                                        <Sectionheader
                                            index={index}
                                            group={group}
                                            localActivePlayer={
                                                localActivePlayer
                                            }
                                            activeJourney={activeJourney}
                                        ></Sectionheader>

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
                                                        playerHasChanged={
                                                            playerHasChanged
                                                        }
                                                        setPlayerHasChanged={
                                                            setPlayerHasChanged
                                                        }
                                                        activeJourney={
                                                            activeJourney.slug
                                                        }
                                                        journeyHasChanged={
                                                            journeyHasChanged
                                                        }
                                                        title={heuristic.title}
                                                        description={
                                                            heuristic.description
                                                        }
                                                        activePlayer={
                                                            activePlayer
                                                        }
                                                        setScore={(
                                                            slug,
                                                            values
                                                        ) =>
                                                            memoSetHeuristicScore(
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
                    </div>
                    <div className="col-start-9 col-end-12">
                        coluna 2<pre>{JSON.stringify(localActivePlayer)}</pre>
                    </div>
                </main>
            </div>
        )
    );
}

export default evaluation;
