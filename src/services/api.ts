export const getPrediction = async (amount: number) => {
  const res = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount,   // ✅ THIS IS THE FIX
    }),
  });

  const data = await res.json();
  return data;
};