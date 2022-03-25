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
                    className="text-blue-500"
                    disabled={players.length < 1}
                    onClick={handleToggle}
                >
                    <ChevronDown />
                    <span className={"sr-olny"}>Open</span>
                </button>
                <button
                    type="button"
                    class="text-blue-500  focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium text-sm px-5 py-2 text-center inline-flex items-center dark:focus:ring-gray-500  mr-2 mb-2"
                >
                    <ChevronDown />
                    Sign in with Github
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
