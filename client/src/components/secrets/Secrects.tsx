"use client"

import { useEffect, useState } from "react"

type Secret = {
  id: number;
  name: string;
  value: string;
  expires_at: string;
};

export default function Secrects() {
  const [secrets, setSecrets] = useState<Secret[]>([]);

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];
  if (!token) {
    throw new Error("Authentication token not found");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
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

        const data = await res.json();
        setSecrets(data.secrets);
      } catch (error) {
        console.error("Error fetching secrets:", error);
      }
    };
    fetchData();
  }, [token]);

  console.log(secrets);

  return (
    <div className="flex flex-wrap gap-5 justify-center p-5">
      {secrets.map((secret) => (
      <div
        key={secret.id}
        className="border border-gray-300 rounded-lg shadow-md p-5 w-72 bg-white transform transition-transform duration-200 hover:scale-105"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{secret.name}</h3>
        <p className="text-gray-600 mb-1">
        <strong>Value:</strong> {secret.value}
        </p>
        <p className="text-gray-600">
        <strong>Expires At:</strong> {new Date(secret.expires_at).toLocaleString()}
        </p>
      </div>
      ))}
    </div>
  )
}
