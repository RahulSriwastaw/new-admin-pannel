// CATEGORY CREATE BUTTON DEBUG SCRIPT
// Open browser DevTools (F12) and paste this in Console to debug

// Test 1: Check if category data is ready
console.log('=== CATEGORY DEBUG START ===');

// Check button element
const createBtn = Array.from(document.querySelectorAll('button'))
    .find(btn => btn.textContent.includes('Create') || btn.textContent.includes('Update'));
console.log('✅ Create button found:', createBtn);
console.log('❓ Button disabled?', createBtn?.disabled);
console.log('📝 Button classes:', createBtn?.className);

// Test 2: Manual API call to create category
async function testCategoryCreate() {
    const API_URL = 'http://localhost:5000/api/admin/categories/';

    const testData = {
        name: 'Test Category',
        subCategories: ['Test Sub'],
        icon: '',
        description: 'Test description',
        isActive: true,
        order: 0
    };

    console.log('🔵 Testing API call to:', API_URL);
    console.log('📤 Sending data:', testData);

    try {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        console.log('🔑 Token found:', token ? 'Yes ✅' : 'No ❌');

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(testData)
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        const data = await response.json();
        console.log('📥 Response data:', data);

        if (response.ok) {
            console.log('✅ SUCCESS! Category created');
        } else {
            console.error('❌ FAILED:', data);
        }
    } catch (error) {
        console.error('❌ Network Error:', error);
    }
}

// Test 3: Check network tab
console.log('📌 Steps to debug:');
console.log('1. Open Network tab in DevTools');
console.log('2. Click Create button');
console.log('3. Watch for API calls');
console.log('4. Check if POST request is made');
console.log('5. If no request, there is a JavaScript error');
console.log('6. If request fails, check response');

// Test 4: Run manual test
console.log('\n🧪 To test manually, run: testCategoryCreate()');

console.log('=== CATEGORY DEBUG END ===');
