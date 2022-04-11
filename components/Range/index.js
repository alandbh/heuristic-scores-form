import React from "react";
import styles from "./Range.module.scss";

function getPosition(min, max, value, drop) {
    const range = max - min;
    const difference = value - min;
    const percentage = (difference / range) * 100;
    if (percentage === 0) {
        return `calc(${percentage}% + ${drop - 16}px)`;
    } else {
        return `calc(${percentage}% - ${drop * (percentage / 100)}px)`;
    }
}

const Range = (props) => {
    let inputStyle = {};
    let dropColor;

    if (Number(props.value) === 0) {
        inputStyle.background =
            "linear-gradient(90deg, lightgrey 20%, grey 20%, grey 40%, lightgrey 40%, lightgrey 60%, grey 60%, grey 80%, lightgrey 80%, lightgrey 100%)";
        dropColor = `lightgrey`;
    } else if (Number(props.value) === 1) {
        inputStyle.background =
            "linear-gradient(90deg, #bd0000 20%, grey 20%, grey 40%, lightgrey 40%, lightgrey 60%, grey 60%, grey 80%, lightgrey 80%, lightgrey 100%)";
        dropColor = `#bd0000`;
    } else if (Number(props.value) === 2) {
        inputStyle.background =
            "linear-gradient(90deg, red 40%, lightgrey 40%, lightgrey 60%, grey 60%, grey 80%, lightgrey 80%, lightgrey 100%)";
        dropColor = `red`;
    } else if (Number(props.value) === 3) {
        inputStyle.background =
            "linear-gradient(90deg, darkorange 60%, grey 60%, grey 80%, lightgrey 80%, lightgrey 100%)";
        dropColor = `darkorange`;
    } else if (Number(props.value) === 4) {
        inputStyle.background =
            "linear-gradient(90deg, limegreen 80%, lightgrey 80%, lightgrey 100%)";
        dropColor = `limegreen`;
    } else if (Number(props.value) === 5) {
        inputStyle.background = `linear-gradient(90deg, #08a908 0%, #08a908 100%)`;
        dropColor = `#08a908`;
    } else {
        inputStyle.background = `linear-gradient(90deg, lightgrey 20%, grey 20%, grey 40%, lightgrey 40%, lightgrey 60%, grey 60%, grey 80%, lightgrey 80%, lightgrey 100%)`;
        dropColor = `lightgrey`;
    }

    const dropstyles = {
        container: {
            left: getPosition(props.min, props.max, props.value, 18),
        },
        content: {
            background: dropColor,
        },
    };

    // const inputStyle = {
    //     background: Number(props.value) === 0 ? "lightgrey" : "",
    //     background:
    //         Number(props.value) === 1
    //             ? `linear-gradient(90deg, red 0%, red 40%, grey 40%, grey 100%)`
    //             : `lightgrey`,
    //     background:
    //         Number(props.value) === 2
    //             ? `linear-gradient(90deg, palevioletred 0%, palevioletred 40%, grey 40%, grey 100%)`
    //             : `lightgrey`,
    // };

    const dragColor = [
        styles.inputDisable,
        styles.sc1,
        styles.sc2,
        styles.sc3,
        styles.sc4,
        styles.sc5,
    ];

    return (
        <div
            className={dragColor[Number(props.value)] + " " + styles.container}
        >
            <input
                style={inputStyle}
                type={props.type}
                min={props.min}
                max={props.max}
                value={props.value}
                onChange={props.onChange}
            />

            <span className={styles.dropContainer} style={dropstyles.container}>
                <b className={styles.dropContent} style={dropstyles.content}>
                    <span>{props.value}</span>
                </b>
            </span>
        </div>
    );
};

export default Range;
