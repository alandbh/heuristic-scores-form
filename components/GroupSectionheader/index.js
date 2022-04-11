import React from "react";

import styles from "./GroupSectionheader.module.scss";

// import { Container } from './styles';

function GroupSectionheader({ group, activePlayer, index, activeJourney }) {
    const totalScale =
        group.heuristics.filter((heuristic) => heuristic.type === "scale")
            .length * 5;
    // debugger;

    let sum = 0;
    if (
        activePlayer.hasOwnProperty("scores") &&
        activeJourney.hasOwnProperty("slug") &&
        group.hasOwnProperty("heuristics")
    ) {
        const HeuSlugs = group.heuristics.map((heuristic) => heuristic.slug);
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
    const radius = 28;
    const circ = 2 * Math.PI * radius;
    const percent = (sum / totalScale) * 100;

    const dashArray = {
        // strokeDashoffset: calc(175.92px - (175.92px * 85 / 100));
        strokeDashoffset: circ - (circ * percent) / 100,
    };

    return (
        <div className={`grid gap-5 grid-cols-6 ${styles.container}`}>
            <h1
                className={styles.sectionTitle + " " + "col-start-1 col-span-4"}
            >
                <span>{index + 1 + ". "}</span>
                {group.name}
            </h1>
            <div className={`col-start-5 col-end-7 ${styles.stats}`}>
                <b>
                    {sum} of {totalScale}
                </b>
                <div className={styles.percent}>
                    <svg>
                        <circle cx="28" cy="28" r="28"></circle>
                        <circle
                            style={dashArray}
                            cx="28"
                            cy="28"
                            r="28"
                        ></circle>
                    </svg>
                    <h2>
                        {percent.toFixed(1)}
                        <span>%</span>
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default GroupSectionheader;
