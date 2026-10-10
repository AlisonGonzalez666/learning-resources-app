//Api usando mockapi.io

const API_URL = "https://6ac9bd863115bcc9581fecde.mockapi.io/gestorRecursos/v1/getRecurso";

export const getResources = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Error fetching resources");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createResource = async (resource) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resource),
  });
  if (!response.ok) throw new Error("Error creating resource");
  return await response.json();
};

export const updateResource = async (id, resource) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resource),
  });
  if (!response.ok) throw new Error("Error updating resource");
  return await response.json();
};

export const deleteResource = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error deleting resource");
  return await response.json();
};
