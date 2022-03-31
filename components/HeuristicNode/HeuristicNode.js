import React, { useEffect, useState } from "react";
import Image from "next/image";
import Range from "../Range";

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
    setNote,
    choice,
}) {
    const [rangeValue, setRangeValue] = useState("2");
    const [noteText, setNoteText] = useState("");

    const heuristicScore = {};

    function setHeuristicScore(value) {
        setRangeValue(value);
        setScore(slug, rangeValue, noteText);
    }

    // Getting Current Score from DB

    useEffect(() => {
        if (currentScore) {
            setRangeValue(currentScore.score);
            setNoteText(currentScore.note);
        }
    }, [activePlayer]);
    // useEffect(() => {
    //     setScore(slug, rangeValue, noteText);
    // }, [rangeValue]);
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

    // useEffect(() => {

    //     setScore(slug, rangeValue, noteText);
    // }, [rangeValue, noteText]);

    // useEffect(() => {
    //     // heuristicScore[slug] = rangeValue;
    //     setNote(noteText);
    // }, [noteText]);

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
                            value={rangeValue}
                            onChange={(ev) =>
                                setHeuristicScore(ev.target.value)
                            }
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
                        onChange={(ev) => setNoteText(ev.target.value)}
                        value={noteText}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}

export default HeuristicNode;
