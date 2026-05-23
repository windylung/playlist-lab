export function checkApiKey(req) {
  const apiKey = process.env.SURVEY_API_KEY || "";
  if (!apiKey) {
    return { ok: false, status: 500, error: "server_misconfigured_api_key" };
  }

  const headerKey = req.headers["x-survey-api-key"] || "";
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : "";
  const cronSecret = process.env.CRON_SECRET || "";

  const valid =
    headerKey === apiKey ||
    bearer === apiKey ||
    (cronSecret && bearer === cronSecret);

  if (!valid) {
    return { ok: false, status: 401, error: "unauthorized" };
  }
  return { ok: true };
}
