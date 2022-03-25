import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import getData from "../services/getData";
import { useEffect, useState } from "react";
import PlayerSelect from "../components/Playerselect/Playerselect";
import Header from "../components/Header/Header";

function evaluation() {
    const [players, setPlayers] = useState([]);
    const [activePlayer, setActivePlayer] = useState(null);

    useEffect(async () => {
        setPlayers(await getData());
        // setActivePlayer(players[0]);
    }, []);

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
                <Link href="/dashboard">Dashboard</Link> <br />
                <Link href="/">Home</Link>
            </main>
        </div>
    );
}

export default evaluation;
