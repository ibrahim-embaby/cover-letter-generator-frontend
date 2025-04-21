import { useEffect, useState } from "react";
import GoogleAuth from "../components/GoogleAuthButton";
import { readSheetData, updateSheetData } from "../utils/GoogleSheets";
import logo from "../assets/code-quest-logo.png";

// =========== CONFIGURE ADMIN EMAILS ===========
// List of admin email addresses authorized to approve or reject pending requests.
// IMPORTANT: Only add trusted emails with admin privileges.
const ADMIN_EMAILS = ["hemaembaby50@gmail.com"];

export default function RequestsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userEmail || !ADMIN_EMAILS.includes(userEmail)) return;
      setLoading(true);
      const sheetData = await readSheetData(token);
      setData(sheetData);
      setLoading(false);
    };
    fetchData();
  }, [token, userEmail]);

  const handleAccept = async (rowIndex: number) => {
    if (!token) return;

    const updatedRow = [...data[rowIndex]];
    updatedRow[updatedRow.length - 1] = "accepted";

    try {
      // Send data to n8n webhook
      // production link should be like this: http://localhost:5678/webhook/job-assistant
      await fetch("http://localhost:5678/webhook-test/job-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedRow[0],
          email: updatedRow[1],
          resume: updatedRow[2],
        }),
      });

      // Update Google Sheet
      await updateSheetData(token, rowIndex, updatedRow);

      // Optimistically update UI
      setData((prev) => {
        const newData = [...prev];
        newData[rowIndex] = updatedRow;
        return newData;
      });
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5E2DD] p-4">
      {!token ? (
        <div className="flex justify-center">
          <GoogleAuth
            onAuthSuccess={(accessToken, email) => {
              setToken(accessToken);
              setUserEmail(email);
            }}
          />
        </div>
      ) : ADMIN_EMAILS.includes(userEmail!) ? (
        <div className="flex flex-col items-center justify-start">
          <img src={logo} alt="" width={400} />
          <h1 className="font-bold mb-3">ALL REQUESTS</h1>
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
            {loading ? (
              <p>Loading...</p>
            ) : data.length > 1 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-[#F93A0B] text-white">
                      {data[0].map((col, index) =>
                        col.toLowerCase() !== "resume" ? (
                          <th
                            key={index}
                            className="border border-gray-300 px-4 py-2 text-left"
                          >
                            {col}
                          </th>
                        ) : null
                      )}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.slice(1)].reverse().map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="odd:bg-white even:bg-gray-50"
                      >
                        {row.map((cell, cellIndex) =>
                          data[0][cellIndex].toLowerCase() !== "resume" ? (
                            <td
                              key={cellIndex}
                              className="border border-gray-300 px-4 py-2"
                            >
                              {cell}
                            </td>
                          ) : null
                        )}
                        <td className="flex justify-center items-center border border-gray-300 px-4 py-2">
                          {row[row.length - 1] === "pending" ? (
                            <button
                              className="bg-green-600 text-white p-1 rounded-md"
                              onClick={() =>
                                handleAccept(data?.length - rowIndex - 1)
                              } // Adjust index for sheets
                            >
                              Accept
                            </button>
                          ) : (
                            <span className="text-gray-500">Accepted</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No Data</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-red-500 text-lg font-bold">
          Access Denied: You are not authorized to view this page.
        </p>
      )}
    </div>
  );
}
