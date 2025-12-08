// Test the API directly

async function testAPI() {
  try {
    // Test without filters
    console.log('Testing API without filters...');
    const response1 = await fetch('http://localhost:3000/api/projects');
    const data1 = await response1.json();
    console.log('No filters response:', JSON.stringify(data1, null, 2));
    
    // Test with phase filter
    console.log('\nTesting API with phase=current...');
    const response2 = await fetch('http://localhost:3000/api/projects?phase=current');
    const data2 = await response2.json();
    console.log('With phase=current:', JSON.stringify(data2, null, 2));
    
    // Test with archived=false
    console.log('\nTesting API with archived=false...');
    const response3 = await fetch('http://localhost:3000/api/projects?archived=false');
    const data3 = await response3.json();
    console.log('With archived=false:', JSON.stringify(data3, null, 2));
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();