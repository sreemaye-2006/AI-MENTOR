import api from "./api";

export const generateStudyPlan = () =>
  api.post("/study/generate");

export const getStudyPlan = () =>
  api.get("/study");

export const markTaskComplete = (studyId, weekIndex, taskIndex) => 
  api.put(`/study/${studyId}/task`, { weekIndex, taskIndex });