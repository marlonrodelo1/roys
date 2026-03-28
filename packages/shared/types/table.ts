export interface Table {
  id: string;
  restaurant_id: string;
  table_number: number;
  qr_code_url: string | null;
  is_active: boolean;
  current_session_id: string | null;
}

export type SessionStatus = 'active' | 'ordering' | 'confirmed' | 'closed';

export interface TableSession {
  id: string;
  table_id: string;
  restaurant_id: string;
  status: SessionStatus;
  started_at: string;
  closed_at: string | null;
}
