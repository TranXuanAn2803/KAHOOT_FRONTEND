import React, { useEffect } from "react";
import NoMatch from "./pages/NoMatch";
import { SignIn } from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import ListGroup from "./pages/Group/List/List";
import ButtonAppBar from "./pages/Group/Detail/Detail";
import GroupMember from "./pages/Group/Member/Member";
import GroupSile from "./pages/Group/Slide/Slide";
import GroupInvitation from "./pages/Group/Invitate/Invitate";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProfile, ProfileSetting } from "./pages/UserProfile";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "./utils/UserContext";
import { PresentationProvider } from "./utils/PresentationContext";
import { onLogout } from "./utils/method";
import Creator from "./pages/Creator";
import { Header } from "./components/Header";
import { MyPresentations, Presentation } from "./pages/Presentation";
import { EditPresentation } from "./pages/Presentation/Edit/EditPresentation";
import { ShowPresentation } from "./pages/Presentation/Show/ShowPresentation";
import PresentPresentation from "./pages/Presentation/Present/presentPresentation";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      refetchOnWindowFocus: false
    }
  }
});
// App.js
const App = () => {
  useEffect(() => {
    const handleInvalidToken = (e) => {
      console.log("e token", e);
      if ((e.key === "accessToken" || e.key == "refreshToken") && e.oldValue && !e.newValue) {
        onLogout();
      }
    };
    window.addEventListener("storage", handleInvalidToken);
    return function cleanup() {
      window.removeEventListener("storage", handleInvalidToken);
    };
  }, [onLogout]);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <UserProvider>
            <PresentationProvider>
              <Header />
              <main
                style={{
                  marginTop: "6.4rem",
                  overflowY: "auto",
                  width: "100vw",
                  height: "100vh"
                }}>
                <Routes>
                  <Route exact path="/" element={<Navigate to="/signin" />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route exact path="/home" element={<Home />} />
                  <Route exact path="/groups" element={<ListGroup />} />
                  {/* <Route exact path="/creator" element={<Creator />} /> */}
                  <Route path="group-detail" element={<ButtonAppBar />} />
                  <Route path="group-members" element={<GroupMember />} />
                  <Route path="group-slides" element={<GroupSile />} />
                  <Route exact path="/group-invitation/:id" element={<GroupInvitation />} />

                  <Route path="/user" element={<UserProfile />}>
                    <Route path={``} element={<Navigate to={`./profile`} />} />
                    <Route path={`profile`} element={<ProfileSetting />} />
                  </Route>
                  <Route path="/presentations" element={<Presentation />}>
                    <Route index element={<MyPresentations />}></Route>
                    <Route path="all" element={<MyPresentations />} />
                    <Route path=":presentationId/edit" element={<EditPresentation />} />
                    <Route path=":presentationId/show" element={<ShowPresentation />} />
                    <Route path="show" element={<PresentPresentation />} />
                  </Route>

                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/auth/reset-password/:resetPasswordToken"
                    element={<ResetPassword />}
                  />
                  <Route path="*" element={<NoMatch />} />
                </Routes>
              </main>
            </PresentationProvider>
          </UserProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </>
  );
};

export default App;
