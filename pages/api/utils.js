import { useState, useEffect } from "react";

function getStorageValue(key, defaultValue) {
    // getting stored value
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem(key);
        const initial =
            saved !== null && saved !== undefined
                ? JSON.parse(saved)
                : defaultValue;
        return initial;
    }
}

export const useLocalStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        // storing input name
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};

export function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            (areObjects && !deepEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            return false;
        }
    }
    return true;
}

export function isObject(object) {
    return object != null && typeof object === "object";
}

export async function updadePlayer(playerObj) {
    const response = await fetch(
        `http://localhost:3000/api/changedata?player=${encodeURI(
            playerObj.name
        )}`,
        {
            method: "POST",
            body: JSON.stringify(playerObj),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    console.log("GRAVOU?", response);

    //?player=Casas%20Bahia
}
