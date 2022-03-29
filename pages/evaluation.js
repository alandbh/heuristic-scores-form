import Head from "next/head";
import styles from "../styles/Home.module.scss";
import getData from "../services/getData";
import { useEffect, useState } from "react";
import PlayerSelect from "../components/Playerselect/Playerselect";
import JourneySelect from "../components/Journeyselect/Journeyselect";
import Header from "../components/Header/Header";
import HeuristicNode from "../components/HeuristicNode/HeuristicNode";

import React from "react";

// import { Container } from './styles';

function evaluation() {
    const [players, setPlayers] = useState([]);
    // const [allPlayers, setAllPlayers] = useState([]);
    const [activePlayer, setActivePlayer] = useState(null);

    const [journeys, setJourneys] = useState([]);
    const [activeJourney, setActiveJourney] = useState(null);

    const [heuristics, setHeuristics] = useState([]);
    const [groups, setGroups] = useState([]);

    // const [hscore, setHeuScore] = useState(null);

    //Fetching all Journeys
    useEffect(async () => {
        setJourneys(await getData("journeys"));
        // setActiveJourney(journeys[0]);
    }, []);

    // Selecting the FIRST JOURNEY
    useEffect(() => {
        console.log("PRIMEIRA", journeys);
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

    function setHeuristicScore(hSlug, hscoreValue, note) {
        if (hSlug && hscoreValue && activePlayer) {
            const updatedActivePlayer = { ...activePlayer };
            updatedActivePlayer.scores[activeJourney.slug][hSlug] = {
                score: hscoreValue,
                note,
            };

            setActivePlayer(updatedActivePlayer);
        }
    }

    // Filtering Players from JOURNEY

    useEffect(async () => {
        const playersIdsFromJourney = activeJourney
            ? activeJourney.players
            : [];

        console.log(
            "mudou journey",
            activeJourney ? activeJourney.players : ""
        );
        const playersFromJourney = await getData(
            "players",
            "slug",
            playersIdsFromJourney.join(",")
        );

        const playersFromJourneyWithScores = playersFromJourney.map(
            (player) => {
                if (objIsEmpty(player.scores)) {
                    player.scores[activeJourney.slug] = {};
                    activeJourney.heuristics.map((heuristic) => {
                        player.scores[activeJourney.slug][heuristic] = {
                            score: 3,
                            note: "nana",
                        };
                    });
                    return player;
                } else {
                    return player;
                }
            }
        );

        setPlayers(playersFromJourneyWithScores);
    }, [activeJourney]);

    // Selecting the FIRST PLAYER
    useEffect(async () => {
        console.log("PRIMEIRO PLAYER", players);
        setActivePlayer(await players[0]);
    }, [players]);

    /**
     *
     * HEURISTICS
     */

    //Fetching all HEURISTICS based on active JOURNEY/PLAYER

    useEffect(async () => {
        const heuristicsList = activeJourney
            ? activeJourney.heuristics.join()
            : "";
        const filteredHeuristics = activeJourney
            ? await getData("heuristics", "slug", heuristicsList)
            : [];
        // setAllHeuristics([]);
        setHeuristics(filteredHeuristics);
        // debugger;
        // console.log(filteredHeuristics);
    }, [activeJourney, activePlayer]);

    useEffect(() => {
        if (heuristics.length > 0) {
            const allGroups = heuristics.map((heuristic) => heuristic.group);
            const uniqueGroups = [...new Set(allGroups)];
            setGroups(uniqueGroups);
            console.log(groups);
        }
    }, [heuristics, activePlayer]);

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
                            />
                        </div>
                    </div>
                    // <div key={heuristic.slug} className="sectionContainer">
                    //     <div className="heuristicWrapper">
                    //         <HeuristicNode
                    //             slug={heuristic.slug}
                    //             currentScore={
                    //                 activePlayer.scores[activeJourney.slug][
                    //                     heuristic.slug
                    //                 ]
                    //             }
                    //             setScore={(slug, score, note) =>
                    //                 setHeuristicScore(slug, score, note)
                    //             }
                    //             // setNote={(note)=>setNoteText()}
                    //             title={heuristic.title}
                    //             description={heuristic.description}
                    //         />
                    //     </div>
                    // </div>
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
                <div>
                    <section>
                        {groups.length > 0
                            ? groups.map((group, index) => (
                                  <div key={index}>
                                      <div className="sectionHeader">
                                          <h1>{`${index + 1}. ${group}`}</h1>
                                          <div className="sectionScore">
                                              <span>25 of 30</span>
                                              <img src="/minichart.png" />
                                          </div>
                                      </div>

                                      {loopHeuristics(group)}
                                  </div>
                              ))
                            : "nnnnnnnnn"}
                    </section>
                </div>

                <pre style={{ maxWidth: 500, whiteSpace: "pre-line" }}>
                    {activePlayer && activePlayer.scores && activeJourney
                        ? JSON.stringify(
                              activePlayer.scores[activeJourney.slug]
                          )
                        : ""}
                </pre>

                <h1 className={styles.title}>
                    {activePlayer ? activePlayer.name : ""}
                </h1>

                <p>{activeJourney ? activeJourney.title : ""}</p>
            </main>
        </div>
    );
}

export default evaluation;
