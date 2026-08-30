// TeacherMapSection.jsx
import React, { Suspense } from "react";
import { Box, Button, CircularProgress } from "@mui/material";

const LazyMap = React.lazy(() => import("./LazyMapSection"));

export default function TeacherMapSection({
  mapVisible,
  setMapVisible,
  userLocation,
  filtered = [],
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
            userLocation={userLocation}
            filtered={filtered}
          />
        </Suspense>
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#e8f2ff",
            color: "#004aad",
            fontWeight: 600,
            fontSize: "1.05rem",
          }}
        >
          <Button
            variant="contained"
            onClick={() => setMapVisible(true)}
            sx={{ fontWeight: 700 }}
          >
            View tutor map
          </Button>
        </Box>
      )}
    </Box>
  );
}
