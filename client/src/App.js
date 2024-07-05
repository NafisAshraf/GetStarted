import "./App.css";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./components/Homepage";
import SignUp from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import VerifyUser from "./pages/VerifyUserPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  // {
  //   path: "/forgotpassword",
  //   element: <ForgotPassword />,
  // },
  // {
  //   path: "/reset-password/:token",
  //   element: <ResetPassword />,
  // },
  {
    path: "/verify-user/:token",
    element: <VerifyUser />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
