import { Navigate } from "react-router-dom";

export default function RouteRedirect({ to }) {
  return <Navigate to={to} replace />;
}
