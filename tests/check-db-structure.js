const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lgveqfnpkxvzbnnwuled.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndmVxZm5wa3h2emJubnd1bGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNTQxNjYsImV4cCI6MjA3MDgzMDE2Nn0.g56kDPUokoJpWY7vXd3GTMXpOc4WFOU0hDVWfGMZtO8';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  try {
    // First, let's check what tables exist
    console.log('Checking available tables...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');
    
    if (tablesError) {
      console.log('Could not get tables list, trying direct query...');
    } else {
      console.log('Available tables:', tables);
    }
    
    // Check if the projects table exists and get its data
    console.log('\nChecking projects table...');
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5);
    
    if (projectsError) {
      console.error('Projects table error:', projectsError);
    } else {
      console.log('Projects data:', projects);
      console.log('Number of projects:', projects?.length || 0);
      
      // Show structure if we have data
      if (projects && projects.length > 0) {
        console.log('\nProjects table columns:', Object.keys(projects[0]));
      }
    }
    
    // Let's try the actual field names from the generated types we saw earlier
    console.log('\nTrying to insert with database.types.ts field names...');
    const { data: newProject, error: insertError } = await supabase
      .from('projects')
      .insert({
        name: 'Test Project from Node.js',
        'job number': 'TEST-' + Date.now(),
        description: 'Test project to verify database structure',
        state: 'active',
        'start date': new Date().toISOString(),
        budget: 1000000,
        phase: 'current',
        address: '123 Test Street, Test City'
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Insert error:', insertError);
      
      // Try minimal insert
      console.log('\nTrying minimal insert...');
      const { data: minimalProject, error: minimalError } = await supabase
        .from('projects')
        .insert({
          name: 'Minimal Test Project'
        })
        .select()
        .single();
        
      if (minimalError) {
        console.error('Minimal insert error:', minimalError);
      } else {
        console.log('Successfully inserted minimal project:', minimalProject);
      }
    } else {
      console.log('Successfully inserted:', newProject);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkDatabase();