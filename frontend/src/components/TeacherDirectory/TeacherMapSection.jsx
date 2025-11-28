import React, { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

const LazyMap = React.lazy(() => import("./LazyMapSection"));

export default function TeacherMapSection({ mapVisible, setMapVisible, userLocation, filtered, personIcon }) {
  return (
    <Box sx={{ height: { xs: 240, md: 340 }, mb: 4, borderRadius: "22px", overflow: "hidden" }}>

      {mapVisible ? (
        <Suspense fallback={<CircularProgress />}>
          <LazyMap filtered={filtered} userLocation={userLocation} personIcon={personIcon} />
        </Suspense>
      ) : (
        <Box
          onMouseEnter={() => setMapVisible(true)}
          sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          Hover to load map 🗺️
        </Box>
      )}

    </Box>
  );
}
