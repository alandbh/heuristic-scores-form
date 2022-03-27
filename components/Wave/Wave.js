import React from "react";
import styles from "./Wave.module.scss";

function Wave({
    ammount = 6,
    color = "#6aa6ff",
    width = "100px",
    height = "30px",
    style,
}) {
    // const ammount = 8;
    // const color = "#6aa6ff";

    const bars = Array.from(Array(Number(ammount)).keys());

    return (
        <div style={{ width, height, ...style }} className={styles.container}>
            <div className={styles.loading}>
                {bars.map((bar) => (
                    <div
                        key={bar}
                        style={{
                            background: color,
                            width: `${100 / (ammount * 2 - 1)}%`,
                            margin: `${100 / (ammount * 2 - 1) / 2}%`,
                        }}
                        className={styles.obj}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default Wave;
