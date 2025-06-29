import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./components/Layouts/AuthLayout";
import SigninPage from "./components/Pages/SigninPage";
import SignupPage from "./components/Pages/SignupPage";
import RootLayout from "./components/Layouts/RootLayout";
import HomePage from "./components/Pages/HomePage";
import CommunityPage from "./components/Pages/CommunityPage";
import ProfilePage from "./components/Pages/ProfilePage";
import SubmitPage from "./components/Pages/SubmitPage";
import PostPage from "./components/Pages/PostPage";
import { useUserContext } from "./context/AuthContext";

const App = () => {
  const { user } = useUserContext();

  return (
    <main>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninPage />} />
          <Route path="/sign-up" element={<SignupPage />} />
        </Route>

        <Route element={<RootLayout />}>
          <Route index element={<HomePage key="home" />} />
          <Route path="r/:communityName" element={<CommunityPage />} />
          <Route path="r/:communityName/submit" element={<SubmitPage />} />
          <Route path="u/:username" element={<ProfilePage />} />
          <Route path="post/:postId" element={<PostPage />} />
          <Route
            path="popular"
            element={
              <HomePage
                key="popular"
                initialSortFilter="hot"
                initialTimeFilter="week"
              />
            }
          />
          <Route
            path="all"
            element={
              <HomePage
                key="all"
                initialSortFilter="new"
                initialTimeFilter="all"
              />
            }
          />
          <Route
            path="*"
            element={<Navigate to={user ? "/" : "/popular"} replace />}
          />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
