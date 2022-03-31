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

// import { Container } from './styles';

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

    // const [hscore, setHeuScore] = useState(null);

    /**
     *
     * Fetching All Data From Database
     */
    useEffect(async () => {
        // All Journeys

        setJourneys(await getData("journeys"));

        // Fetching all Players
        setAllPlayers(await getData("players"));

        // Fetching all Heuristics
        setAllHeuristics(await getData("heuristics"));
    }, []);

    // Selecting the FIRST JOURNEY
    useEffect(() => {
        setActiveJourney(journeys[0]);
    }, [journeys]);

    function objIsEmpty(obj) {
        return obj.constructor === Object && Object.keys(obj).length === 0;
    }

    /**
     *
     * UPDATING THE ACTIVE PLAYER'S SCORE
     *
     * @param {string} hSlug
     * @param {number} hscoreValue
     * @param {string} note
     */
    let updatedActivePlayer;

    function setHeuristicScore(hSlug, hscoreValue, note) {
        console.log("SETANDO SCORE", hSlug, hscoreValue, note);
        if (hSlug && hscoreValue && activePlayer) {
            updatedActivePlayer = { ...activePlayer };
            updatedActivePlayer.scores[activeJourney.slug][hSlug] = {
                score: hscoreValue,
                note,
            };

            setActivePlayer(updatedActivePlayer);
        }
    }

    // Filtering Players from JOURNEY

    // useEffect(async () => {
    //     console.log("mudou journey");
    //     const playersFromJourney = await getData(
    //         "players",
    //         "slug",
    //         playersIdsFromJourney.join(",")
    //     );

    //     const playersFromJourneyWithScores = isFirstLoad
    //         ? playersFromJourney.map((player) => {
    //               if (objIsEmpty(player.scores)) {
    //                   journeys.map((journey) => {
    //                       player.scores[journey.slug] = {};
    //                   });
    //                   // player.scores[activeJourney.slug] = {};
    //                   activeJourney.heuristics.map((heuristic) => {
    //                       player.scores[activeJourney.slug][heuristic] = {
    //                           score: 3,
    //                           note: "nana",
    //                       };
    //                   });
    //                   isFirstLoad = false;
    //                   return player;
    //               } else {
    //                   isFirstLoad = false;
    //                   return player;
    //               }
    //           })
    //         : players;

    //     setPlayers(playersFromJourneyWithScores);
    // }, [activeJourney]);

    // Selecting the FIRST PLAYER
    // useEffect(() => {
    //     console.log("PRIMEIRO PLAYER", players);
    //     setActivePlayer(players[0]);
    // }, [players]);

    /**
     *
     * HEURISTICS
     */

    //Fetching all HEURISTICS based on active JOURNEY/PLAYER

    // useEffect(async () => {
    //     const heuristicsList = activeJourney
    //         ? activeJourney.heuristics.join()
    //         : "";
    //     const filteredHeuristics = activeJourney
    //         ? await getData("heuristics", "slug", heuristicsList)
    //         : [];
    //     // setAllHeuristics([]);
    //     setHeuristics(filteredHeuristics);
    //     // debugger;
    //     // console.log(filteredHeuristics);
    // }, [activeJourney, activePlayer]);

    // useEffect(() => {
    //     if (heuristics.length > 0) {
    //         const allGroups = heuristics.map((heuristic) => heuristic.group);
    //         const uniqueGroups = [...new Set(allGroups)];
    //         setGroups(uniqueGroups);
    //         console.log(groups);
    //     }
    // }, [heuristics, activePlayer]);

    function getHeuristicsByGroup(group) {
        const heuristicsByGroup = heuristics.filter(
            (heuristic) => heuristic.group === group
        );
        return heuristicsByGroup;
    }

    function loopHeuristics(group) {
        if (activeJourney && activePlayer && heuristics.length > 0) {
            return getHeuristicsByGroup(group).map((heuristic, index) => {
                console.log(activePlayer);
                const currentScore =
                    activePlayer.scores[activeJourney.slug][heuristic.slug];
                return (
                    <div key={heuristic.slug} className="sectionContainer">
                        {/* <> {JSON.stringify(activeJourney.slug)}</> */}
                        <div className="heuristicWrapper">
                            <pre>
                                {JSON.stringify(
                                    activePlayer.scores[activeJourney.slug][
                                        heuristic.slug
                                    ]
                                )}
                            </pre>
                            <HeuristicNode
                                slug={heuristic.slug}
                                title={heuristic.title}
                                description={heuristic.description}
                                currentScore={currentScore}
                                activePlayer={activePlayer}
                                setScore={(slug, score, note) =>
                                    setHeuristicScore(slug, score, note)
                                }
                            />
                        </div>
                    </div>
                );
            });
        } else {
            return <b>LOADING</b>;
        }
    }

    return (
        <div>
            <Head>
                <title>Evaluation - Heuristics Collector</title>
                <meta name="description" content="Heuristics collector" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
        </div>
    );
}

export default evaluation;
