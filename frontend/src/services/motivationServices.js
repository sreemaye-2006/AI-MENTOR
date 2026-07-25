import api from "./api";

export const generateMotivation = () =>
  api.post("/motivation/generate");

export const getMotivation = () =>
  api.get("/motivation");