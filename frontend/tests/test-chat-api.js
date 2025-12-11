// Test the Chat API with risk queries

async function testChatAPI() {
  const baseUrl = process.env.BASE_URL || 'http://localhost:3003';

  try {
    console.log('Testing Chat API...\n');

    // Test 1: Risk query
    console.log('Test 1: Asking about company risks...');
    const response1 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What are the biggest risks in the company?' }),
    });

    if (!response1.ok) {
      console.log('Response status:', response1.status);
      const errorText = await response1.text();
      console.log('Error response:', errorText);
      return;
    }

    const data1 = await response1.json();
    console.log('\n=== RISK QUERY RESPONSE ===');
    console.log('Response:', data1.response?.substring(0, 500) + '...');
    console.log('\nRetrieved documents:', data1.retrieved?.length || 0);
    console.log('Insights:', {
      risks: data1.insights?.risks?.length || 0,
      decisions: data1.insights?.decisions?.length || 0,
      tasks: data1.insights?.tasks?.length || 0,
      opportunities: data1.insights?.opportunities?.length || 0,
    });
    if (data1.error) console.log('Errors:', data1.error);

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Decision query
    console.log('Test 2: Asking about recent decisions...');
    const response2 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What decisions have been made recently?' }),
    });

    const data2 = await response2.json();
    console.log('\n=== DECISION QUERY RESPONSE ===');
    console.log('Response:', data2.response?.substring(0, 500) + '...');
    console.log('Insights:', {
      risks: data2.insights?.risks?.length || 0,
      decisions: data2.insights?.decisions?.length || 0,
      tasks: data2.insights?.tasks?.length || 0,
      opportunities: data2.insights?.opportunities?.length || 0,
    });

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Task/action item query
    console.log('Test 3: Asking about pending tasks...');
    const response3 = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'What tasks or action items are pending?' }),
    });

    const data3 = await response3.json();
    console.log('\n=== TASK QUERY RESPONSE ===');
    console.log('Response:', data3.response?.substring(0, 500) + '...');
    console.log('Insights:', {
      risks: data3.insights?.risks?.length || 0,
      decisions: data3.insights?.decisions?.length || 0,
      tasks: data3.insights?.tasks?.length || 0,
      opportunities: data3.insights?.opportunities?.length || 0,
    });

    console.log('\n=== TESTS COMPLETE ===');

  } catch (error) {
    console.error('Test error:', error);
  }
}

testChatAPI();
