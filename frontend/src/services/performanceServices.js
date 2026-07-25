import api from "./api";

export const generatePerformance = () =>
  api.post("/performance/generate");

export const getPerformance = () =>
  api.get("/performance");