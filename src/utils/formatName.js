export const formatName = (name) => {
  if (!name || typeof name !== "string") return "";
  return name.toLowerCase().replace(/\s/g, "_");
};
