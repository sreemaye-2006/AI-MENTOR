import api from "./api";

export const generateRoadmap = () =>
  api.post("/roadmap/generate");

export const getRoadmap = () =>
  api.get("/roadmap");