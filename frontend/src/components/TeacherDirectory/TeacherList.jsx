import { Grid } from "@mui/material";
import TeacherCard from "./TeacherCard";
import TeacherCardLoader from "./TeacherCardLoader";

export default function TeacherList({
  loading,
  filtered,
  visibleCount,
  showMoreBio,
  toggleBio,
  showMoreSubjects,
  toggleSubjects,
}) {
  if (loading)
    return <TeacherCardLoader count={visibleCount} />;

  return (
    <Grid container spacing={3} justifyContent="center">
      {filtered.slice(0, visibleCount).map((t) => (
        <Grid item key={t.id} xs={12} sm={6} md={4}>
          <TeacherCard
            t={t}
            showMoreBio={showMoreBio[t.id]}
            toggleBio={() => toggleBio(t.id)}
            showMoreSubjects={showMoreSubjects[t.id]}
            toggleSubjects={() => toggleSubjects(t.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
}
