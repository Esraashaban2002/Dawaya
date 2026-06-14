import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function ProtectedRoute(props) {
  const { userLogin } = useContext(UserContext);

  if (userLogin !== null) {
    return props.children;
  } else {
    return <Navigate to="/login" />;
  }
}