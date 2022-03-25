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

            <main>
                <div className="wrapper">
                    <h1>Dashboard</h1>
                    <Link href="/evaluation">Evaluation</Link> <br />
                    <Link href="/">Home</Link>
                </div>
            </main>
        </>
    );
}

export default dashboard;
