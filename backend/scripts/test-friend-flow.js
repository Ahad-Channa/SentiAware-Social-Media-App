import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const createAxiosInstance = (token) => {
    return axios.create({
        baseURL: API_URL,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

const runPerformanceTest = async () => {
    console.log("🚀 Starting Friend Flow Performance Test...");
    const startTime = Date.now();
    const users = [];

    try {
        // 1. Create 5 test users
        console.log("\n👤 Creating 5 test users...");
        for (let i = 1; i <= 5; i++) {
            const userData = {
                name: `Test User ${i}_${Date.now()}`,
                email: `testuser${i}_${Date.now()}@example.com`,
                password: 'password123',
                // Adding arbitrary location/bio if required by schema, though usually optional
                location: 'Test City',
                bio: 'Automation tester'
            };

            const regStart = Date.now();
            const res = await axios.post(`${API_URL}/auth/register`, userData);
            const token = res.data.token;
            const regTime = Date.now() - regStart;

            users.push({ ...res.data.user, token });
            console.log(`✅ Created User ${i} in ${regTime}ms`);
        }

        const user1 = users[0];
        const api1 = createAxiosInstance(user1.token);

        // 2. User 1 sends friend requests to User 2, 3, 4, 5
        console.log("\n📤 Sending Friend Requests from User 1 to others...");
        for (let i = 1; i < users.length; i++) {
            const targetUser = users[i];
            const reqStart = Date.now();
            await api1.post(`/friends/request/${targetUser._id}`);
            const reqTime = Date.now() - reqStart;
            console.log(`✅ Sent request to User ${i + 1} in ${reqTime}ms`);
        }

        // 3. User 2, 3, 4, 5 accept the friend requests
        console.log("\n🤝 Accepting Friend Requests...");
        for (let i = 1; i < users.length; i++) {
            const targetUser = users[i];
            const apiTarget = createAxiosInstance(targetUser.token);

            const accStart = Date.now();
            await apiTarget.post(`/friends/accept/${user1._id}`);
            const accTime = Date.now() - accStart;
            console.log(`✅ User ${i + 1} accepted request in ${accTime}ms`);
        }

        const totalTime = Date.now() - startTime;
        console.log(`\n🎉 Test Completed Successfully!`);
        console.log(`⏱️  Total Time Taken: ${totalTime}ms`);

        if (totalTime < 2000) {
            console.log("⚡ The API is performing very well (Fast).");
        } else if (totalTime < 5000) {
            console.log("🟡 The API is performing adequately, but could be optimized.");
        } else {
            console.log("🔴 The API is slow. Consider adding indexes to the database or checking for bottlenecks.");
        }

    } catch (error) {
        console.error("\n❌ Test Failed!");
        console.error(error.response?.data?.message || error.message);
    }
};

runPerformanceTest();
