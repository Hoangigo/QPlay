import { EventSchema } from "./EventSchema"

export type HostSchema = {
    _id: string,
    name: string,
    email: string,
    password: string,
    isConfirmed: boolean,
    resetPasswordToken: string | null,
    resetPasswordExpires: string | null,
    events: Array<EventSchema>
}