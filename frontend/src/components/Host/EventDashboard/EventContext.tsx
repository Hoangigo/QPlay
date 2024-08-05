import { createContext, Dispatch, SetStateAction } from "react";

const EventContext = createContext<[any, Dispatch<SetStateAction<any>>] | undefined>(undefined);
const EventProvider = EventContext.Provider;

export { EventContext, EventProvider };
