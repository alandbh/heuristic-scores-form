import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useScroll } from "../../pages/api/utils";
import JourneySelect from "../Journeyselect/Journeyselect";
import PlayerSelect from "../Playerselect/Playerselect";
import styles from "./Header.module.scss";

// import { Container } from './styles';

function Header({
    children,
    className,
    activeJourney,
    journeys,
    setActiveJourney,
    setJourneyHasChanged,
    activePlayer,
    players,
    setActivePlayer,
    setPlayerHasChanged,
}) {
    const router = useRouter();

    const [scrollY, setScrollY] = useScroll(0);

    // const [headerClass, setHeaderClass] = useState(styles.headerWrapper);

    const headerClasses = {
        normal: styles.headerWrapper,
        hidden: styles.headerWrapper + " " + styles.headerHidden,
        fixed:
            styles.headerWrapper +
            " " +
            styles.headerHidden +
            " " +
            styles.fixed,
    };

    let classNames = headerClasses.normal;

    if (scrollY > 107) {
        classNames = headerClasses.hidden;
    }

    if (scrollY > 300) {
        classNames = headerClasses.fixed;
        // console.log("maior");
    }

    return (
        <header id="mainheader" className={classNames}>
            <div className={styles.logo}>
                <Link href="/">
                    <a>
                        <Image
                            src="/logo.svg"
                            alt="Collector Logo"
                            width={126}
                            height={44}
                        />
                    </a>
                </Link>
            </div>
            <nav>
                <Link href="/evaluation">
                    <a
                        className={
                            router.pathname == "/evaluation"
                                ? styles.active
                                : ""
                        }
                    >
                        Evaluation
                    </a>
                </Link>
                <Link href="/dashboard">
                    <a
                        className={
                            router.pathname == "/dashboard" ? styles.active : ""
                        }
                    >
                        Dashboard
                    </a>
                </Link>
            </nav>
            <div className={styles.colright}>
                {journeys && (
                    <JourneySelect
                        activeJourney={activeJourney}
                        journeys={journeys}
                        setActiveJourney={setActiveJourney}
                        setJourneyHasChanged={setJourneyHasChanged}
                    ></JourneySelect>
                )}

                {players && (
                    <PlayerSelect
                        activePlayer={activePlayer}
                        players={players}
                        setActivePlayer={setActivePlayer}
                        setPlayerHasChanged={setPlayerHasChanged}
                    ></PlayerSelect>
                )}
            </div>
            <div className={styles.user}>
                <UserButton />
            </div>
        </header>
    );
}

export default Header;
