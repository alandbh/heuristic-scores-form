import React from "react";

import styles from "./Sectionheader.module.scss";

// import { Container } from './styles';

function Sectionheader({ group, activePlayer, index, activeJourney }) {
    const totalScale =
        group.heuristics.filter((heuristic) => heuristic.type === "scale")
            .length * 5;
    // debugger;
    const HeuSlugs = group.heuristics.map((heuristic) => heuristic.slug);
    const playerScores = activePlayer.hasOwnProperty("scores")
        ? activePlayer.scores[activeJourney.slug]
        : {};

    const scoresArray = HeuSlugs.map((slug) => playerScores[slug].score);

    const sum = scoresArray.reduce((item, acc) => {
        return Number(item) + Number(acc);
    }, 0);

    // console.log("HeuSlugs", HeuSlugs);
    // console.log("playerScores", playerScores);
    // console.log("scoresArray", scoresArray);

    return (
        <div className={`grid gap-5 grid-cols-6 ${styles.container}`}>
            <h1
                className={styles.sectionTitle + " " + "col-start-1 col-span-4"}
            >
                <span>{index + 1 + ". "}</span>
                {group.name}
            </h1>
            <div className="col-start-5 col-end-7">
                <b>
                    {sum} of {totalScale}
                </b>
                <span>SVG</span>
            </div>
        </div>
    );
}

export default Sectionheader;
