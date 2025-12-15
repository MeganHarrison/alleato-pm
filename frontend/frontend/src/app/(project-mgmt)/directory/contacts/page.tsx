import { createClient } from '@/lib/supabase/server';
import { ContactsDataTable } from '@/components/tables/contacts-data-table';

export default async function ContactsPage() {
  const supabase = await createClient();
  
  // Fetch contacts with company data
  const { data: contacts, error } = await supabase
    .from('contacts')
    .select(`
      *,
      company:companies(*)
    `)
    .order('last_name', { ascending: true });

  if (error) {
    console.error('Error fetching contacts:', error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error Loading Contacts</h1>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ContactsDataTable contacts={contacts || []} />
    </div>
  );
}
