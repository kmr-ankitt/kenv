import { getToken } from "./token";

export const getSecretbyId = async (id: number) => {
  const token = getToken();

  const res = await fetch(`http://localhost:8000/secret/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch secret");
  }

  return res.json();
}


export const getSecret = async () => {
  try {
    const token = getToken();

    const res = await fetch("http://localhost:8000/secret/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch secrets");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching secrets:", error);
  }
};

export const deleteSecret = async (id: number) => {
  try {
    const token = getToken();

    const res = await fetch(`http://localhost:8000/secret/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete secret");
    }

    return res.json();
  } catch (error) {
    console.error("Error deleting secret:", error);
  }
}