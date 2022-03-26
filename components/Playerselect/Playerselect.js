import React, { useRef } from "react";
import { ChevronDown } from "react-feather";

import styles from "./Playerselect.module.scss";
import { useDetectOutsideClick } from "../../services/useDetectOutsideClick";

function PlayerSelect({ activePlayer, setActivePlayer, players }) {
    // const [listOpen, setListOpen] = useState(false);

    const dropdownRef = useRef(null);
    const [listOpen, setListOpen] = useDetectOutsideClick(dropdownRef, false);

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
                <label>Select a journey:</label>

                <div className={styles.imageWrapper}>
                    <figure>
                        <img
                            src={`/logos/player-${
                                activePlayer
                                    ? activePlayer.id + ".png"
                                    : "loading.gif"
                            }`}
                            alt={activePlayer ? activePlayer.name : ""}
                            role="button"
                            onClick={handleToggle}
                        />
                    </figure>

                    <button
                        className={`text-blue-500 ${styles.toggle} ${
                            players.length < 1 ? "invisible" : ""
                        }`}
                        disabled={players.length < 1}
                        onClick={handleToggle}
                    >
                        <ChevronDown />
                        <div className={styles.srolny}>Open</div>
                    </button>
                </div>
            </div>

            <ul
                ref={dropdownRef}
                className={listOpen ? styles.listopen : styles.listclosed}
            >
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
