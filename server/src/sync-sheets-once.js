import "dotenv/config";
import { syncPendingToSheets } from "./sheets.js";

const result = await syncPendingToSheets();
console.log(JSON.stringify(result, null, 2));
