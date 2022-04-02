import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Range from "../Range";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";

// import { Container } from './styles';

const textScores = {
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
    setNote,
    choice,
}) {
    const [rangeValue, setRangeValue] = useState("2");
    const [noteText, setNoteText] = useState("");
    const [changed, setChanged] = useState(false);
    const [values, setValues] = useState({ score: 2, note: "n" });

    const heuristicScore = {};

    const debouncedSaving = useCallback(
        debounce(() => {
            console.log("debounced  salvar agora!!!");
        }, 2000),
        []
    );
    const debounceFn = useCallback(
        debounce((func) => {
            console.log("DEBOU");
            func();
        }, 4000),
        []
    );

    function setHeuristicScore(value) {
        setRangeValue(value);
        setScore(slug, rangeValue, noteText);
    }

    // Getting Current Score from DB

    useEffect(() => {
        // debugger;
        if (activePlayer[activeJourney]) {
            // setRangeValue(currentScore.score);
            // setNoteText(currentScore.note);
            setValues({ ...activePlayer.scores[activeJourney][slug] });
            console.log("currentScore:", activePlayer[activeJourney].scores);
        }
    }, []);

    // useEffect(() => {
    //     setScore(slug, rangeValue, noteText);
    // }, [noteText]);

    // useEffect(() => {
    //     setScore(slug, rangeValue, noteText);
    // }, []);

    /**
     *
     * Capturing Notes
     */

    useEffect(() => {
        console.log("mudou activeJourney aqui", activeJourney);
        // debugger;
        if (activePlayer && activeJourney !== null) {
            console.log("mudou player aqui", activePlayer);
            // setRangeValue(currentScore.score);
            // setNoteText(currentScore.note);
            // setValues({ ...activePlayer.scores[activeJourney][slug] });
            setValues({ ...activePlayer.scores[activeJourney][slug] });
            // debounceFn(() => {
            // });
            // console.log("currentScore:", activePlayer[activeJourney].scores);
        }
    }, [activePlayer]);

    useEffect(() => {
        setScore(slug, { ...values });

        // debouncedSaving();
    }, [values]);

    // useEffect(() => {
    //     // heuristicScore[slug] = rangeValue;
    //     setChanged(true);
    //     console.log("mudouuuu");
    // }, [noteText]);

    function handleChangeRange(ev) {
        setValues({ ...values, score: ev.target.value });

        // console.log("salvar agora!!!");
    }

    return (
        <div className="heuristicWrapper">
            <span className="number">{slug}</span>
            <div className="heuristicContainer">
                <h2>{title}</h2>
                <p>{description}</p>

                <div className="sliderWrapper">
                    {type === "scale" ? (
                        <Range
                            type={"range"}
                            min={1}
                            max={5}
                            value={values.score}
                            onChange={(ev) => handleChangeRange(ev)}
                        />
                    ) : (
                        <select>
                            <option>TBD</option>
                        </select>
                    )}
                    <span className="sliderValue">
                        {textScores[rangeValue]}
                    </span>
                </div>

                <button>
                    <Image src="/icon-addnote.svg" width="20" height="22" /> Add
                    Note
                </button>

                <div className="noteContainer">
                    <textarea
                        onChange={(ev) =>
                            setValues({ ...values, note: ev.target.value })
                        }
                        value={values.note}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}

export default HeuristicNode;
