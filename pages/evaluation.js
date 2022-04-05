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
import GroupSectionheader from "../components/GroupSectionheader";
import Sectionheader from "../components/Sectionheader";

let count = 0;

setInterval(() => {
    count++;

    if (typeof window !== "undefined") {
        return;
        let _localActivePlayer = JSON.parse(
            localStorage.getItem("localActivePlayer")
        );
        delete _localActivePlayer._id;
        console.log("TEMPO SALVAR - ", _localActivePlayer);
        updadePlayer(_localActivePlayer);
    }
}, 10 * 1000);

// setInterval();

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
    const [groups, setGroups] = useLocalStorage("groups", null);

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
            // console.log("dentro", data);
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
                // console.log("setando journey", journeys[0]);
                setActiveJourney(journeys[0]);
                // setLoadedData((loadedData.activeJourney = true));

                // console.log("DEBOUUU222");
            }
        }, 500),

        [journeys]
    );

    /**
     *
     * GROUPS
     */

    useEffect(
        debounce(() => {
            if (
                journeys &&
                journeys.length > 0 &&
                allHeuristics &&
                allHeuristics.length > 0
            ) {
                let groups = {};

                const allGroupNames = allHeuristics.map(
                    (heuristic) => heuristic.group
                );
                const uniqueGroupNames = [...new Set(allGroupNames)];

                journeys.map((journey) => {
                    groups[journey.slug] = [];

                    const journeyHeuristics = journey.heuristics.map(
                        (heuSlug) => {
                            return allHeuristics.filter(
                                (heuristic) => heuristic.slug === heuSlug
                            )[0];
                        }
                    );

                    uniqueGroupNames.map((groupName) => {
                        groups[journey.slug].push({
                            name: groupName,
                            heuristics: journeyHeuristics.filter(
                                (heuristic) => heuristic.group === groupName
                            ),
                        });
                    });
                });
                // console.log("setando GROUPS journey", groups);
                setGroups(groups);
            }
        }, 500),

        [journeys, allHeuristics, activeJourney]
    );

    /**
     *
     * HEURISTICS
     */

    // Getting  HEURISTICS based on active JOURNEY

    useEffect(() => {
        setHeuristics(getHeuristicsFromJourney(activeJourney, allHeuristics));
    }, [activeJourney, allHeuristics]);

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
            setActivePlayer(playersFromJourney[0]);
            setLocalActivePlayer(playersFromJourney[0]);
            setPlayerHasChanged(true);
        }
        // loadedData.players = true;
    }, [activeJourney]);

    // Selecting the FIRST PLAYER

    useEffect(
        debounce(() => {
            if (players.length > 0) {
                console.log("PRIMEIRO PLAYER", players[0]);
                setActivePlayer({});
                setActivePlayer(players[0]);
            }
        }, 500),
        [players, activeJourney]
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
        // updadePlayer(_localPlayer);
        // setActivePlayer(_localPlayer);
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

    useEffect(() => {
        if (
            localActivePlayer &&
            localActivePlayer.findings !== undefined &&
            localActivePlayer.findings.length > 0
        ) {
            let currentFindings = [...localActivePlayer.findings];

            setFindigns(currentFindings);
            console.log("FIND", findings);
        }
    }, [localActivePlayer]);

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
            groups &&
            groups !== null &&
            activeJourney !== undefined &&
            activeJourney !== null &&
            activePlayer !== null
        ) {
            console.log("CARREGOU");
            // return false;
            return true;
        } else {
            return false;
        }
    }

    const [playerHasChanged, setPlayerHasChanged] = useState(false);
    const [journeyHasChanged, setJourneyHasChanged] = useState(false);

    const [findings, setFindigns] = useState([
        { id: "f1", type: "neutral", text: "" },
    ]);

    function addMoreFinding() {
        let currentFindings = [...findings];
        currentFindings.push({
            id: "f" + (Number(currentFindings.length) + 1),
            type: "neutral",
            text: "",
        });

        setFindigns(currentFindings);
    }

    function handleTypeFinding(ev) {
        console.log(ev.target.id);

        let currentFindings = [...findings];
        currentFindings.find((fi) => fi.id === ev.target.id).text =
            ev.target.value;

        setFindigns(currentFindings);
        setLocalActivePlayer({
            ...localActivePlayer,
            findings: currentFindings,
        });

        localStorage.setItem(
            "localActivePlayer",
            JSON.stringify(localActivePlayer)
        );

        let currentPlayers = [...players];
        currentPlayers.find(
            (player) => player.slug === localActivePlayer.slug
        ).findings = localActivePlayer.findings;
        setPlayers(currentPlayers);
    }

    return (
        check() && (
            <div>
                <Head>
                    <title>Evaluation - Heuristics Collector</title>
                    <meta name="description" content="Heuristics collector" />
                    <link rel="icon" href="/favicon.ico" />
                    <link
                        rel="preconnect"
                        href="https://fonts.googleapis.com"
                    ></link>
                    <link
                        rel="preconnect"
                        href="https://fonts.gstatic.com"
                        crossorigin
                    ></link>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,700;1,400&display=swap"
                        rel="stylesheet"
                    ></link>
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
                            groups[activeJourney.slug].map((group, index) => {
                                let aaa;
                                return (
                                    <>
                                        <section
                                            className={styles.sectionContainer}
                                            key={index}
                                        >
                                            <GroupSectionheader
                                                index={index}
                                                group={group}
                                                activePlayer={activePlayer}
                                                activeJourney={activeJourney}
                                            ></GroupSectionheader>

                                            <div
                                                className={
                                                    styles.sectionContent
                                                }
                                            >
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
                                                                slug={
                                                                    heuristic.slug
                                                                }
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
                                                                title={
                                                                    heuristic.title
                                                                }
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
                                            </div>
                                        </section>
                                    </>
                                );
                            })
                        ) : (
                            <div>Carregando</div>
                        )}

                        {activePlayer !== null ? (
                            <section className={styles.findingsContainer}>
                                <Sectionheader text="General Findings" />

                                <div className={styles.sectionContent}>
                                    <h2>
                                        Some good or bad thing you want to
                                        highlight
                                    </h2>
                                    <p>
                                        This is a space for you to put some
                                        useful findings regarding this player,
                                        that are not described in none of the
                                        heuristics above. It could be a good
                                        thing (like this player allows credit
                                        card scanning) or a bad one (the face
                                        recognition does not work properly).
                                    </p>

                                    {findings.map((finding, index) => {
                                        return (
                                            <textarea
                                                key={index}
                                                value={finding.text}
                                                id={finding.id}
                                                onChange={(ev) =>
                                                    handleTypeFinding(ev)
                                                }
                                            ></textarea>
                                        );
                                    })}

                                    <button onClick={addMoreFinding}>
                                        Add More
                                    </button>
                                    <pre>{JSON.stringify(findings)}</pre>
                                </div>
                            </section>
                        ) : (
                            <div>Wait...</div>
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
