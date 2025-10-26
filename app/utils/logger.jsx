export function logToLocalStorage(message, data) {
  const logs = JSON.parse(localStorage.getItem("debugLogs") || "[]");

  logs.push({
    message,
    data,
    time: new Date().toISOString(),
  });

  localStorage.setItem("debugLogs", JSON.stringify(logs));
  console.log(`[LOG] ${message}`, data);
}
