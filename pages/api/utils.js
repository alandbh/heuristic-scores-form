import { useState, useEffect, useRef } from "react";

function getStorageValue(key, defaultValue) {
    // getting stored value
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem(key);
        // debugger;
        const initial =
            saved && saved !== "null" && saved !== "undefined" && saved !== "[]"
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

export function orderBy(array, param) {
    return array.sort((a, b) => a[param].localeCompare(b[param]));
}

export function getPlayersFromJourney(journey, allPlayers) {
    if (journey && allPlayers.length > 0) {
    }
    const unsortedPlayers = journey.players.map((plId) => {
        return allPlayers.filter((player) => player.id === plId)[0];
    });
    return orderBy(unsortedPlayers, "slug");
}

export function getHeuristicsFromJourney(journey, allHeuristics) {
    if (journey && allHeuristics.length > 0) {
        const unsortedHeuristics = journey.heuristics.map((hSlug) => {
            return allHeuristics.filter(
                (heuristic) => heuristic.slug === hSlug
            )[0];
        });

        return orderBy(unsortedHeuristics, "slug");
    }
}

export const useDidUpdate = (callback, dependencies) => {
    const didMountRef = useRef(false);

    useEffect(() => {
        // block first call of the hook and forward each consecutive one
        if (didMountRef.current) {
            callback();
        } else {
            didMountRef.current = true;
        }
    }, dependencies);
};
