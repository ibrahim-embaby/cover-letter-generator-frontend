const SHEET_ID = import.meta.env.VITE_REQUESTS_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

export const readSheetData = async (
  accessToken: string
): Promise<string[][]> => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A1:D10?key=${API_KEY}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await response.json();
  return data.values || [];
};

export const updateSheetData = async (
  accessToken: string,
  rowIndex: number,
  updatedRow: string[]
): Promise<void> => {
  const range = `Sheet1!A${rowIndex + 1}:D${rowIndex + 1}`;
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [updatedRow] }),
    }
  );
};
