export interface Entry {
  id: string;
  created_at: string;
  user_id: string;
  content: string;
  productivity_score: number | null;
  key_accomplishments: string[] | null;
  areas_for_improvement: string[] | null;
  actionable_tips: string[] | null;
}

export type NewEntry = Pick<Entry, 'content' | 'user_id'>;
