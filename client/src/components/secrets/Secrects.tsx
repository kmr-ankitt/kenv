"use client"

import { EyeClosed } from "lucide-react";
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
    <div className="flex flex-col items-center gap-2">
      {secrets.map((secret) => (
        <div
          key={secret.id}
          className="border border-gray-300 rounded-lg shadow-lg p-4 bg-purple-50 w-full"
        >
          <h3 className="text-lg font-bold text-purple-700 mb-2">{secret.name}</h3>
          <p className="text-gray-700 mb-1 gap-0.5 flex items-center">
            <strong>Key:</strong>
            {secret.value}
            <span className="ml-1">
              <button className="flex items-center" >
                <EyeClosed size={16} />
              </button>
            </span>
          </p>
          <p className="text-gray-500 text-xs">
            <strong>Expires at:</strong> {new Date(secret.expires_at).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}
