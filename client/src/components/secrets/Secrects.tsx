"use client"

import { deleteSecret, getSecret, getSecretbyId } from "@/utils/api";
import { getToken } from "@/utils/token";
import { Trash, Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react"
import { AnimatedButton } from "../AnimatedButton";

type Secret = {
  id: number;
  name: string;
  value: string;
  expires_at: string;
};

export default function Secrects() {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [visibleSecretId, setVisibleSecretId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5; // Number of logs per page

  const token = getToken();

  useEffect(() => {
    const fetchSecrets = async () => {
      try {
        const secret = await getSecret();
        // Sort secrets by `expires_at` in descending order (latest first)
        const sortedSecrets = secret.secrets.sort(
          (a: Secret, b: Secret) => b.id - a.id
        );
        setSecrets(sortedSecrets);
      } catch (error) {
        console.error("Failed to fetch secrets:", error);
      }
    };

    fetchSecrets();

    // Cleanup function to avoid memory leaks
    return () => {
      setSecrets([]);
    };
  }, [token]);

  const exportSecret = async (id: number) => {
    try {
      const res = await getSecretbyId(id);
      setSecrets((prevSecrets) =>
        prevSecrets.map((secret) =>
          secret.id === id ? { ...secret, value: res.value } : secret
        )
      );
      setVisibleSecretId(id);
    } catch (error) {
      console.error("Failed to export secret:", error);
    }
  };

  const deleteCurrentSecret = async (id: number) => {
    try {
      await deleteSecret(id);
      setSecrets((prevSecrets) =>
        prevSecrets.filter((secret) => secret.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete secret:", error);
    }
  };

  console.log(secrets);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = secrets.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(secrets.length / logsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <div className="flex flex-col items-center gap-2">
      {currentLogs.map((secret) => (
        <div
          key={secret.id}
          className="border border-gray-300 rounded-lg shadow-lg p-4 bg-purple-50 w-full"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-purple-700">{secret.name}</h3>
            <button onClick={() => deleteCurrentSecret(secret.id)}>
              <Trash size={16} className="text-red-500" />
            </button>
          </div>
          <p className="text-gray-700 mb-1 gap-0.5 flex items-center">
            {visibleSecretId === secret.id ? (
              <>
                <strong>Key:</strong> {secret.value}
                <span className="ml-1">
                  <button
                    className="flex items-center"
                    onClick={() => setVisibleSecretId(null)}
                  >
                    <Eye size={16} />
                  </button>
                </span>
              </>
            ) : (
              <>
                <strong>Key: </strong> *********
                <span className="ml-1">
                  <button
                    className="flex items-center"
                    onClick={() => exportSecret(secret.id)}
                  >
                    <EyeClosed size={16} />
                  </button>
                </span>
              </>
            )}
          </p>
          <p className="text-gray-500 text-xs">
            <strong>Expires at:</strong> {new Date(secret.expires_at).toLocaleDateString()}
          </p>
        </div>
      ))}
      <div className="flex justify-between items-center w-full max-w-md">
        <AnimatedButton 
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          value="<<"
        />
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <AnimatedButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          value=">>"
        />
      </div>
    </div>
  );
}