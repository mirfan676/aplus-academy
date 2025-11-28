// teacherUtils.js

export const mapTutor = (t, index) => ({
  id: index,
  name: t["Name"] || "Unknown",
  subjects: Array.isArray(t["Subjects"]) ? t["Subjects"] : [],
  qualification: t["Qualification"] || "",
  experience: t["Experience"] || "",
  city: t["District"] ? String(t["District"]) : "",
  bio: t["Bio"] || "",
  price: t["Price"] || "Rs 2000",
  thumbnail: t["Thumbnail"] || "",
  lat: isNaN(parseFloat(t["Latitude"])) ? 31.5204 : parseFloat(t["Latitude"]),
  lng: isNaN(parseFloat(t["Longitude"])) ? 74.3587 : parseFloat(t["Longitude"]),
  verified: t["Verified"]?.trim(),
});

export const filterTeachers = (teachers, city, subject, userLocation) => {
  let list = [...teachers];

  if (city) list = list.filter(t => t.city.toLowerCase() === city.toLowerCase());
  if (subject) list = list.filter(t => t.subjects.includes(subject));

  list.sort((a, b) =>
    Math.hypot(a.lat - userLocation[0], a.lng - userLocation[1]) -
    Math.hypot(b.lat - userLocation[0], b.lng - userLocation[1])
  );

  return list;
};
