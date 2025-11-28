// TeacherMapSection.jsx
import React, { Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";

const LazyMap = React.lazy(() => import("./LazyMapSection"));

export default function TeacherMapSection({
  mapVisible,
  setMapVisible,
  userLocation,
  filtered,
  personIcon,
}) {
  return (
    <Box
      sx={{
        height: { xs: 260, md: 360 },
        mb: 4,
        borderRadius: "22px",
        overflow: "hidden",
        background: "white",
        boxShadow: "0px 4px 15px rgba(0,0,0,0.08)",
      }}
    >
      {mapVisible ? (
        <Suspense
          fallback={
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          }
        >
          <LazyMap
            filtered={filtered}
            userLocation={userLocation}
            personIcon={personIcon}
          />
        </Suspense>
      ) : (
        <Box
          onMouseEnter={() => setMapVisible(true)}
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            background: "#e8f2ff",
            color: "#004aad",
            fontWeight: 600,
            fontSize: "1.05rem",
          }}
        >
          Hover to load map 🗺️
        </Box>
      )}
    </Box>
  );
}
