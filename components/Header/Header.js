import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import PlayerSelect from "../Playerselect/Playerselect";
import styles from "./Header.module.scss";

// import { Container } from './styles';

function Header({ children, className }) {
    const router = useRouter();

    console.log(children);

    return (
        <header className={styles.headerWrapper}>
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
                <>
                    {children &&
                        children.find(
                            (child) => child.type.name === "JourneySelect"
                        )}
                </>
            </nav>
            <div className={styles.colright}>
                {children &&
                    children.find(
                        (child) => child.type.name === "PlayerSelect"
                    )}
            </div>
        </header>
    );
}

export default Header;
