const BASE_URL = "http://127.0.0.1:8000";

export const getUserType = async (data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("ML API Error:", error);
  }
};