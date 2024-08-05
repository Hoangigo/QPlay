import express from "express";
import HostRoute from "./host.route";
import SpotifyRoute from "./spotify.route";
import AuthRoute from "./auth.route";
import SuggestionRoute from "./suggestion.route";
import VoteActivityRoute from "./voteactivity.route";
import AuctionActivityRoute from "./auctionactivity.route";
import BetRoute from "./bet.route";
import VoteOptionRoute from "./voteoption.route";
import PaypalRoute from "./paypal.route";
import EventRoute from "./event.route";
import OpenStreetMapRoute from "./openstreetmap.route";

const router = express.Router({ mergeParams: true });

// define routes
router.use("/host", HostRoute);
router.use("/spotify", SpotifyRoute);
router.use("/auth", AuthRoute);
router.use("/suggestion", SuggestionRoute);
router.use("/vote", VoteActivityRoute);
router.use("/auction", AuctionActivityRoute);
router.use("/bet", BetRoute);
router.use("/voteoption", VoteOptionRoute);
router.use("/event", EventRoute);
router.use("/paypal", PaypalRoute);
router.use("/openstreetmap", OpenStreetMapRoute);

export default router;
