import React from "react";
import styles from "./TotalScores.module.scss";

// import { Container } from './styles';

function TotalScores({ heuristics, activeJourney, activePlayer }) {
    const totalScale =
        heuristics.filter((heuristic) => heuristic.type === "scale").length * 5;
    // debugger;

    let sum = 0;
    if (
        activePlayer.hasOwnProperty("scores") &&
        activeJourney.hasOwnProperty("slug")
    ) {
        const HeuSlugs = heuristics.map((heuristic) => heuristic.slug);
        const playerScores = activePlayer.hasOwnProperty("scores")
            ? activePlayer.scores[activeJourney.slug]
            : {};

        // debugger;
        // const scoresArray = HeuSlugs.map((slug) => playerScores.desktop.score);
        // console.log("ERRO AQUI playerScores", playerScores);
        // console.log("ERRO AQUI HeuSlugs", HeuSlugs);
        const scoresArray =
            playerScores !== undefined && HeuSlugs
                ? HeuSlugs.map((slug) =>
                      playerScores[slug] ? playerScores[slug].score : ""
                  )
                : [0];

        sum = scoresArray.reduce((item, acc) => {
            return Number(item) + Number(acc);
        }, 0);

        // console.log("HeuSlugs", HeuSlugs);
        // console.log("playerScores", playerScores);
        // console.log("scoresArray", scoresArray);
    }
    const radius = 34;
    const circ = 2 * Math.PI * radius;
    const percent = (sum / totalScale) * 100;

    const dashArray = {
        // strokeDashoffset: calc(175.92px - (175.92px * 85 / 100));
        strokeDashoffset: circ - (circ * percent) / 100,
    };
    return (
        <div className={styles.container + " " + "grid gap-9 grid-cols-2"}>
            <div>
                <h2>Total %</h2>
                <div className={styles.percent}>
                    <svg>
                        <circle cx="34" cy="34" r="34"></circle>
                        <circle
                            style={dashArray}
                            cx="34"
                            cy="34"
                            r="34"
                        ></circle>
                    </svg>
                    <h2>
                        {percent.toFixed(2)}
                        <span>%</span>
                    </h2>
                </div>
            </div>
            <div>
                <h2>Total Scored</h2>
                <span className={styles.bigNumber}>{sum} </span>
                <span className={styles.smallNumber}>of {totalScale}pts</span>
            </div>
        </div>
    );
}

export default TotalScores;
