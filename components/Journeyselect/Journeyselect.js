import React, { useState } from "react";
import { ChevronDown } from "react-feather";

import styles from "./Journeyselect.module.scss";

function JourneySelect({ activeJourney, setActiveJourney, journeys }) {
    const [listOpen, setListOpen] = useState(false);

    function handleToggle() {
        setListOpen(!listOpen);
    }

    function handleSelectJourney(player) {
        setActiveJourney(player);
        handleToggle();
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <span>{activeJourney ? activeJourney.title : ""}</span>

                <button
                    className={`text-blue-500 ${styles.toggle} ${
                        journeys.length < 1 ? "invisible" : ""
                    }`}
                    disabled={journeys.length < 1}
                    onClick={handleToggle}
                >
                    <ChevronDown />
                    <div className={styles.srolny}>Open</div>
                </button>
            </div>

            <ul className={listOpen ? styles.listopen : styles.listclosed}>
                {journeys.length > 0 ? (
                    journeys.map((journey) => (
                        <li
                            onClick={() => handleSelectJourney(journey)}
                            key={journey.id}
                        >
                            <button>{journey.title}</button>
                        </li>
                    ))
                ) : (
                    <li>"Loading"</li>
                )}
            </ul>
        </div>
    );
}

export default JourneySelect;
