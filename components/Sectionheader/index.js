import React from "react";

import styles from "./Sectionheader.module.scss";

// import { Container } from './styles';

function Sectionheader({ text }) {
    return (
        <div className={`grid gap-5 grid-cols-6 ${styles.container}`}>
            <h1
                className={styles.sectionTitle + " " + "col-start-1 col-span-4"}
            >
                {text}
            </h1>
        </div>
    );
}

export default Sectionheader;
