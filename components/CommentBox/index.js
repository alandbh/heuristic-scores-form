import React from "react";
import styles from "./CommentBox.module.scss";
// import { Container } from './styles';

function CommentBox({ index, finding, handleTextFinding, handleTypeFinding }) {
    function onChangeValue(ev) {
        console.log("RADIO", ev.target.value);
        handleTypeFinding(finding.id, ev.target.value);
    }

    return (
        <div className={styles.container}>
            <textarea
                key={index}
                value={finding.text}
                id={finding.id}
                onChange={(ev) => handleTextFinding(ev)}
                className={styles[finding.type]}
            ></textarea>
            <div className={styles.radioContainer}>
                <div className={styles.question}>
                    How do you classify this finding?
                </div>
                <div>
                    <label
                        className={
                            finding.type === "bad" ? styles[finding.type] : ""
                        }
                    >
                        <input
                            type="radio"
                            checked={finding.type === "bad"}
                            onChange={(ev) => onChangeValue(ev)}
                            name={`type-${finding.id}`}
                            value="bad"
                        ></input>
                        <span>Bad</span>
                    </label>
                </div>
                <div>
                    <label
                        className={
                            finding.type === "neutral"
                                ? styles[finding.type]
                                : ""
                        }
                    >
                        <input
                            type="radio"
                            checked={finding.type === "neutral"}
                            onChange={(ev) => onChangeValue(ev)}
                            name={`type-${finding.id}`}
                            value="neutral"
                        ></input>
                        <span>Neutral</span>
                    </label>
                </div>
                <div>
                    <label
                        className={
                            finding.type === "good" ? styles[finding.type] : ""
                        }
                    >
                        <input
                            type="radio"
                            checked={finding.type === "good"}
                            onChange={(ev) => onChangeValue(ev)}
                            name={`type-${finding.id}`}
                            value="good"
                        ></input>
                        <span>Good</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default CommentBox;
