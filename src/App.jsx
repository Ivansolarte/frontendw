import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./store/slices/authSlice";
import { HomeRouters } from "./routers/home.routers";
import { AuthRouters } from "./routers/auth.routers";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      dispatch(login());
    }
    return () => {};
  }, []);

  return <div>{isAuthenticated ? <HomeRouters /> : <AuthRouters />}</div>;
}

export default App;
