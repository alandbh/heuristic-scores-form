import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Range from "../Range";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import { useDidUpdate } from "../../pages/api/utils";
import styles from "./HeuristicNode.module.scss";

// import { Container } from './styles';

const textScores = {
    0: "0 - Not evaluated",
    1: "1 - Strongly Disagree",
    2: "2 - Disagree",
    3: "3 - Neutral",
    4: "4 - Agree",
    5: "5 - Strongly Agree",
};

function HeuristicNode({
    slug,
    title,
    description,
    type = "scale",
    setScore,
    currentScore,
    activePlayer,
    activeJourney,
    playerHasChanged,
    setPlayerHasChanged,
    journeyHasChanged,
    setNote,
    choice,
}) {
    const [rangeValue, setRangeValue] = useState("2");
    const [noteText, setNoteText] = useState("");
    const [changed, setChanged] = useState(false);
    const [values, setValues] = useState({ score: 2, note: "n" });
    const [hasChanged, setHasChanged] = useState(false);

    const debounceFn = useCallback(
        debounce((func) => {
            console.log("DEBOU");
            func();
        }, 500),
        []
    );

    function updateScores() {
        if (
            activePlayer &&
            activeJourney !== null &&
            activePlayer.scores &&
            playerHasChanged
        ) {
            let _scores = activePlayer.scores[activeJourney][slug];

            setValues({
                ...values,
                score: Number(_scores.score),
                note: _scores.note,
            });
        }
    }

    /**
     *
     * SETTING THE FIRST LOADED VALUES AND NOTES
     */

    // Getting Current Score from DB

    useEffect(() => {
        // debugger;
        updateScores();
    }, []);

    useDidUpdate(() => {
        updateScores();
    }, [activePlayer]);

    const changeValues = useCallback(() => {}, [values]);

    useEffect(() => {
        // debugger;

        if (hasChanged) {
            setScore(slug, { ...values });
            setHasChanged(false);
        }
        // debounce(() => {}, 500);

        // debouncedSaving();
    }, [changeValues]);

    useDidUpdate(() => {
        // updateScores();
        // debugger;
        let _scores = activePlayer.scores[activeJourney][slug];
        // debugger;
        setValues({
            ...values,
            score: Number(_scores.score),
            note: _scores.note,
        });
        setPlayerHasChanged(false);
        setScore(slug, { ...values });
        if (journeyHasChanged) {
        }
    }, [activeJourney]);

    useEffect(() => {
        // debouncedSaving();
    }, [activeJourney]);

    function handleChangeRange(ev) {
        setHasChanged(true);
        setValues({ ...values, score: ev.target.value });

        // console.log("salvar agora!!!");
    }

    // const handleChangeNote = debounce((ev) => {
    //     console.log("debou3", ev.target.value);
    //     setHasChanged(true);
    //     setValues({ ...values, note: ev.target.value });
    // }, 500);

    const handleChangeNote = (ev) => {
        console.log("debou3", ev.target.value);
        setHasChanged(true);
        setValues({ ...values, note: ev.target.value });
    };

    useDidUpdate(() => {}, [values]);

    // function handleChangeNote(ev) {
    //     // debounceFn();
    //     // setHasChanged(true);

    //     debounce(() => {
    //         setValues({ ...values, note: ev.target.value });
    //     }, 500);

    //     // console.log("salvar agora!!!");
    // }

    const [textBoxOpen, setTextBoxOpen] = useState(false);

    function handleClickAddNote() {
        setTextBoxOpen(!textBoxOpen);
    }

    return (
        <div className={styles.wrapper}>
            <span className={styles.number}>
                {slug.substr(2).replace("_", ".")}
            </span>
            <div className={styles.container}>
                <h2>{title}</h2>
                <p>{description}</p>

                <div className={styles.rangeWrapper}>
                    {type === "scale" ? (
                        <Range
                            type={"range"}
                            min={0}
                            max={5}
                            value={values.score}
                            onChange={(ev) => handleChangeRange(ev)}
                        />
                    ) : (
                        <select>
                            <option>TBD</option>
                        </select>
                    )}
                    <span className={styles.rangeValue}>
                        {textScores[values.score]}
                    </span>
                </div>

                <button
                    onClick={handleClickAddNote}
                    className={styles.btnAddNote}
                >
                    <Image src="/icon-addnote.svg" width="20" height="22" />
                    <b>{textBoxOpen ? "Close Text Box" : "Add Note"}</b>
                </button>

                <div
                    className={`${styles.textAreaContainer} ${
                        textBoxOpen ? styles.textBoxOpen : ""
                    }`}
                >
                    <textarea
                        onChange={(ev) => handleChangeNote(ev)}
                        value={values.note}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}

export default HeuristicNode;
