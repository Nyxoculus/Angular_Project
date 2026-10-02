export interface LogEntry {
  id: number;
  timestamp: string;
  type: string;
  user: string;
  message: string;
  severity: string;
}

export interface LogStats {
  total: number;
  errors: number;
  warnings: number;
  topUser: string | null;
  perDay: Record<string, number>;
}
