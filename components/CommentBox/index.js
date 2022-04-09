import React, { useEffect, useState } from "react";
import { storage, useDidUpdate } from "../../pages/api/utils";
import styles from "./CommentBox.module.scss";
// import { Container } from './styles';

function CommentBox({
    index,
    finding,
    handleTextFinding,
    handleTypeFinding,
    activePlayer,
}) {
    const [text, setText] = useState({ ev: null, value: "" });

    function onChangeValue(ev) {
        console.log("RADIO", ev.target.value);
        handleTypeFinding(finding.id, ev.target.value, activePlayer);
        storage.set("isFirstLoad", "false");
    }

    function onChangeText(ev) {
        setText({ ev, value: ev.target.value });
        storage.set("isFirstLoad", "false");
    }

    useEffect(() => {
        setText({ ...text, value: finding.text });
    }, []);

    useDidUpdate(() => {
        if (text.ev) {
            handleTextFinding(text.ev, activePlayer);
        }
    }, [text]);

    return (
        <div className={styles.container}>
            <textarea
                key={index}
                value={text.value}
                id={finding.id}
                onChange={(ev) => onChangeText(ev)}
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
