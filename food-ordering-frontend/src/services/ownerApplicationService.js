import api from "./api";

export const submitOwnerApplication = async (applicationData) => {
  const response = await api.post(
    "/owner-applications",
    applicationData
  );

  return response.data;
};

export const getMyOwnerApplication = async () => {
  const response = await api.get(
    "/owner-applications/my"
  );

  return response.data;
};