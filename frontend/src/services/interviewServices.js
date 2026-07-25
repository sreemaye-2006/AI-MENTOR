import api from "./api";

export const startInterview = () =>
  api.post("/interview/start");

export const submitAnswer = (data) =>
  api.post("/interview/answer", data);

export const getHistory = () =>
  api.get("/interview/history");

export const getInterview = (id) =>
  api.get(`/interview/${id}`);