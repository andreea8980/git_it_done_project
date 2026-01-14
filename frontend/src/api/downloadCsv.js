export async function downloadCsv(urlPath, filename = "export.csv") {
  const token = localStorage.getItem("token");
  const url = `/api${urlPath}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const raw = await res.text();
    let msg = `Eroare export CSV (${res.status})`;

    try {
      const data = JSON.parse(raw);
      if (data?.message) msg = data.message;
      else if (data?.error) msg = data.error;
    } catch {
      if (raw && raw.trim()) {
        msg = raw.replace(/<[^>]*>/g, "").trim().slice(0, 180) || msg;
      }
    }

    throw new Error(msg);
  }

  const blob = await res.blob();

  const link = document.createElement("a");
  const objectUrl = window.URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}
