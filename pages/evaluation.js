import Head from "next/head";
import styles from "../styles/Evaluation.module.scss";
import Image from "next/image";
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
import CommentBox from "../components/CommentBox";
import { urlObjectKeys } from "next/dist/shared/lib/utils";

let count = 0;

setInterval(() => {
    count++;

    if (typeof window !== "undefined") {
        // return;
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

    useEffect(() => {
        console.log("PRIMEIROS FINDINGS", allPlayers[0]);
        // setFindigns([...activePlayer.findings]);

        if (allPlayers && allPlayers.length > 0) {
            allPlayers.map((player) => {
                localStorage.setItem(
                    "finding" + player.slug,
                    JSON.stringify(player.findings)
                );
            });
        }
    }, [allPlayers]);

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

    // useEffect(
    //     debounce(() => {
    //         if (players.length > 0) {
    //             console.log("PRIMEIRO PLAYER", players[0]);
    //             setActivePlayer({});
    //             setActivePlayer(players[0]);
    //         }
    //     }, 500),
    //     [players, activeJourney]
    // );
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
            // setActivePlayer(localActivePlayer);
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

            updatedActivePlayer.findings = localActivePlayer.findings;

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

    const [findings, setFindigns] = useState([]);

    // useEffect(
    //     debounce(() => {
    //         if (
    //             activePlayer !== null &&
    //             activePlayer.hasOwnProperty("findings")
    //         ) {
    //             setFindigns([...activePlayer.findings]);

    //             // setFindigns([...activePlayer.findings]);

    //             // if (activePlayer.findings.length === 0) {
    //             //     setFindigns([
    //             //         { id: "f1", type: "neutral", text: "inicio" },
    //             //     ]);
    //             // } else {
    //             //     setFindigns([...activePlayer.findings]);
    //             // }
    //             // if (activePlayer.findings.length > 0) {
    //             //     console.log("SETANDO FIND", activePlayer.findings);
    //             //     setFindigns([...activePlayer.findings]);
    //             // } else {
    //             //     console.log("FIND ATUAL", findings);

    //             //     setFindigns([{ id: "f1", type: "neutral", text: "" }]);
    //             // }
    //         }
    //     }, 500),
    //     []
    // );

    // useEffect(
    //     debounce(() => {
    //         debugger;
    //         if (
    //             activePlayer.hasOwnProperty("findings") &&
    //             localActivePlayer.hasOwnProperty("findings")
    //         ) {
    //             if (activePlayer.findings[0].text === "n/a") {
    //                 setFindigns([...activePlayer.findings]);
    //             } else {
    //                 setFindigns([...localActivePlayer.findings]);
    //             }
    //         }
    //     }, 500),
    //     [activePlayer]
    // );

    const memoAddMoreFinding = debounce(() => {
        let current = JSON.parse(
            localStorage.getItem("finding" + activePlayer.slug)
        );

        console.log(current);
        current.push({
            id: activePlayer.slug + "f" + (Number(current.length) + 1),
            type: "neutral",
            text: "f" + (Number(current.length) + 1),
        });
        addMoreFinding(current);
    }, 500);

    /**
     *
     * ADDING MORE COMMENT
     *
     *
     * @param {*} current
     */

    function addMoreFinding(current) {
        localStorage.setItem(
            "finding" + activePlayer.slug,
            JSON.stringify(current)
        );
        // setFindigns(currentFindings);
        // setLocalActivePlayer(current);

        setPlayerHasChanged(true);
        debSetScore({ ...activePlayer, findings: current });

        // // let currentPlayers = [...players];
        // if (allPlayers && allPlayers.length > 0) {
        //     let _players = [...allPlayers];

        //     _players[_players.findIndex((item) => item.slug === current.slug)] =
        //         current;
        //     // let currentPlayer = _players.find(
        //     //     (player) => player.slug === current.slug
        //     // );
        //     setAllPlayers(_players);
        //     console.log("currentPlayers", _players);
        // }
    }

    function getFindingsNodes(currentPlayer) {
        if (
            currentPlayer &&
            currentPlayer.hasOwnProperty("slug") &&
            currentPlayer !== null
        ) {
            console.log(
                "LOCAL",
                localStorage.getItem("finding" + currentPlayer.slug)
            );

            // return;
            let current;

            if (localStorage.getItem("finding" + currentPlayer.slug)) {
                current = JSON.parse(
                    localStorage.getItem("finding" + currentPlayer.slug)
                );
            }

            return current;
        }
    }

    function handleTextFinding(ev, currentPlayer) {
        let currentFindings = JSON.parse(
            localStorage.getItem("finding" + currentPlayer.slug)
        );

        currentFindings[
            currentFindings.findIndex((el) => el.id === ev.target.id)
        ].text = ev.target.value;

        console.log(currentFindings);

        localStorage.setItem(
            "finding" + currentPlayer.slug,
            JSON.stringify(currentFindings)
        );

        setActivePlayer({ ...currentPlayer, findings: currentFindings });
        setLocalActivePlayer({ ...currentPlayer, findings: currentFindings });
        return;

        // let currentFindings = [...currentPlayer.findings];

        let thisFinding = currentFindings.find((fi) => fi.id === ev.target.id);
        console.log(ev.target);

        // return;

        console.log(thisFinding);
        // debugger;
        thisFinding.text = ev.target.value;

        localStorage.setItem(
            "finding" + currentPlayer.slug,
            JSON.stringify(current)
        );

        setFindigns([...currentPlayer.findings, thisFinding]);
        // setcurrentPlayer({
        //     ...currentPlayer,
        //     findings: currentFindings,
        // });
        // setPlayerHasChanged(true);

        localStorage.setItem("localActivePlayer", "");
        setLocalActivePlayer({
            ...currentPlayer,
            findings: currentFindings,
        });
        localStorage.setItem(
            "localActivePlayer",
            JSON.stringify(currentPlayer)
        );

        // setLocalActivePlayer({
        //     ...localActivePlayer,
        //     findings: currentFindings,
        // });

        // // debSave(updatedActivePlayer);
        // setPlayerHasChanged(false);
        debSetScore({
            ...currentPlayer,
            findings: currentFindings,
        });

        // setActivePlayer({ ...activePlayer, findings: currentFindings });

        // let currentPlayers = [...players];
        // currentPlayers.find(
        //     (player) => player.slug === localActivePlayer.slug
        // ).findings = currentFindings;
        // setPlayers(currentPlayers);
    }

    function handleTypeFinding(id, value, currentPlayer) {
        let currentFindings = JSON.parse(
            localStorage.getItem("finding" + currentPlayer.slug)
        );

        currentFindings[currentFindings.findIndex((el) => el.id === id)].type =
            value;

        console.log(currentFindings);

        localStorage.setItem(
            "finding" + currentPlayer.slug,
            JSON.stringify(currentFindings)
        );

        setActivePlayer({ ...currentPlayer, findings: currentFindings });
        setLocalActivePlayer({ ...currentPlayer, findings: currentFindings });
        return;

        // let currentFindings = [...activePlayer.findings];
        currentFindings.find((fi) => fi.id === id).type = value;

        setFindigns(currentFindings);
        setLocalActivePlayer({
            ...localActivePlayer,
            findings: currentFindings,
        });
        // setActivePlayer({
        //     ...activePlayer,
        //     findings: currentFindings,
        // });
        // setPlayerHasChanged(true);

        localStorage.setItem(
            "localActivePlayer",
            JSON.stringify(localActivePlayer)
        );

        setLocalActivePlayer({
            ...localActivePlayer,
            findings: currentFindings,
        });

        // debSave(updatedActivePlayer);
        debSetScore({
            ...localActivePlayer,
            findings: currentFindings,
        });

        // setActivePlayer({ ...activePlayer, findings: currentFindings });

        // let currentPlayers = [...players];
        // currentPlayers.find(
        //     (player) => player.slug === localActivePlayer.slug
        // ).findings = currentFindings;
        // setPlayers(currentPlayers);
        // setPlayerHasChanged(false);
    }

    useEffect(() => {
        if (
            activePlayer &&
            activePlayer !== null &&
            activePlayer.hasOwnProperty("findings")
        ) {
            let currentFindings = JSON.parse(
                localStorage.getItem("finding" + activePlayer.slug)
            );

            if (currentFindings.length > 0) {
                setPlayerHasChanged(true);
                setLocalActivePlayer({
                    ...activePlayer,
                    findings: currentFindings,
                });
                // debSetScore({ ...activePlayer, findings: currentFindings });
                // setActivePlayer({ ...activePlayer, findings: currentFindings });
            }
        }
    }, [activePlayer]);

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

                        {activePlayer &&
                        activePlayer !== null &&
                        activePlayer.hasOwnProperty("findings") ? (
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

                                    {getFindingsNodes(activePlayer) &&
                                    getFindingsNodes(activePlayer).length >
                                        0 ? (
                                        getFindingsNodes(activePlayer).map(
                                            (finding, index) => {
                                                return (
                                                    <>
                                                        <CommentBox
                                                            index={index}
                                                            finding={finding}
                                                            activePlayer={
                                                                activePlayer
                                                            }
                                                            handleTextFinding={
                                                                handleTextFinding
                                                            }
                                                            handleTypeFinding={
                                                                handleTypeFinding
                                                            }
                                                        ></CommentBox>
                                                    </>
                                                );
                                            }
                                        )
                                    ) : (
                                        <b>Wait...</b>
                                    )}

                                    <button
                                        className={styles.btnAddNote}
                                        onClick={memoAddMoreFinding}
                                    >
                                        <Image
                                            src="/icon-addnote.svg"
                                            width="20"
                                            height="22"
                                        />
                                        <b>Add One More Finding</b>
                                    </button>
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
