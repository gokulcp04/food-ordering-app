import api from "./api";

export const getOwnerApplications = async (status) => {
  const response = await api.get("/owner-applications", {
    params: status ? { status } : {},
  });

  return response.data;
};

export const approveOwnerApplication = async (
  applicationId,
  adminNote = ""
) => {
  const response = await api.patch(
    `/owner-applications/${applicationId}/approve`,
    {
      adminNote,
    }
  );

  return response.data;
};

export const rejectOwnerApplication = async (
  applicationId,
  adminNote = ""
) => {
  const response = await api.patch(
    `/owner-applications/${applicationId}/reject`,
    {
      adminNote,
    }
  );

  return response.data;
};