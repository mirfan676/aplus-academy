import React from "react";
import { Box, Grid, Card, Skeleton, Typography } from "@mui/material";

const TeacherCardLoader = ({ count = 6 }) => {
  return (
    <Box>
      {/* Messages */}
      <Typography variant="h6" align="center" sx={{ mb: 1, color: "#004aad" }}>
        Please wait...
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ mb: 3, color: "#004aad" }}>
        Finding best teachers...
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {Array.from({ length: count }).map((_, i) => (
          <Grid item key={i} xs={12} sm={6} md={4} sx={{ display: "flex" }}>
            <Card
              sx={{
                p: 0,
                borderRadius: "22px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                flex: 1,
                minHeight: 400,
                minWidth: 320,
                maxWidth: 320,
                overflow: "hidden",
              }}
            >
              {/* Floating Badge */}
              <Skeleton
                variant="rectangular"
                width={80}
                height={24}
                animation="wave"
                sx={{ position: "absolute", top: 10, right: 10, borderRadius: "16px" }}
              />

              {/* Top Section */}
              <Box sx={{ display: "flex", p: 2, gap: 2 }}>
                <Skeleton variant="circular" width={70} height={70} animation="wave" />

                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="80%" height={24} animation="wave" sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={20} animation="wave" sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="40%" height={20} animation="wave" sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="30%" height={18} animation="wave" />
                </Box>
              </Box>

              {/* Middle Section */}
              <Box sx={{ p: 2, flexGrow: 1 }}>
                <Skeleton variant="text" width="50%" animation="wave" sx={{ mb: 1 }} /> {/* Subjects title */}
                <Skeleton variant="text" width="80%" animation="wave" sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="70%" animation="wave" sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="60%" animation="wave" sx={{ mb: 0.5 }} />

                <Skeleton variant="text" width="50%" animation="wave" sx={{ mt: 2, mb: 1 }} /> {/* Bio title */}
                <Skeleton variant="text" width="90%" animation="wave" sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="85%" animation="wave" sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width="80%" animation="wave" />
              </Box>

              {/* Footer Price */}
              <Skeleton
                variant="rectangular"
                width="100%"
                height={36}
                animation="wave"
                sx={{ bgcolor: "grey.300" }}
              />

              {/* Buttons */}
              <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                <Skeleton variant="rectangular" width="100%" height={36} animation="wave" />
                <Skeleton variant="rectangular" width="100%" height={36} animation="wave" />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TeacherCardLoader;
