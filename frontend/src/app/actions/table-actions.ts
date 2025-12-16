'use server';

import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateTableRow(
  tableName: string,
  id: string | number,
  data: Record<string, any>,
  revalidatePaths?: string[]
) {
  try {
    const supabase = await createSupabaseClient();
    
    const { error } = await supabase
      .from(tableName)
      .update(data)
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }

    // Revalidate specified paths
    if (revalidatePaths) {
      revalidatePaths.forEach(path => revalidatePath(path));
    } else {
      // Default revalidation
      revalidatePath('/');
    }

    return { success: true };
  } catch (error) {
    return { error: 'Failed to update record' };
  }
}

export async function deleteTableRow(
  tableName: string,
  id: string | number,
  revalidatePaths?: string[]
) {
  try {
    const supabase = await createSupabaseClient();
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }

    // Revalidate specified paths
    if (revalidatePaths) {
      revalidatePaths.forEach(path => revalidatePath(path));
    } else {
      // Default revalidation
      revalidatePath('/');
    }

    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete record' };
  }
}

// Specific actions for different tables
export async function updateMeeting(id: string, data: Record<string, any>) {
  return updateTableRow('document_metadata', id, data, ['/meetings']);
}

export async function deleteMeeting(id: string) {
  return deleteTableRow('document_metadata', id, ['/meetings']);
}

export async function updateProject(id: string | number, data: Record<string, any>) {
  return updateTableRow('projects', id, data, ['/projects', '/']);
}

export async function deleteProject(id: string | number) {
  return deleteTableRow('projects', id, ['/projects', '/']);
}

export async function createCompany(data: Record<string, any>) {
  try {
    const supabase = await createSupabaseClient();

    const { data: company, error } = await supabase
      .from('companies')
      .insert(data)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/companies');
    revalidatePath('/directory/companies');
    return { success: true, data: company };
  } catch (error) {
    return { error: 'Failed to create company' };
  }
}

export async function updateCompany(id: string, data: Record<string, any>) {
  return updateTableRow('companies', id, data, ['/companies', '/directory/companies']);
}

export async function deleteCompany(id: string) {
  return deleteTableRow('companies', id, ['/companies', '/directory/companies']);
}

export async function createClient(data: Record<string, any>) {
  try {
    const supabase = await createSupabaseClient();

    const { data: client, error } = await supabase
      .from('clients')
      .insert(data)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath('/clients');
    revalidatePath('/directory/clients');
    return { success: true, data: client };
  } catch (error) {
    return { error: 'Failed to create client' };
  }
}

export async function updateClient(id: number, data: Record<string, any>) {
  return updateTableRow('clients', id, data, ['/clients', '/directory/clients']);
}

export async function deleteClient(id: number) {
  return deleteTableRow('clients', id, ['/clients', '/directory/clients']);
}