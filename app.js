const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const errorMsg = document.getElementById("error-message");

// LOGIN
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "home.html";
      })
      .catch(error => {
        errorMsg.innerText = error.message;
      });
  });
}

// SIGNUP
if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "home.html";
      })
      .catch(error => {
        errorMsg.innerText = error.message;
      });
  });
}

// AUTH LISTENER
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    const emailDisplay = document.getElementById("user-email");
    const profileEmail = document.getElementById("profile-email");
    if (emailDisplay) emailDisplay.innerText = "Logged in as: " + user.email;
    if (profileEmail) profileEmail.innerText = "Email: " + user.email;
  } else {
    if (!window.location.pathname.includes("index.html")) {
      window.location.href = "index.html";
    }
  }
});

// LOGOUT
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}

// NAVIGATION
function goProfile() { window.location.href = "profile.html"; }
function goHome() { window.location.href = "home.html"; }
function goChat() { window.location.href = "chat.html"; }

// CHAT
function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  const user = firebase.auth().currentUser;

  if (message && user) {
    firebase.database().ref("messages").push({
      user: user.email,
      text: message,
      time: Date.now()
    });
    input.value = "";
  }
}

// Display messages
const chatBox = document.getElementById("chat-box");
if (chatBox) {
  firebase.database().ref("messages").on("child_added", (snapshot) => {
    const msg = snapshot.val();
    const div = document.createElement("div");
    div.innerText = msg.user + ": " + msg.text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}