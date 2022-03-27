import React from "react";
import Image from "next/image";

// import { Container } from './styles';

function HeuristicNode({ number, title, description, type = "scale", choice }) {
    return (
        <div className="heuristicWrapper">
            <span className="number">{number}</span>
            <div className="heuristicContainer">
                <h2>{title}</h2>
                <p>{description}</p>

                <div className="sliderWrapper">
                    {type === "scale" ? (
                        <input type={"range"} min={1} max={50} />
                    ) : (
                        <select>
                            <option>TBD</option>
                        </select>
                    )}
                    <span className="sliderValue">4 - Agree</span>
                </div>

                <button>
                    <Image src="/icon-addnote.svg" width="20" height="22" /> Add
                    Note
                </button>
            </div>
        </div>
    );
}

export default HeuristicNode;
