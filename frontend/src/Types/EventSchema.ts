import { LatLngLiteral } from "leaflet";
import { AuctionSchema } from "./AuctionSchema";
import { SuggestionSchema } from "./SuggestionSchema";
import { VoteSchema } from "./VoteSchema";
import * as Yup from "yup";

export type CreateEventSchema = {
  title: string;
  latitude: number;
  longitude: number;
  description: string;
  start: Date;
  end: Date;
  private: boolean;
  songSuggestionPrice: number;
  messagePrice: number;
};

export type EventSchema = {
  _id: string;
  title: string;
  latitude: number;
  longitude: number;
  description: string;
  start: Date;
  end: Date;
  private: boolean;
  songSuggestionPrice: number;
  messagePrice: number;
  suggestions: SuggestionSchema[];
  voteActivities: VoteSchema[];
  auctionActivities: AuctionSchema[];
};

export type EventInfoSchema = {
  _id: string;
  title: string;
  latitude: number;
  longitude: number;
  description: string;
  start: Date;
  end: Date;
  private: boolean;
  songSuggestionPrice: number;
  messagePrice: number;
};

export type EventActiveVoteSchema = {
  _id: string;
  voteActivity: VoteSchema;
};

export type EventActiveAuctionSchema = {
  _id: string;
  auctionActivity: AuctionSchema;
};

export type EventVoteSchema = {
  _id: string;
  voteActivities: VoteSchema[];
};

export type EventAuctionSchema = {
  _id: string;
  auctionActivities: AuctionSchema[];
};

export type EventSuggestionSchema = {
  _id: string;
  suggestions: SuggestionSchema[];
};

export interface CreateEventFormValues {
  name: string;
  description: string;
  start: Date;
  end: Date;
  location: LatLngLiteral;
  private: boolean;
  songSuggestionsPrice: number;
  messagePrice: number;
}

export const initialValues: CreateEventFormValues = {
  name: "",
  description: "",
  start: new Date(),
  end: new Date(),
  location: {
    lat: 49.868244,
    lng: 8.63907,
  },
  private: false,
  songSuggestionsPrice: 0,
  messagePrice: 0,
};

export const createEventValidationSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  start: Yup.date().required("Required").nullable(),
  end: Yup.date().required("Required").nullable(),
  location: Yup.object()
    .shape({
      lat: Yup.number().required("Required"),
      lng: Yup.number().required("Required"),
    })
    .required("Required"),
  private: Yup.boolean().required("Required"),
  songSuggestionsPrice: Yup.number().required("Required"),
  messagePrice: Yup.number().required("Required"),
});

