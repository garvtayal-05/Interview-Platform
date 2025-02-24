import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./Screens/Signup";
import Login from "./Screens/Login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <div>
          <Signup />
        </div>
      ),
    },
    {
      path: "/login",
      element: (
        <div>
          <Login />
        </div>
      ),
    },
    // {
    //   path:"/user/gatepasses",
    //   element:
    //   <div>

    //       <GatePasses />
    //   </div>
    // },
    // {
    //   path:"/warden/gatepasses",
    //   element:
    //   <div>
    //       <WardenDashboard />
    //   </div>
    // },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
