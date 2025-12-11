import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test data generators
const generateCompany = () => ({
  name: faker.company.name(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  zip_code: faker.location.zipCode(),
  phone: faker.phone.number(),
  email: faker.internet.email(),
  website: faker.internet.url(),
  created_at: faker.date.past()
});

const generateProject = () => ({
  name: `${faker.commerce.department()} ${faker.company.buzzPhrase()} Project`,
  "job number": `JOB-${faker.number.int({ min: 1000, max: 9999 })}`,
  description: faker.lorem.paragraph(),
  state: faker.helpers.arrayElement(['active', 'planning', 'completed', 'on-hold']),
  "start date": faker.date.future().toISOString().split('T')[0],
  "end date": faker.date.future({ years: 2 }).toISOString().split('T')[0],
  budget: faker.number.int({ min: 100000, max: 10000000 }),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  state_location: faker.location.state({ abbreviated: true }),
  project_type: faker.helpers.arrayElement(['commercial', 'residential', 'industrial', 'infrastructure'])
});

const generateContact = () => ({
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  department: faker.helpers.arrayElement(['Engineering', 'Accounting', 'Operations', 'Project Management', 'Safety']),
  title: faker.person.jobTitle(),
  is_primary: faker.datatype.boolean()
});

const generateCommitment = (projectId: string) => ({
  project_id: projectId,
  type: faker.helpers.arrayElement(['contract', 'purchase_order', 'subcontract']),
  title: faker.commerce.productName() + ' Contract',
  vendor_name: faker.company.name(),
  amount: faker.number.int({ min: 10000, max: 500000 }),
  status: faker.helpers.arrayElement(['draft', 'pending', 'approved', 'executed']),
  start_date: faker.date.future().toISOString().split('T')[0],
  end_date: faker.date.future({ years: 1 }).toISOString().split('T')[0],
  description: faker.lorem.paragraph()
});

const generateInvoice = (commitmentId: string, projectId: string) => ({
  commitment_id: commitmentId,
  project_id: projectId,
  invoice_number: `INV-${faker.number.int({ min: 1000, max: 9999 })}`,
  amount: faker.number.int({ min: 1000, max: 50000 }),
  date: faker.date.recent().toISOString().split('T')[0],
  due_date: faker.date.future({ years: 0.1 }).toISOString().split('T')[0],
  status: faker.helpers.arrayElement(['draft', 'submitted', 'approved', 'paid']),
  description: faker.lorem.sentence()
});

const generateBudgetItem = (projectId: string) => ({
  project_id: projectId,
  cost_code: faker.number.int({ min: 1000, max: 9999 }).toString(),
  description: faker.commerce.productName(),
  original_budget: faker.number.int({ min: 10000, max: 200000 }),
  revised_budget: faker.number.int({ min: 10000, max: 200000 }),
  committed_cost: faker.number.int({ min: 5000, max: 150000 }),
  actual_cost: faker.number.int({ min: 1000, max: 100000 })
});

const generateChangeOrder = (projectId: string, commitmentId: string) => ({
  project_id: projectId,
  commitment_id: commitmentId,
  number: faker.number.int({ min: 1, max: 50 }),
  title: `Change Order - ${faker.commerce.productAdjective()}`,
  description: faker.lorem.paragraph(),
  amount: faker.number.int({ min: -50000, max: 50000 }),
  status: faker.helpers.arrayElement(['draft', 'pending', 'approved', 'rejected']),
  submitted_date: faker.date.recent().toISOString().split('T')[0]
});

// Seeding functions
async function clearTestData() {
  console.log('🧹 Clearing existing test data...');
  
  // Clear in reverse order of dependencies
  await supabase.from('invoices').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('change_orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('budget_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('commitments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('project_contacts').delete().neq('project_id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('contacts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('companies').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log('✅ Test data cleared');
}

async function seedTestData() {
  console.log('🌱 Starting test data seeding...');
  
  try {
    // 1. Create companies
    console.log('Creating companies...');
    const companies = Array.from({ length: 10 }, generateCompany);
    const { data: insertedCompanies, error: companiesError } = await supabase
      .from('companies')
      .insert(companies)
      .select();
    
    if (companiesError) throw companiesError;
    console.log(`✅ Created ${insertedCompanies?.length || 0} companies`);
    
    // 2. Create projects
    console.log('Creating projects...');
    const projects = Array.from({ length: 20 }, generateProject);
    const { data: insertedProjects, error: projectsError } = await supabase
      .from('projects')
      .insert(projects)
      .select();
    
    if (projectsError) throw projectsError;
    console.log(`✅ Created ${insertedProjects?.length || 0} projects`);
    
    // 3. Create contacts
    console.log('Creating contacts...');
    const contacts = Array.from({ length: 30 }, generateContact);
    const { data: insertedContacts, error: contactsError } = await supabase
      .from('contacts')
      .insert(contacts)
      .select();
    
    if (contactsError) throw contactsError;
    console.log(`✅ Created ${insertedContacts?.length || 0} contacts`);
    
    // 4. Create commitments for each project
    console.log('Creating commitments...');
    const commitments = insertedProjects?.flatMap(project => 
      Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => 
        generateCommitment(project.id)
      )
    ) || [];
    
    const { data: insertedCommitments, error: commitmentsError } = await supabase
      .from('commitments')
      .insert(commitments)
      .select();
    
    if (commitmentsError) throw commitmentsError;
    console.log(`✅ Created ${insertedCommitments?.length || 0} commitments`);
    
    // 5. Create invoices for commitments
    console.log('Creating invoices...');
    const invoices = insertedCommitments?.flatMap(commitment => 
      Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => 
        generateInvoice(commitment.id, commitment.project_id)
      )
    ) || [];
    
    const { data: insertedInvoices, error: invoicesError } = await supabase
      .from('invoices')
      .insert(invoices.slice(0, 50)) // Limit to 50 invoices
      .select();
    
    if (invoicesError) throw invoicesError;
    console.log(`✅ Created ${insertedInvoices?.length || 0} invoices`);
    
    // 6. Create budget items for projects
    console.log('Creating budget items...');
    const budgetItems = insertedProjects?.flatMap(project => 
      Array.from({ length: faker.number.int({ min: 5, max: 10 }) }, () => 
        generateBudgetItem(project.id)
      )
    ) || [];
    
    const { data: insertedBudgetItems, error: budgetError } = await supabase
      .from('budget_items')
      .insert(budgetItems.slice(0, 100)) // Limit to 100 budget items
      .select();
    
    if (budgetError) throw budgetError;
    console.log(`✅ Created ${insertedBudgetItems?.length || 0} budget items`);
    
    // 7. Create change orders
    console.log('Creating change orders...');
    const changeOrders = insertedCommitments?.slice(0, 20).map(commitment => 
      generateChangeOrder(commitment.project_id, commitment.id)
    ) || [];
    
    const { data: insertedChangeOrders, error: changeOrdersError } = await supabase
      .from('change_orders')
      .insert(changeOrders)
      .select();
    
    if (changeOrdersError) throw changeOrdersError;
    console.log(`✅ Created ${insertedChangeOrders?.length || 0} change orders`);
    
    console.log('\n🎉 Test data seeding completed successfully!');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`- Companies: ${insertedCompanies?.length || 0}`);
    console.log(`- Projects: ${insertedProjects?.length || 0}`);
    console.log(`- Contacts: ${insertedContacts?.length || 0}`);
    console.log(`- Commitments: ${insertedCommitments?.length || 0}`);
    console.log(`- Invoices: ${insertedInvoices?.length || 0}`);
    console.log(`- Budget Items: ${insertedBudgetItems?.length || 0}`);
    console.log(`- Change Orders: ${insertedChangeOrders?.length || 0}`);
    
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    throw error;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const shouldClear = args.includes('--clear');
  const onlyClean = args.includes('--clean');
  
  try {
    if (onlyClean) {
      await clearTestData();
      return;
    }
    
    if (shouldClear) {
      await clearTestData();
    }
    
    await seedTestData();
  } catch (error) {
    console.error('Failed to seed test data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { seedTestData, clearTestData };