import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./Components/Navbar"; // Import Navbar
import Footer from "./Components/Footer"; // Import Footer

import Signup from "./Screens/Signup";
import Login from "./Screens/Login";
import ResetPasswordPage from "./Screens/ResetPasswordPage";
import JobListPage from "./Screens/JobListPage";
import JobDetailPage from "./Screens/JobDetailPage";
import CreateJobProfilePage from "./Screens/CreateJobProfile";
import HomePage from "./Screens/HomePage";
import UnderDevelopment from "./Screens/UnderDevelopment";
import ExplorePage from "./Screens/ExplorePage";
import AboutUs from "./Screens/AboutUs";
import ContactUs from "./Screens/ContactUs";
import FAQ from "./Screens/FAQ";

// Layout component to wrap Navbar, Outlet, and Footer
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Outlet for rendering child routes */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />, // Use Layout as the root element
      children: [
        { index: true, element: <HomePage /> }, // HomePage at root path
        { path: "/signup", element: <Signup /> },
        { path: "/login", element: <Login /> },
        { path: "/forgot-password", element: <ResetPasswordPage /> },
        { path: "/jobs", element: <JobListPage /> },
        { path: "/jobs/:_id", element: <JobDetailPage /> },
        { path: "/jobs/create", element: <CreateJobProfilePage /> },
        { path: "/profile", element: <UnderDevelopment /> },
        { path: "/explore", element: <ExplorePage /> },
        { path: "/about-us", element: <AboutUs /> },
        { path: "/contact-us", element: <ContactUs /> },
        { path: "/faq", element: <FAQ /> },
        { path: "/facebook", element: <UnderDevelopment /> },
        { path: "/twitter", element: <UnderDevelopment /> },
        { path: "/linkedin", element: <UnderDevelopment /> },
      ],
    },
  ]);

  return (
    <div>
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Router Provider */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;