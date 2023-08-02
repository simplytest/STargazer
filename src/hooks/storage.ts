import { useEffect, useState } from "react";
import { storage } from "../extension/storage";

export default function useStorage<T>(key: string, initial?: T): [T, (value: T) => void]
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