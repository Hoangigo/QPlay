import { createContext, Dispatch, SetStateAction } from "react";

const ActivityContext = createContext<[any, Dispatch<SetStateAction<any>>] | undefined>(undefined);
const ActivityProvider = ActivityContext.Provider;

export { ActivityContext, ActivityProvider };
