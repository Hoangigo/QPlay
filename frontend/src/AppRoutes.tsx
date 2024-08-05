import { Route, Routes } from "react-router-dom";
import LoginForm from "./components/Login/LoginForm";
import About from "./components/About";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import RegisterForm from "./components/Register/RegisterForm";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import HostDashboard from "./components/Host/HostDashboard/HostDashboard";
import VerificationMessage from "./components/VerificationMessage";
import EventDashboard from "./components/Host/EventDashboard/EventDashboard";
import ResetPassword from "./components/ForgotPassword/ResetPassword";
import UserSongSuggest from "./components/User/Suggestion/UserSongSuggest";
import AuthRequired from "./components/Authentication/AuthRequired";
import UserEventOverview from "./components/User/Overview/UserEventOverview";
import UserSongSuggestionPayment from "./components/User/Suggestion/UserSongSuggestionPayment";
import UserActiveAuctionPayment from "./components/User/Auction/UserActiveAuctionPayment";
import { DashboardProvider } from "./components/Host/EventDashboard/DashboardContext";
import { useState } from "react";

const AppRoutes = () => {
  const state = useState<number>(0);

  return (
    <Routes>
      <Route path="/" Component={LoginForm} />
      <Route path="/login" Component={LoginForm} />
      <Route path="/forgot-password" Component={ForgotPassword} />
      <Route path="/register" Component={RegisterForm} />
      <Route
        path="/host-dashboard/:tabIndex"
        element={
          <AuthRequired>
            <HostDashboard />
          </AuthRequired>
        }
      />
      <Route path="/user/song-suggest/:eventId" Component={UserSongSuggest} />
      <Route path="/user/song-suggest/:eventId/payment" Component={UserSongSuggestionPayment} />
      <Route path="/user/event-overview/:eventId" Component={UserEventOverview} />
      <Route path="/user/bet/:eventId/payment" Component={UserActiveAuctionPayment} />
      <Route
        path="/event-dashboard/:id"
        element={
          <AuthRequired>
            <DashboardProvider value={state}>
              <EventDashboard />
            </DashboardProvider>
          </AuthRequired>
        }
      />
      <Route path="/about" Component={About} />
      <Route path="/terms" Component={Terms} />
      <Route path="/privacy" Component={Privacy} />
      <Route path="/confirm" Component={VerificationMessage} />
      <Route path="/password/reset" Component={ResetPassword} />
    </Routes>
  );
};

export default AppRoutes;
