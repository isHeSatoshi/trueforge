/** Bounded label for which outbound undici pool served the call. */
export type OutboundHttpPool = 'generic' | 'model' | 'mcp';

/** Transport result. HTTP status is a separate status-class label. */
export type OutboundHttpOutcome = 'success' | 'error' | 'timeout' | 'blocked';

/** Response status grouped so a scrape cannot grow a series per status code. `none` means no response. */
export type OutboundHttpStatusClass = '2xx' | '3xx' | '4xx' | '5xx' | 'none';

/**
 * Server-owned operation metrics. Core times work and reports outcomes; it does not
 * import a metrics client. Callers that are not recording use the noop.
 */
export interface OperationMetrics {
  recordOutboundHttpRequest(options: {
    pool: OutboundHttpPool;
    outcome: OutboundHttpOutcome;
    statusClass: OutboundHttpStatusClass;
    durationSeconds: number;
  }): void;
}

export const NOOP_OPERATION_METRICS: OperationMetrics = {
  recordOutboundHttpRequest(): void {
    /* no-op */
  },
};

/** Maps an HTTP status onto the shared status-class label. Statuses outside 200-599 are `none`. */
export function outboundHttpStatusClass(status: number): OutboundHttpStatusClass {
  if (status >= 200 && status < 300) {
    return '2xx';
  }
  if (status >= 300 && status < 400) {
    return '3xx';
  }
  if (status >= 400 && status < 500) {
    return '4xx';
  }
  if (status >= 500 && status < 600) {
    return '5xx';
  }
  return 'none';
}

/** Seconds since a `performance.now()` reading. */
export function elapsedSeconds(startedMs: number): number {
  return (performance.now() - startedMs) / 1000;
}
