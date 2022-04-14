import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import { arr_players, arr_heuristicas, arr_jornadas } from "./api/us-data";

// window.arr_heuristicas = arr_heuristicas;
// window.arr_jornadas = arr_jornadas;
// window.arr_players = arr_players;

const player = {
    nome: "Arezzo",
    player_id: 2,
    departamento: "fashion",
    scores: {
        "h1.1": 0,
        "h1.2": 0,
        "h1.3": 0,
        "h1.4": 0,
        "h1.5": 0,
    },
};
const playerChange = {
    nome: "Arezzo",
    player_id: 2,
    departamento: "fashion",
    scores: {
        "h1.1": 5,
        "h1.2": 5,
        "h1.3": 5,
        "h1.4": 5,
        "h1.5": 5,
    },
};

async function addPlayerHandler() {
    arr_players.forEach(async (player) => {
        const response = await fetch("http://localhost:3000/api/addPlayers", {
            method: "POST",
            body: JSON.stringify(player),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    });
}

async function addJourneyHandler() {
    arr_jornadas.forEach(async (journey) => {
        const response = await fetch("http://localhost:3000/api/addJourneys", {
            method: "POST",
            body: JSON.stringify(journey),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    });
}

async function addHeuristicsHandler() {
    arr_heuristicas.forEach(async (heuristic) => {
        const response = await fetch("/api/addHeuristics", {
            method: "POST",
            body: JSON.stringify(heuristic),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data);
    });
}

async function handlerChange(query) {
    const response = await fetch(`/api/changedata?player=${encodeURI(query)}`, {
        method: "POST",
        body: JSON.stringify(playerChange),
        headers: {
            "Content-Type": "application/json",
        },
    });

    //?player=Casas%20Bahia
}

async function handlerAddOne(playerSlug) {
    arr_players.map(async (player) => {
        if (player.slug === playerSlug) {
            const response = await fetch(
                "http://localhost:3000/api/addPlayers",
                {
                    method: "POST",
                    body: JSON.stringify(player),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const data = await response.json();
            console.log(data);
        }
    });
}

function seed() {
    arr_jornadas.map((jornada) => {
        arr_players.map((player) => {
            player.scores[jornada.slug] = {};

            if (player.findings.length === 0) {
                player.findings.push({
                    id: player.slug + "f1",
                    type: "neutral",
                    text: "n/a",
                });
            }

            jornada.heuristics.map((heuristic) => {
                player.scores[jornada.slug][heuristic] = {
                    score: 0,
                    note: "n/a",
                };
            });
        });
    });

    console.log("NEW PLAYERS", arr_players);
}

export default function Home() {
    return (
        <div className={styles.container}>
            <div>
                <div>
                    <button
                        className="bg-indigo-500 p-2 px-4 rounded text-white font-bold my-6"
                        onClick={() => seed()}
                    >
                        Seed
                    </button>
                </div>
                <button
                    className="bg-indigo-500 p-2 px-4 rounded text-white  font-bold my-6"
                    onClick={addPlayerHandler}
                >
                    Add Players
                </button>
            </div>

            <div>
                <button
                    className="bg-indigo-500 p-2 px-4 rounded text-white font-bold my-6"
                    onClick={() => addJourneyHandler()}
                >
                    Add Journeys
                </button>
            </div>
            <div>
                <button
                    className="bg-indigo-500 p-2 px-4 rounded text-white font-bold my-6"
                    onClick={() => addHeuristicsHandler()}
                >
                    Add Heuristics
                </button>
            </div>

            <div>
                <button
                    className="bg-blue-500 p-2 px-4 rounded text-white font-bold  my-6"
                    onClick={() => handlerChange("Arezzo")}
                >
                    Mudar
                </button>
            </div>

            <div>
                <button
                    className="bg-blue-500 p-2 px-4 rounded text-white font-bold  my-6"
                    onClick={() => handlerAddOne("tommy")}
                >
                    Adicionar apenas um
                </button>
            </div>

            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className="text-3xl font-bold underline">Hello world!</h1>
                <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>

                <form></form>

                <p className={styles.description}>
                    Get started by editing{" "}
                    <code className={styles.code}>pages/index.js</code>
                </p>

                <div className={styles.grid}>
                    <a href="https://nextjs.org/docs" className={styles.card}>
                        <h2>Documentation &rarr;</h2>
                        <p>
                            Find in-depth information about Next.js features and
                            API.
                        </p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h2>Learn &rarr;</h2>
                        <p>
                            Learn about Next.js in an interactive course with
                            quizzes!
                        </p>
                    </a>

                    <a
                        href="https://github.com/vercel/next.js/tree/canary/examples"
                        className={styles.card}
                    >
                        <h2>Examples &rarr;</h2>
                        <p>
                            Discover and deploy boilerplate example Next.js
                            projects.
                        </p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>
                            Instantly deploy your Next.js site to a public URL
                            with Vercel.
                        </p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{" "}
                    <span className={styles.logo}>
                        <Image
                            src="/vercel.svg"
                            alt="Vercel Logo"
                            width={72}
                            height={16}
                        />
                    </span>
                </a>
            </footer>
        </div>
    );
}
