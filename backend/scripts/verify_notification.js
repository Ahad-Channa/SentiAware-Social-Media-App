// Using global fetch for Node 18+

const BASE_URL = "http://127.0.0.1:5000/api";

async function verify() {
    const email = `testuser_${Date.now()}@example.com`;
    const password = "Password@123";
    const name = "Test User";
    const gender = "boy";

    console.log(`1. Registering user: ${email}...`);

    // Register (bypassing OTP for simplicity if possible, but authController requires OTP flow for 'register-init' then 'verify' usually, OR 'register' direct route if active.
    // We saw 'register' route calls 'registerUser' which does direct creation. Let's use that.

    try {
        const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, gender }),
        });

        const userData = await registerResponse.json();

        if (!registerResponse.ok) {
            throw new Error(`Registration failed: ${userData.message}`);
        }

        console.log("Registration successful. User ID:", userData._id);
        const token = userData.token;

        console.log("2. Fetching notifications...");
        const notifResponse = await fetch(`${BASE_URL}/notifications`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        const notifications = await notifResponse.json();

        if (!notifResponse.ok) {
            throw new Error(`Fetch notifications failed: ${notifications.message}`);
        }

        console.log("Notifications received:", notifications);

        const welcomeNotif = notifications.find(n => n.type === "system" && n.message.includes("Welcome"));

        if (welcomeNotif) {
            console.log("✅ SUCCESS: Welcome notification found!");
        } else {
            console.log("❌ FAILURE: Welcome notification NOT found.");
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

verify();
