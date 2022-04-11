import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import { arr_players, arr_heuristicas, arr_jornadas } from "./api/us-data";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className="text-3xl font-bold">RGA's</h1>
                <h1 className={styles.title}>Heuristics Collector</h1>

                <form></form>

                <div className={styles.grid}>
                    <a href="/evaluation" className={styles.card}>
                        <h2>Evaluation &rarr;</h2>
                        <p>
                            All evaluation journeys starts here. Select a
                            journey and a player and set the scores.
                        </p>
                    </a>

                    <a href="/dashboard" className={styles.card}>
                        <h2>Dashboard &rarr;</h2>
                        <p>
                            Have a plainview of all scores, charts and more.
                            (coming soon)
                        </p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://rga.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className={styles.logo}>
                        <Image
                            src="/logo.svg"
                            alt="Heuristic Collector Logo"
                            width={100}
                            height={35}
                        />
                    </span>
                </a>
            </footer>
        </div>
    );
}
