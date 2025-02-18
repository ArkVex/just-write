export interface Entry {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

export type NewEntry = Pick<Entry, 'content' | 'user_id'>;
