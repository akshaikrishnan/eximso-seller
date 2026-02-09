import fs from 'fs';
import path from 'path';

/**
 * Sends an agent/audit log to:
 * - a local NDJSON file used by this debug session, and
 * - an optional remote ingest endpoint (behind env flags).
 */
export async function sendAgentLog(payload: {
  id: string;
  runId: string;
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, any>;
  timestamp: number;
}): Promise<void> {
  // Always write to local debug file for runtime evidence
  try {
    const debugFilePath = path.join('d:\\EXIMSO\\Eximos\\.cursor', 'debug.log');
    fs.appendFileSync(debugFilePath, JSON.stringify(payload) + '\n');
  } catch {
    // Ignore local logging failures – non-critical
  }

  // Optional remote ingest (safe for production behind flags)
  const isEnabled = process.env.ENABLE_INGEST_LOGGING === 'true';
  if (!isEnabled) return;

  const ingestUrl = process.env.INGEST_URL;
  const ingestUUID = process.env.INGEST_UUID;

  if (!ingestUrl || !ingestUUID) {
    console.error(
      '[DEBUG] Ingest logging enabled but INGEST_URL or INGEST_UUID not configured'
    );
    return;
  }

  try {
    const fullUrl = `${ingestUrl}/ingest/${ingestUUID}`;
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(
        `[DEBUG] Ingest log failed with status ${response.status}: ${response.statusText}`
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[DEBUG] Failed to send agent log: ${errorMessage}`, {
      location: payload.location,
      timestamp: payload.timestamp,
    });
  }
}

export function generateLogId(): string {
  return `log_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function sanitizeErrorForLogging(error: Error): {
  type: string;
  cid: string;
} {
  return {
    type: error.name || 'Unknown',
    cid: `ERR_${Date.now()}_${Math.random().toString(16).slice(2)}`,
  };
}

