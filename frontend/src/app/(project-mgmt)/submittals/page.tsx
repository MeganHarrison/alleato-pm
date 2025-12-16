import { createClient } from '@/lib/supabase/server';
import { SubmittalsClient } from './submittals-client';
import type { Database } from '@/types/database.types';

type SubmittalRow = Database['public']['Tables']['submittals']['Row'];

export default async function SubmittalsPage() {
  const supabase = await createClient();
  
  // Fetch submittals data
  const { data: submittals, error } = await supabase
    .from('submittals')
    .select(`
      *,
      projects (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching submittals:', error);
    return <div>Error loading submittals</div>;
  }

  return <SubmittalsClient submittals={submittals || []} />;
}
