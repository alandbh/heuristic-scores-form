import React, { useRef } from "react";
import { ChevronDown } from "react-feather";
import { useDetectOutsideClick } from "../../services/useDetectOutsideClick";
import Wave from "../Wave/Wave";

import styles from "./Journeyselect.module.scss";

function JourneySelect({ activeJourney, setActiveJourney, journeys }) {
    // const [listOpen, setListOpen] = useState(false);

    const dropdownRef = useRef(null);
    const [listOpen, setListOpen] = useDetectOutsideClick(dropdownRef, false);

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
                {journeys.length > 0 ? (
                    <>
                        <label htmlFor="selectJourney">Select a journey:</label>
                        <button
                            id="selectJourney"
                            className={`text-blue-500 ${styles.toggle} ${
                                journeys.length < 1 ? "invisible" : ""
                            }`}
                            disabled={journeys.length < 1}
                            onClick={handleToggle}
                        >
                            <span>
                                {activeJourney ? activeJourney.title : ""}
                            </span>
                            <span>
                                <ChevronDown />
                            </span>
                        </button>
                    </>
                ) : (
                    <Wave
                        ammount="7"
                        height="40px"
                        width="110px"
                        color="#b7ccec"
                        style={{ marginTop: 10 }}
                    />
                )}
            </div>

            <ul
                ref={dropdownRef}
                className={listOpen ? styles.listopen : styles.listclosed}
            >
                {journeys.length > 0 ? (
                    journeys.map((journey) => (
                        <li
                            onClick={() => handleSelectJourney(journey)}
                            key={journey.title}
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
