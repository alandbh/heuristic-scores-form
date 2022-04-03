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
    const dropstyles = {
        container: {
            left: getPosition(props.min, props.max, props.value, 18),
        },
        content: {
            background: Number(props.value) === 0 ? "lightgrey" : "",
        },
    };

    const inputStyle = {
        background: Number(props.value) === 0 ? "lightgrey" : "",
    };

    return (
        <div
            className={
                Number(props.value) === 0
                    ? styles.inputDisable + " " + styles.container
                    : styles.container
            }
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
