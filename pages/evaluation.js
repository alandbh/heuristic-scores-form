import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import getData from "../services/getData";
import { useEffect, useState } from "react";
import PlayerSelect from "../components/Playerselect/Playerselect";
import JourneySelect from "../components/Journeyselect/Journeyselect";
import Header from "../components/Header/Header";

import React from "react";

// import { Container } from './styles';

function evaluation() {
    const [players, setPlayers] = useState([]);
    const [activePlayer, setActivePlayer] = useState(null);

    const [journeys, setJourneys] = useState([]);
    const [activeJourney, setActiveJourney] = useState(null);

    useEffect(async () => {
        setPlayers(await getData("players", "name"));
        // setActivePlayer(players[0]);

        setJourneys(await getData("journeys"));

        console.log(journeys);
    }, []);

    useEffect(() => {
        setActiveJourney(journeys[0]);
    }, [journeys]);

    useEffect(async () => {
        const first = await players.filter((player) => {
            return player.id === 1;
        });

        setActivePlayer(first[0]);
        // console.log(first[0]);
        // console.log(await activePlayer);
    }, [players]);

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
            </main>
        </div>
    );
}

export default evaluation;
