'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

type Contact = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  project_id?: number;
  created_at: string;
  updated_at: string;
};

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [searchQuery]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/contacts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const result = await response.json();
      setContacts(result.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = () => {
    // Navigate to create contact form (to be implemented)
    console.log('Create contact');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your project contacts and team members</p>
        </div>
        <Button
          onClick={handleCreateContact}
          className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange-hover))] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search contacts by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="p-6 mb-6 bg-red-50 border-red-200">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchContacts} size="sm" className="mt-2">
            Retry
          </Button>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading contacts...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && contacts.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first contact'}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleCreateContact}
                className="bg-[hsl(var(--procore-orange))] hover:bg-[hsl(var(--procore-orange-hover))] text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Contacts Grid */}
      {!loading && !error && contacts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map((contact) => (
            <Card
              key={contact.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/contacts/${contact.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {contact.name}
                  </h3>
                  {contact.title && (
                    <p className="text-sm text-gray-600">{contact.title}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {contact.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.company && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{contact.company}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      {!loading && !error && contacts.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
