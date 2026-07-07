import { Navigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "../../contexts/useAuth";

const AdminRoute = ({ children, blogManager = false }) => {
  const { canManageBlogs, isAdmin, loading, user } = useAuth();

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;
  if (blogManager) {
    if (!canManageBlogs) return <Navigate to="/account" replace />;
  } else if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return children;
};

export default AdminRoute;
