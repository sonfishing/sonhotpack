import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, User } from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App safely to prevent multiple instances
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/spreadsheets");

// Helper to check if Google Auth is logged in
export const googleSignInForSheets = async (): Promise<string | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to retrieve access token from Google Auth");
    }
    
    // Save token and state to localStorage for persistence
    localStorage.setItem("son_google_token", credential.accessToken);
    localStorage.setItem("son_google_token_time", Date.now().toString());
    localStorage.setItem("son_user_info", JSON.stringify({
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
    }));
    return credential.accessToken;
  } catch (error) {
    console.error("Sheets sign-in error:", error);
    throw error;
  }
};

export const getStoredAccessToken = (): string | null => {
  const token = localStorage.getItem("son_google_token");
  const timeStr = localStorage.getItem("son_google_token_time");
  if (!token || !timeStr) return null;
  
  // Google tokens typically expire in 1 hour (3600 seconds)
  // We consider it expired if it's older than 50 minutes to stay on the safe side
  const ageInMs = Date.now() - parseInt(timeStr, 10);
  if (ageInMs > 50 * 60 * 1000) {
    localStorage.removeItem("son_google_token");
    localStorage.removeItem("son_google_token_time");
    return null;
  }
  return token;
};

export const fetchUserInfo = () => {
  try {
    const info = localStorage.getItem("son_user_info");
    return info ? JSON.parse(info) : null;
  } catch {
    return null;
  }
};

// Create a new Spreadsheet and initialize its header row
export const createInquirySpreadsheet = async (accessToken: string): Promise<string> => {
  const response = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        title: "손일병 핫팩 대량구매 견적문의 내역",
      },
      sheets: [
        {
          properties: {
            title: "문의내역",
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to create spreadsheet");
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  localStorage.setItem("son_spreadsheet_id", spreadsheetId);
  
  // Populate the first row with human-readable headers
  await appendRowToSpreadsheet(spreadsheetId, accessToken, "문의내역!A1", [
    "접수번호",
    "이름/소속",
    "이메일",
    "전화번호",
    "제품명",
    "요청수량(개)",
    "문의사항",
    "접수상태",
    "접수일시",
    "조율 비고록",
  ]);

  return spreadsheetId;
};

// Append a row of inquiry data to the spreadsheet
export const appendRowToSpreadsheet = async (
  spreadsheetId: string,
  accessToken: string,
  range: string,
  rowValues: any[]
): Promise<any> => {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        values: [rowValues],
      }),
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || "Failed to append row");
  }

  return await response.json();
};

export const logoutGoogleSheets = () => {
  localStorage.removeItem("son_google_token");
  localStorage.removeItem("son_google_token_time");
  localStorage.removeItem("son_user_info");
  signOut(auth);
};
