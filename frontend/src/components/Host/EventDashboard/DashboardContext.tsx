import { createContext, Dispatch, SetStateAction } from "react";

const DashboardContext = createContext<[number, Dispatch<SetStateAction<number>>] | undefined>(undefined);
const DashboardProvider = DashboardContext.Provider;

export { DashboardContext, DashboardProvider };