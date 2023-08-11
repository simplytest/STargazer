import { useEffect, useState } from "react";
import { session_storage, storage } from "../extension/storage";

export function useStorage<T>(key: string, initial?: T): [T, (value: T) => void]
{
    const [value, set_value] = useState(initial);

    function setter(value: T)
    {
        storage.set(key, value).then(() => set_value(value));
    }

    useEffect(() =>
    {
        storage.get<T>(key).then(value => set_value(value ?? initial));
        storage.watch(key, set_value);
    }, []);

    return [value, setter];
}

export function useSessionStorage<T>(id: number, key: string, initial?: T): [T, (value: T) => void]
{
    const [value, set_value] = useState(initial);
    const session_key = `${id}-${key}`;

    const setter = (value: T) =>
    {
        session_storage.set(session_key, value).then(() => set_value(value));
    };

    useEffect(() =>
    {
        session_storage.get<T>(session_key).then(value => set_value(value ?? initial));
        session_storage.watch(session_key, set_value);
    }, []);

    return [value, setter];
}