import { createBrowserRouter, RouterProvider, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import HomePage from "./Screens/HomePage";
import Signup from "./Screens/Signup";
import Login from "./Screens/Login";
import ResetPasswordPage from "./Screens/ResetPasswordPage";
import JobListPage from "./Screens/JobListPage";
import JobDetailPage from "./Screens/JobDetailPage";
import CreateJobProfilePage from "./Screens/CreateJobProfile";
import ProfilePage from "./Screens/ProfilePage";
import ExplorePage from "./Screens/ExplorePage";
import AboutUs from "./Screens/AboutUs";
import ContactUs from "./Screens/ContactUs";
import FAQ from "./Screens/FAQ";
import UnderDevelopment from "./Screens/UnderDevelopment";
import CommunityForm from "./Screens/CommunityForm";
import AppliedJobs from "./Screens/AppliedJobs";
import JobApplications from "./Screens/JobApplications";
import STT from "./Screens/STT";
import AnalyticsDashboard from "./Screens/AnalyticsDashboard";

// Scroll to top on route change
const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [location.pathname]);
  return null;
};

function BackgroundEffect() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return !isHome ? (
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-500 opacity-5 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500 opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-3/4 left-3/4 w-48 h-48 rounded-full bg-purple-400 opacity-5 blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
    </div>
  ) : null;
}

// Layout with Navbar, Footer, and routed pages
const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <ScrollToTop />
    <BackgroundEffect />
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ResetPasswordPage /> },
      { path: "jobs", element: <JobListPage /> },
      { path: "jobs/:_id", element: <JobDetailPage /> },
      { path: "jobs/create", element: <CreateJobProfilePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "explore", element: <ExplorePage /> },
      { path: "about-us", element: <AboutUs /> },
      { path: "contact-us", element: <ContactUs /> },
      { path: "faq", element: <FAQ /> },
      { path: "facebook", element: <UnderDevelopment /> },
      { path: "twitter", element: <UnderDevelopment /> },
      { path: "linkedin", element: <UnderDevelopment /> },
      { path: "community-form", element: <CommunityForm /> },
      { path: "features", element: < UnderDevelopment/> },
      { path: "applied-jobs", element: <AppliedJobs /> },
      { path: "applications", element: < JobApplications/> },
      { path: "stt", element: < STT/> },
      { path: "report", element: < AnalyticsDashboard/> },
    ],
  },
]);

// Main App Component
const App = () => (
  <>
    <ToastContainer position="top-right" autoClose={1500} pauseOnHover />
    <RouterProvider router={router} />
  </>
);

export default App;
