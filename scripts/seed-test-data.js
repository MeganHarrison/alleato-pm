const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Simplified test data for consistency
const testData = {
  companies: [
    { name: 'ABC Construction', address: '123 Main St', city: 'New York', state: 'NY' },
    { name: 'XYZ Contractors', address: '456 Oak Ave', city: 'Los Angeles', state: 'CA' },
    { name: 'BuildRight Inc', address: '789 Pine St', city: 'Chicago', state: 'IL' },
    { name: 'ProBuild Services', address: '321 Elm St', city: 'Houston', state: 'TX' },
    { name: 'Quality Builders', address: '555 Cedar Rd', city: 'Phoenix', state: 'AZ' }
  ],
  
  projects: [
    {
      name: 'Downtown Office Complex',
      'job number': 'JOB-1001',
      description: 'Modern 20-story office building with retail space',
      state: 'active',
      'start date': '2024-01-15',
      budget: 25000000
    },
    {
      name: 'Riverside Shopping Mall',
      'job number': 'JOB-1002',
      description: 'Large retail complex with parking structure',
      state: 'active',
      'start date': '2024-02-01',
      budget: 15000000
    },
    {
      name: 'Medical Center Expansion',
      'job number': 'JOB-1003',
      description: 'New wing addition to existing hospital',
      state: 'planning',
      'start date': '2024-06-01',
      budget: 30000000
    },
    {
      name: 'Tech Campus Building A',
      'job number': 'JOB-1004',
      description: 'First phase of new technology campus',
      state: 'active',
      'start date': '2024-03-15',
      budget: 18000000
    },
    {
      name: 'Residential Tower North',
      'job number': 'JOB-1005',
      description: 'Luxury residential high-rise development',
      state: 'active',
      'start date': '2024-04-01',
      budget: 22000000
    }
  ],
  
  contacts: [
    { first_name: 'John', last_name: 'Smith', email: 'john.smith@example.com', department: 'Engineering' },
    { first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com', department: 'Project Management' },
    { first_name: 'Mike', last_name: 'Johnson', email: 'mike.johnson@example.com', department: 'Accounting' },
    { first_name: 'Sarah', last_name: 'Williams', email: 'sarah.williams@example.com', department: 'Operations' },
    { first_name: 'Tom', last_name: 'Brown', email: 'tom.brown@example.com', department: 'Safety' }
  ]
};

async function seedBasicTestData() {
  console.log('🌱 Seeding basic test data...\n');
  
  try {
    // 1. Insert companies
    console.log('Creating companies...');
    const { data: companies, error: compError } = await supabase
      .from('companies')
      .insert(testData.companies)
      .select();
    
    if (compError) {
      console.log('⚠️  Companies might already exist:', compError.message);
    } else {
      console.log(`✅ Created ${companies.length} companies`);
    }
    
    // 2. Insert projects
    console.log('\nCreating projects...');
    const { data: projects, error: projError } = await supabase
      .from('projects')
      .insert(testData.projects)
      .select();
    
    if (projError) {
      console.log('⚠️  Projects might already exist:', projError.message);
    } else {
      console.log(`✅ Created ${projects.length} projects`);
    }
    
    // 3. Insert contacts
    console.log('\nCreating contacts...');
    const { data: contacts, error: contError } = await supabase
      .from('contacts')
      .insert(testData.contacts)
      .select();
    
    if (contError) {
      console.log('⚠️  Contacts might already exist:', contError.message);
    } else {
      console.log(`✅ Created ${contacts.length} contacts`);
    }
    
    // 4. Create some commitments if projects were created
    if (projects && projects.length > 0) {
      console.log('\nCreating sample commitments...');
      const commitments = [
        {
          project_id: projects[0].id,
          type: 'contract',
          title: 'General Contractor Agreement',
          vendor_name: 'ABC Construction',
          amount: 5000000,
          status: 'approved'
        },
        {
          project_id: projects[0].id,
          type: 'purchase_order',
          title: 'Steel Materials Order',
          vendor_name: 'XYZ Suppliers',
          amount: 250000,
          status: 'pending'
        },
        {
          project_id: projects[1].id,
          type: 'subcontract',
          title: 'Electrical Installation',
          vendor_name: 'ProElectric Inc',
          amount: 800000,
          status: 'approved'
        }
      ];
      
      const { data: comms, error: commError } = await supabase
        .from('commitments')
        .insert(commitments)
        .select();
      
      if (commError) {
        console.log('⚠️  Could not create commitments:', commError.message);
      } else {
        console.log(`✅ Created ${comms.length} sample commitments`);
      }
    }
    
    console.log('\n🎉 Test data seeding completed!\n');
    console.log('You can now run tests with consistent data.');
    
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
    process.exit(1);
  }
}

// Run the seeding
seedBasicTestData();