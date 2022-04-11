import React from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/Header/Header";

// import { Container } from './styles';

function dashboard() {
    return (
        <>
            <Head>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
                />
                <meta
                    name="description"
                    content="description of your project"
                />
                <meta name="theme-color" content="#000" />
                <title>Dashboard - Heuristic Collector</title>
                <link rel="manifest" href="/manifest.json" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-icon.png"></link>
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
