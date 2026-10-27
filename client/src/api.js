// Made by SARVESH CHONDE

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// sends a request to the server and returns the JSON reply
// throws an Error with a readable message (and the HTTP status) if the server is down or the request failed
export const request = async (path, method = "GET", body) => {

  let res;
  try {
    res = await fetch(API + path, {
      method: method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error("Could not reach the server at " + API + ". Is it running?");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error((data && data.msg) || "Request failed (" + res.status + ")");
    error.status = res.status;
    throw error;
  }

  return data;
}

// today's date as YYYY-MM-DD in local time, to compare with the date inputs
// (toISOString() gives the UTC date, which is the wrong day for part of the day outside UTC)
export const todayString = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return now.getFullYear() + "-" + month + "-" + day;
}

export default API;
