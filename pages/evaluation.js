import Head from "next/head";
import styles from "../styles/Evaluation.module.scss";
import Image from "next/image";
import getData from "../services/getData";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
    useLocalStorage,
    updadePlayer,
    orderBy,
    getPlayersFromJourney,
    getHeuristicsFromJourney,
    useDidUpdate,
    storage,
} from "./api/utils";
import PlayerSelect from "../components/Playerselect/Playerselect";
import JourneySelect from "../components/Journeyselect/Journeyselect";
import Header from "../components/Header/Header";
import HeuristicNode from "../components/HeuristicNode/HeuristicNode";
import { Link as Scroll } from "react-scroll";

import React from "react";
import debounce from "lodash.debounce";
import GroupSectionheader from "../components/GroupSectionheader";
import Sectionheader from "../components/Sectionheader";
import CommentBox from "../components/CommentBox";
import TotalScores from "../components/TotalScores";
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

function objIsEmpty(obj) {
    return obj.constructor === Object && Object.keys(obj).length === 0;
}

/**
 *
 * ---------------------------------------------
 * THIS IS THE BEGINNING OF THE COMPONENT
 * ---------------------------------------------
 *
 * @returns EVALUATION COMPONENT
 */

function evaluation() {
    /**
     *
     * SETTING THE INICIAL STATES
     *
     */
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

    const [localActivePlayer, setLocalActivePlayer] = useLocalStorage(
        "localActivePlayer",
        null
    );

    const [scrollY, setScrollY] = useState(0);

    function logit() {
        if (typeof window !== "undefined") {
            setScrollY(window.pageYOffset);
        }
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            function watchScroll() {
                window.addEventListener("scroll", logit);
            }
            watchScroll();
            // Remove listener (like componentWillUnmount)
            return () => {
                window.removeEventListener("scroll", logit);
            };
        }
    }, []);

    // const [isFirstLoad, setisFirstLoad] = useLocalStorage("isFirstLoad", true);

    /**
     *
     * ----------------------------------
     * Fetching All Data From Database
     * ----------------------------------
     */
    useEffect(() => {
        // All Journeys

        // debugger;

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

        // localStorage.setItem("isFirstLoad", "true");
        storage.set("isFirstLoad", "true");
    }, []);

    /**
     *
     *
     * Setting All Findings In LocalStorage
     *
     *  */
    useEffect(() => {
        if (allPlayers && allPlayers.length > 0) {
            allPlayers.map((player) => {
                // localStorage.setItem(
                //     "finding" + player.slug,
                //     JSON.stringify(player.findings)
                // );

                storage.set("finding" + player.slug, player.findings);
            });
        }
    }, [allPlayers]);

    /**
     *
     * Selecting the FIRST JOURNEY as ActiveJourney
     *
     */

    useEffect(
        debounce(() => {
            if (journeys.length > 0 && activeJourney === null) {
                setActiveJourney(journeys[0]);
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

                console.log("mudou journey");

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
        // console.log("mudou journey");
        if (
            activeJourney !== null &&
            activeJourney !== undefined &&
            allPlayers.length > 0
        ) {
            // console.log("mudou journey - Setting Players");
            const playersFromJourney = getPlayersFromJourney(
                activeJourney,
                allPlayers
            );
            // debugger;
            setPlayers(playersFromJourney);
            setActivePlayer(playersFromJourney[0]);
            // setLocalActivePlayer(playersFromJourney[0]);
            setPlayerHasChanged(true);

            // localStorage.setItem(
            //     "localActivePlayer",
            //     JSON.stringify(playersFromJourney[0])
            // );
        }
        // loadedData.players = true;
    }, [activeJourney]);

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
        // console.log("MEMO FORA AQUI", count++);
        setHeuristicScore(hSlug, values);
    }, 500);

    if (count > 0) {
        // memoSetHeuristicScore.cancel();
    }

    // const debSetScore = (localPlayer) => {
    //     // console.log("MEMO AQUI SALVANDO", localPlayer, debCount++);
    //     let _localPlayer = { ...localPlayer };
    //     delete _localPlayer._id;
    //     // updadePlayer(_localPlayer);
    //     // setActivePlayer(_localPlayer);
    //     if (playerHasChanged) {
    //         // debugger;
    //         setActivePlayer(_localPlayer);
    //         // setActivePlayer(localActivePlayer);
    //     }

    //     // cancelDebounce();
    // };

    const debSetScore = debounce((localPlayer) => {
        let _localPlayer = { ...localPlayer };
        // delete _localPlayer._id;
        // updadePlayer(_localPlayer);
        // setActivePlayer(_localPlayer);
        if (playerHasChanged) {
            // debugger;
            setActivePlayer(_localPlayer);
            // setActivePlayer(localActivePlayer);
        }
    }, 600);

    function setHeuristicScore(hSlug, values) {
        // console.log("SETANDO SCORE", hSlug, values);
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

            // localStorage.setItem("localActivePlayer", "");
            // localStorage.setItem(
            //     "localActivePlayer",
            //     JSON.stringify({ ...updatedActivePlayer })
            // );

            // localActivePlayer = { ...updatedActivePlayer };

            // setLocalActivePlayer({ ...updatedActivePlayer });

            // debSave(updatedActivePlayer);
            debSetScore(updatedActivePlayer);

            // loadedData.activePlayer = true;
            // setLoadedData((loadedData.activePlayer = true));
        }
    }

    /**
     *
     * SAVING TO DATABASE
     */

    useDidUpdate(() => {
        if (
            playerHasChanged &&
            // localStorage.getItem("isFirstLoad") === "false"
            storage.get("isFirstLoad") === "false"
        ) {
            console.log("SALVANDO", localActivePlayer);

            let _allPlayers = [...allPlayers];
            let _players = [...players];

            _allPlayers[
                _allPlayers.findIndex(
                    (player) => player._id === localActivePlayer._id
                )
            ] = localActivePlayer;
            _players[
                _players.findIndex(
                    (player) => player._id === localActivePlayer._id
                )
            ] = localActivePlayer;

            setAllPlayers(_allPlayers);
            setPlayers(_players);

            let _localActivePlayer = { ...localActivePlayer };
            delete _localActivePlayer._id;

            // updadePlayer(_localActivePlayer);
            // const debSave = debounce(() => {}, 1);

            // debSave();
        }
    }, [localActivePlayer]);

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
            // return false;
            return true;
        } else {
            return false;
        }
    }

    const [playerHasChanged, setPlayerHasChanged] = useState(false);
    const [journeyHasChanged, setJourneyHasChanged] = useState(false);

    const [findings, setFindigns] = useState([]);

    const memoAddMoreFinding = () => {
        // let current = JSON.parse(
        //     localStorage.getItem("finding" + activePlayer.slug)
        // );
        let current = storage.get("finding" + activePlayer.slug);
        // console.log(current);
        current.push({
            id: activePlayer.slug + "f" + (Number(current.length) + 1),
            type: "neutral",
            text: "f" + (Number(current.length) + 1),
        });
        addMoreFinding(current);
    };

    /**
     *
     * ADDING MORE COMMENT
     *
     *
     * @param {*} current
     */

    function addMoreFinding(current) {
        // localStorage.setItem(
        //     "finding" + activePlayer.slug,
        //     JSON.stringify(current)
        // );

        storage.set("finding" + activePlayer.slug, current);
        // setFindigns(currentFindings);
        // setLocalActivePlayer(current);

        setPlayerHasChanged(true);
        // debSetFinding({ ...activePlayer, findings: current });
        setActivePlayer({ ...activePlayer, findings: current });
        setLocalActivePlayer({ ...activePlayer, findings: current });
    }

    function getFindingsNodes(currentPlayer) {
        if (
            currentPlayer &&
            currentPlayer.hasOwnProperty("slug") &&
            currentPlayer !== null
        ) {
            // return;
            let current;

            // if (localStorage.getItem("finding" + currentPlayer.slug)) {
            //     current = JSON.parse(
            //         localStorage.getItem("finding" + currentPlayer.slug)
            //     );
            // }
            if (storage.get("finding" + currentPlayer.slug)) {
                current = storage.get("finding" + currentPlayer.slug);
            }

            return current;
        }
    }

    // const changeValues = useCallback(() => {}, [values]);

    // useEffect(() => {
    //     if (hasChanged) {
    //         setScore(slug, { ...values });
    //         setHasChanged(false);
    //     }
    // }, [changeValues]);

    function handleTextFinding(ev, currentPlayer) {
        // let currentFindings = JSON.parse(
        //     localStorage.getItem("finding" + currentPlayer.slug)
        // );
        let currentFindings = storage.get("finding" + currentPlayer.slug);
        currentFindings[
            currentFindings.findIndex((el) => el.id === ev.target.id)
        ].text = ev.target.value;

        // console.log(currentFindings);

        // localStorage.setItem(
        //     "finding" + currentPlayer.slug,
        //     JSON.stringify(currentFindings)
        // );

        storage.set("finding" + currentPlayer.slug, currentFindings);

        debSetFinding({ ...currentPlayer, findings: currentFindings });
    }

    const debSetFinding = debounce((player) => {
        setActivePlayer(player);
        setLocalActivePlayer(player);
    }, 1000);

    function handleTypeFinding(id, value, currentPlayer) {
        // let currentFindings = JSON.parse(
        //     localStorage.getItem("finding" + currentPlayer.slug)
        // );
        let currentFindings = storage.get("finding" + currentPlayer.slug);
        currentFindings[currentFindings.findIndex((el) => el.id === id)].type =
            value;

        // console.log(currentFindings);

        // localStorage.setItem(
        //     "finding" + currentPlayer.slug,
        //     JSON.stringify(currentFindings)
        // );

        storage.set("finding" + currentPlayer.slug, currentFindings);

        setActivePlayer({ ...currentPlayer, findings: currentFindings });
        setLocalActivePlayer({ ...currentPlayer, findings: currentFindings });
        return;
    }

    useEffect(() => {
        if (
            activePlayer &&
            activePlayer !== null &&
            activePlayer.hasOwnProperty("findings")
        ) {
            // let currentFindings = JSON.parse(
            //     localStorage.getItem("finding" + activePlayer.slug)
            // );
            let currentFindings = storage.get("finding" + activePlayer.slug);
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
            <>
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
                    <Header
                        activeJourney={activeJourney}
                        journeys={journeys}
                        setActiveJourney={setActiveJourney}
                        setJourneyHasChanged={setJourneyHasChanged}
                        activePlayer={activePlayer}
                        players={players}
                        setActivePlayer={setActivePlayer}
                        setPlayerHasChanged={setPlayerHasChanged}
                    ></Header>
                ) : (
                    <div>Espera</div>
                )}
                <main className="grid gap-9 md:grid-cols-12 grid-cols-1">
                    <div className="col-start-3 col-span-6">
                        {activePlayer !== null ? (
                            groups[activeJourney.slug].map((group, index) => {
                                return (
                                    <section
                                        className={styles.sectionContainer}
                                        key={index}
                                        id={`group_${index + 1}`}
                                    >
                                        <GroupSectionheader
                                            index={index}
                                            group={group}
                                            activePlayer={activePlayer}
                                            activeJourney={activeJourney}
                                        ></GroupSectionheader>

                                        <div className={styles.sectionContent}>
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
                                );
                            })
                        ) : (
                            <div>Carregando</div>
                        )}

                        {activePlayer &&
                        activePlayer !== null &&
                        activePlayer.hasOwnProperty("findings") ? (
                            <section
                                id="generalfindings"
                                className={styles.findingsContainer}
                            >
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
                                                    <CommentBox
                                                        key={finding.id}
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
                    <div
                        className="col-start-9 col-end-12"
                        style={{ position: "relative" }}
                    >
                        <aside
                            className={
                                scrollY > 250
                                    ? styles.sideNavigation + " " + styles.fixed
                                    : styles.sideNavigation
                            }
                        >
                            <h1>Categories</h1>
                            <nav>
                                <ul>
                                    {activePlayer !== null ? (
                                        groups[activeJourney.slug].map(
                                            (group, index) => {
                                                return (
                                                    <li key={`group_${index}`}>
                                                        <Scroll
                                                            activeClass={
                                                                styles.sidenavActive
                                                            }
                                                            to={`group_${
                                                                index + 1
                                                            }`}
                                                            spy={true}
                                                            smooth={true}
                                                            offset={-50}
                                                        >
                                                            {`${index + 1}. ${
                                                                group.name
                                                            }`}
                                                        </Scroll>
                                                    </li>
                                                );
                                            }
                                        )
                                    ) : (
                                        <div>wait</div>
                                    )}
                                </ul>
                                <hr></hr>
                                <Scroll to="generalfindings" smooth={true}>
                                    General Findings
                                </Scroll>
                            </nav>
                            <h1 style={{ marginTop: "1rem" }}>Total Scores</h1>
                            <TotalScores
                                activePlayer={activePlayer}
                                activeJourney={activeJourney}
                                heuristics={heuristics}
                            ></TotalScores>
                            <pre className="invisible">
                                {JSON.stringify(localActivePlayer)}
                            </pre>
                            <Scroll to="mainheader" smooth={true}>
                                Scroll To Top
                            </Scroll>
                        </aside>
                    </div>
                </main>
            </>
        )
    );
}

export default evaluation;
