"use client"

import { getAccessLog } from "@/utils/api"
import { useEffect, useState } from "react"
import { AnimatedButton } from "../AnimatedButton";

type Log = {
  id: number;
  user_id: number;
  secret_id: number;
  secret_name: string;
  action: string;
  timestamp: string;
};

export default function Logs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5; // Number of logs per page

  const getLogs = async () => {
    const res = await getAccessLog();
    if (res) {
      const sortedLogs = res.sort(
        (a: Log, b: Log) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLogs(sortedLogs);
    }
  };

  useEffect(() => {
    getLogs();
  }, []);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(logs.length / logsPerPage);

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
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2 w-full">
        {currentLogs.map((log) => (
          <div
            key={log.id}
            className="border border-gray-300 rounded-lg shadow-lg p-4 bg-purple-50 w-full"
          >
            <p className="text-purple-700 mb-1 gap-0.5 flex items-center">
              <strong>Secret Name:</strong> {log.secret_name}
            </p>
            <p className="text-gray-700 mb-1 gap-0.5 flex items-center">
              <strong>Action:</strong> {log.action}
            </p>
            <p className="text-gray-500 text-xs">
              <strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
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
