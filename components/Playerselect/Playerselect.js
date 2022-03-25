import React, { useState } from "react";
import { ChevronDown } from "react-feather";

import styles from "./Playerselect.module.scss";

function PlayerSelect({ activePlayer, setActivePlayer, players }) {
    const [listOpen, setListOpen] = useState(false);

    function handleToggle() {
        setListOpen(!listOpen);
    }

    function handleSelectPlayer(player) {
        setActivePlayer(player);
        handleToggle();
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <figure>
                    <img
                        src={`/logos/player-${
                            activePlayer ? activePlayer.id : 1
                        }.png`}
                        alt={activePlayer ? activePlayer.name : ""}
                    />
                </figure>

                <button
                    className={`text-blue-500 ${styles.toggle}`}
                    disabled={players.length < 1}
                    onClick={handleToggle}
                >
                    <ChevronDown />
                    <div className={styles.srolny}>Open</div>
                </button>
            </div>

            <ul className={listOpen ? styles.listopen : styles.listclosed}>
                {players.length > 0 ? (
                    players.map((player) => (
                        <li
                            onClick={() => handleSelectPlayer(player)}
                            key={player.id}
                        >
                            <button>{player.name}</button>
                        </li>
                    ))
                ) : (
                    <li>"Loading"</li>
                )}
            </ul>
        </div>
    );
}

export default PlayerSelect;
