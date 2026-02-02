
const BASE_URL = "http://localhost:5000/api";

async function verifyFriendNotifications() {
    try {
        console.log("1. Registering User A...");
        const userA = await registerUser("User A");
        console.log("User A ID:", userA._id);

        console.log("2. Registering User B...");
        const userB = await registerUser("User B");
        console.log("User B ID:", userB._id);

        console.log("3. User A sends Friend Request to User B...");
        await sendFriendRequest(userA.token, userB._id);

        console.log("4. Checking User B's notifications (Expect: Friend Request)...");
        const notifsB = await getNotifications(userB.token);
        const requestNotif = notifsB.find(n => n.type === "friend_request" && n.relatedId === userA._id);

        if (requestNotif) {
            console.log("✅ SUCCESS: User B received friend request notification!");
        } else {
            console.log("❌ FAILURE: User B did NOT receive notification.");
            console.log("Actual Notifs:", notifsB);
        }

        console.log("5. User B accepts Friend Request...");
        await acceptFriendRequest(userB.token, userA._id);

        console.log("6. Checking User A's notifications (Expect: Acceptance)...");
        const notifsA = await getNotifications(userA.token);
        const acceptNotif = notifsA.find(n => n.type === "system" && n.message.includes("accepted")); // or check relatedId if logic allows

        if (acceptNotif) {
            console.log("✅ SUCCESS: User A received acceptance notification!");
            console.log("   -> Related User Name:", acceptNotif.relatedId?.name);
            console.log("   -> Related User Pic:", acceptNotif.relatedId?.profilePic);
            if (acceptNotif.relatedId?.name) {
                console.log("✅ SUCCESS: relatedId is populated!");
            } else {
                console.log("❌ FAILURE: relatedId is NOT populated.");
            }
        } else {
            console.log("❌ FAILURE: User A did NOT receive acceptance notification.");
            console.log("Actual Notifs:", notifsA);
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

async function registerUser(name) {
    const email = `test_${name.replace(/\s/g, '')}_${Date.now()}@example.com`;
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: "password123" }),
    });
    if (!res.ok) throw new Error(`Register failed for ${name}: ${await res.text()}`);
    return res.json();
}

async function sendFriendRequest(token, recipientId) {
    const res = await fetch(`${BASE_URL}/friends/send/${recipientId}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Send Request failed: ${await res.text()}`);
    return res.json();
}

async function acceptFriendRequest(token, requesterId) {
    const res = await fetch(`${BASE_URL}/friends/accept/${requesterId}`, {
        method: "POST", // Changed from PUT to POST
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Accept Request failed: ${await res.text()}`);
    return res.json();
}

async function getNotifications(token) {
    const res = await fetch(`${BASE_URL}/notifications`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Get Notifications failed: ${await res.text()}`);
    return res.json();
}

verifyFriendNotifications();
