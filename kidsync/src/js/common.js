const mockKids = [
    { id: 1, name: "Daudi Okelo", age: 5, grade: "Grade 1", emoji: "🧒", parentId: 1, schoolId: "SCH001", status: "at-school", bus: "At School", loc: "Nairobi Primary School", time: "8:45 AM", lat: "-1.2965", lon: "36.7965", speed: "0 km/h", meals: "2 of 3", msgs: 3, activity: [{time: "8:15 AM", e: "Boarded Bus"}, {time: "8:45 AM", e: "Arrived at School"}, {time: "9:00 AM", e: "🍽️ Breakfast"}, {time: "10:30 AM", e: "🎨 Art Activity"}, {time: "12:30 PM", e: "🍽️ Lunch"}] },
    { id: 2, name: "Zainab Ahmed", age: 4, grade: "Pre-K", emoji: "👧", parentId: 1, schoolId: "SCH001", status: "on-bus", bus: "On Bus", loc: "Heading to School", time: "8:30 AM", lat: "-1.2900", lon: "36.7850", speed: "45 km/h", meals: "1 of 3", msgs: 1, activity: [{time: "8:00 AM", e: "Boarded Bus"}, {time: "8:30 AM", e: "🚌 In transit - 5 mins away"}] },
    { id: 3, name: "Liam Johnson", age: 6, grade: "Grade 2", emoji: "👦", parentId: 1, schoolId: "SCH001", status: "home", bus: "Picked Up", loc: "Home", time: "3:45 PM", lat: "-1.3050", lon: "36.8100", speed: "0 km/h", meals: "3 of 3", msgs: 5, activity: [{time: "3:15 PM", e: "Left School"}, {time: "3:45 PM", e: "✅ Alighted Safely"}] }
];

const mockActivities = [
    { kidId: 1, title: "🎨 Art Time", time: "10:30 AM", desc: "Created beautiful colorful painting with friends" },
    { kidId: 1, title: "🍽️ Lunch", time: "12:30 PM", desc: "Enjoyed rice and vegetables, had seconds!" },
    { kidId: 1, title: "📚 Story Time", time: "2:00 PM", desc: "Listened to amazing adventure story" },
    { kidId: 2, title: "🎵 Music Class", time: "9:30 AM", desc: "Learned new songs and danced" },
    { kidId: 2, title: "🏃 Playtime", time: "11:00 AM", desc: "Played with blocks and made towers" },
    { kidId: 3, title: "⚽ Sports", time: "10:00 AM", desc: "Played soccer with the team" },
    { kidId: 3, title: "🔢 Math Time", time: "11:30 AM", desc: "Learned numbers 1-10" }
];

const mockHealth = {
    1: { meals: { breakfast: "Porridge, Fruit, Milk", lunch: "Rice, Beef, Veggies", snack: "Cookies, Juice" }, hydration: 6, sleep: 9.5, mood: "Happy", allergies: "None" },
    2: { meals: { breakfast: "Eggs, Toast, Juice", lunch: "Pasta, Chicken, Salad", snack: "Apple, Water" }, hydration: 5, sleep: 8.5, mood: "Energetic", allergies: "Peanuts" },
    3: { meals: { breakfast: "Cereals, Milk, Fruit", lunch: "Burger, Fries, Drink", snack: "Yogurt, Granola" }, hydration: 7, sleep: 9, mood: "Playful", allergies: "None" }
};

const mockMilestones = {
    1: { badges: ["🌟", "📚", "🎨", "⚽", "🤝"], milestones: [
        { title: "Read First Word", date: "Nov 5, 2025", desc: "Successfully read 'cat' aloud" },
        { title: "Made New Friend", date: "Nov 4, 2025", desc: "Played with Zainab all morning" }
    ]},
    2: { badges: ["🎵", "🎭", "💪", "🌟", "🎯"], milestones: [
        { title: "Sang Solo", date: "Nov 3, 2025", desc: "Sang first song in front of class" },
        { title: "Shared Toys", date: "Nov 1, 2025", desc: "Showed great sharing skills" }
    ]},
    3: { badges: ["⚽", "🧮", "🎨", "🌟", "👑"], milestones: [
        { title: "Scored Goal", date: "Oct 30, 2025", desc: "First goal in soccer match" },
        { title: "Solved Math", date: "Oct 28, 2025", desc: "Solved addition problems correctly" }
    ]}
};

const mockUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "+254 700 000 000",
    children: [1, 2, 3]
};

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
    }
}

function getKids() {
    return mockKids;
}

function getKidById(id) {
    return mockKids.find(k => k.id == id);
}

function getActivitiesByKid(kidId) {
    return mockActivities.filter(a => a.kidId == kidId);
}

function getHealthByKid(kidId) {
    return mockHealth[kidId] || {};
}

function getMilestonesByKid(kidId) {
    return mockMilestones[kidId] || {};
}

function getUser() {
    const user = localStorage.getItem('userData');
    return user ? JSON.parse(user) : mockUser;
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
}