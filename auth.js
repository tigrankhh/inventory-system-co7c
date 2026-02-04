import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, get, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 1. Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD9ZPNeCL9MnWwMWAeCH0uYAnEsTEv64eE",
    authDomain: "sammy-e4657.firebaseapp.com",
    projectId: "sammy-e4657",
    storageBucket: "sammy-e4657.firebasestorage.app",
    messagingSenderId: "112172500650",
    appId: "1:112172500650:web:852f1a601ef3686ea272d3",
    databaseURL: "https://sammy-e4657-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
let user = "";

// 2. Auth Logic (Login/Signup)
document.getElementById('authBtn').onclick = async () => {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();
    
    if (!u || !p) return alert("Please fill in both fields!");

    const userRef = ref(db, 'users/' + u);
    const snap = await get(userRef);

    if (snap.exists()) {
        if (snap.val().pass === p) {
            login(u);
        } else {
            alert("Wrong password!");
        }
    } else {
        await set(userRef, { pass: p });
        alert("Account Created!");
        login(u);
    }
};

function login(name) {
    user = name;
    document.getElementById('authSection').classList.add('hidden');
    document.getElementById('chatSection').classList.remove('hidden');
    
    // Start listening for messages
    const messagesRef = ref(db, 'messages');
    onValue(messagesRef, (snap) => {
        render(snap.val());
    });
}

// 3. Message Sending
const sendBtn = document.getElementById('sendBtn');
const chatInput = document.getElementById('chatInput');

const sendMessage = () => {
    if (chatInput.value.trim() !== "") {
        push(ref(db, 'messages'), {
            s: user,            // Sender
            t: chatInput.value  // Text
        });
        chatInput.value = "";
    }
};

sendBtn.onclick = sendMessage;

// Allow "Enter" key to send
chatInput.onkeydown = (e) => {
    if (e.key === 'Enter') sendMessage();
};

// 4. Render & Bottom Scroll
function render(data) {
    const box = document.getElementById('chatBox');
    box.innerHTML = ""; // Clear box before re-drawing
    
    if (!data) return;
    
    // Loop through messages
    Object.values(data).forEach(m => {
        const isMe = m.s === user;
        
        // IMPORTANT: Use Backticks (`) for the template literal
        box.innerHTML += `
            <div class="msg ${isMe ? 'my' : 'other'}">
                <b style="font-size: 10px; display: block;">${m.s}</b>
                ${m.t}
            </div>
        `;
    });

    // SCROLL FIX: Wait for DOM to update then jump to bottom
    setTimeout(() => {
        box.scrollTop = box.scrollHeight;
    }, 50); 
}