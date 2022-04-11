import React from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header/Header";

// import { Container } from './styles';

function dashboard() {
    return (
        <>
            <Head>
                <title>Dashboard - Heuristics Collector</title>
                <meta name="description" content="Heuristics collector" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Header className="active"></Header>

            <main className="grid gap-9 md:grid-cols-12 grid-cols-1">
                <div className="col-start-3 col-span-6">
                    <div className="wrapper">
                        <h1>Dashboard (coming soon)</h1>
                        <Link href="/evaluation">Evaluation</Link> <br />
                        <Link href="/">Home</Link>
                    </div>
                </div>
            </main>
        </>
    );
}

export default dashboard;
