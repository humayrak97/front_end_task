// Selecting elements from the DOM
const PromptInput = document.querySelector("#chat-input");       // Input field for user prompts
const SendBtn = document.querySelector("#send-btn");             // Button to send user input
const ChatContainer = document.querySelector(".chat-container"); // Container to display chats
const ThemeBtn = document.querySelector("#theme-btn");           // Button to toggle theme
const DeleteBtn = document.querySelector("#delete-btn");         // Button to delete chats
const PoetBtn = document.querySelector("#poet-btn");             // Button to toggle Poet assistant
const GrumpyBtn = document.querySelector("#grumpy-btn");         // Button to toggle Grumpy assistant
const LogoutBtn = document.querySelector("#logout-btn");         // Logout button

// Variable to store user input and backend API endpoint
let UserPrompt = null;                                          // Stores the user's input
const Api_URL = "/chat";                                         // Backend API endpoint for chat
let AssistantType = "poet";                                     // Default assistant type

// Function to create chat message elements dynamically
const CreateElement = (html, className) => {
    const ChatDiv = document.createElement("div");
    ChatDiv.classList.add("chat", className);
    ChatDiv.innerHTML = html;
    return ChatDiv;
};

// Function to load theme and chat history from local storage
const DataFromLocalStorage =()=>{
    // Load theme from local storage and apply
    let ThemeSwitcher = localStorage.getItem("Theme-Switcher");
    document.body.classList.toggle("light-mode", ThemeSwitcher === "light_mode");
    ThemeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
    // Load chat history or show default content
    const DeafaultContent = `<div class="Default-Text">
                                <h1>Introducing The Opti-Chat </h1>
                                <p>Future Of Conversational AI</p>
                            </div>`
    ChatContainer.innerHTML = localStorage.getItem("All-Chats") || DeafaultContent;
    
    // Scroll chat container to the bottom
    ChatContainer.scrollTo(0, ChatContainer.scrollHeight);
}


// Call the function to load initial data from local storage
DataFromLocalStorage();

// Function to save current chat container content to local storage
const SaveChatsToLocalStorage = () => {
    localStorage.setItem("All-Chats", ChatContainer.innerHTML);
};

// Function to handle user input and make API request to backend
const HandleUserInput = async () => {
    // Get user input and trim whitespace
    UserPrompt = PromptInput.value.trim();
    // If input is empty, do nothing
    if (!UserPrompt) return;

    // Create outgoing chat message and append to chat container
    const OutgoingChatDiv = CreateElement(
        `<div class="chat-content-box">
            <div class="chat-details">
                <img src="https://i.ibb.co/tmt7xkN/user.png" alt="user-image">
                <p>${UserPrompt}</p>
            </div>
        </div>`,
        "outgoing"
    );
    ChatContainer.appendChild(OutgoingChatDiv);
    // Save chat to local storage
    SaveChatsToLocalStorage();
    // Remove default content on first message
    document.querySelector(".Default-Text")?.remove();
    // Scroll to bottom of chat container
    ChatContainer.scrollTo(0, ChatContainer.scrollHeight);
    

    // Show typing animation
    TypingAnimation();
    // Send request to backend API
    try {
        const response = await fetch(Api_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Send user prompt as JSON body
            body: JSON.stringify({ prompt: UserPrompt, assistant: AssistantType  }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');   // Throw error if response is not OK
        }

         // Parse response JSON
        const responseData = await response.json();
        const assistantResponse = responseData.response.trim(); // Get trimmed response text

        // Create incoming chat message with assistant's response and append to chat container
        const IncomingChatDiv = CreateElement(
            `<div class="chat-content-box">
                <div class="chat-details">
                    <img src="https://i.ibb.co/0VDMm2X/chatbot.jpg" alt="chatbot-image">
                    <p>${assistantResponse}</p>
                </div>
            </div>`,
            "incoming"
        );
        const lastIncomingChatDiv = document.querySelector(".chat-container .incoming:last-child");
        if (lastIncomingChatDiv) {
            lastIncomingChatDiv.querySelector(".loading-dots-animation").remove();
            lastIncomingChatDiv.querySelector(".chat-details").appendChild(IncomingChatDiv.querySelector(".chat-details p"));
        } else {
            ChatContainer.appendChild(IncomingChatDiv);
        }
        // Save chat to local storage
        SaveChatsToLocalStorage();
        ChatContainer.scrollTo(0, ChatContainer.scrollHeight);  // Scroll to bottom of chat container
        
    } catch (error) {
        console.error('Error:', error); // Log error to console
        alert("Oops! Something went wrong while fetching response. Please try again."); // Show alert to user
    }

    // Clear input field after processing 
    PromptInput.value = "";
};

// Function to toggle assistants 
const ToggleAssistant = async (newAssistantType, buttonElement) => {
    
        const response = await fetch(`/toggle-assistant/${newAssistantType}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error('Network response was not ok'); // Throw error if response is not OK
        }

        const responseData = await response.json();
        console.log(responseData.message); // Log toggle message

        // Update current assistant type
        AssistantType = newAssistantType;

        // Update button styles
        PoetBtn.classList.remove('active');
        GrumpyBtn.classList.remove('active');
        buttonElement.classList.add('active');
};

// Function to copy responses
const CopyResponses =(CopyBtn)=>{
    let ResponseText = CopyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(ResponseText.textContent);
    CopyBtn.textContent = "done";
    setTimeout(()=> CopyBtn.textContent = "content_copy", 1000)
  }
   
// Function to show typing animation
const TypingAnimation = () => {
    const html = `<div class="chat-content-box">
                    <div class="chat-details">
                        <img src="https://i.ibb.co/0VDMm2X/chatbot.jpg" alt="chatbot-image">
                        <div class="loading-dots-animation">
                            <div class="loading-dot" style="--delay:0.2s;"></div>
                            <div class="loading-dot" style="--delay:0.3s;"></div>
                            <div class="loading-dot" style="--delay:0.4s;"></div>
                        </div>
                    </div>
                    <span onclick="CopyResponses(this)" class="material-symbols-rounded">content_copy</span>
                </div>`;
    const IncomingChatDiv = CreateElement(html, "incoming");
    ChatContainer.appendChild(IncomingChatDiv);
    ChatContainer.scrollTo(0, ChatContainer.scrollHeight);
};

// Function to handle logout
const HandleLogout = async () => {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
        });

        if (response.ok) {
            localStorage.removeItem("All-Chats"); // Remove chat history from local storage
            window.location.href = '/login'; // Redirect to login page after logout
        } else {
            throw new Error('Logout failed');
        }
    } catch (error) {
        console.error('Error:', error); // Log error to console
        alert('Failed to logout. Please try again.');
    }
};
  
// Event listeners for user interaction
SendBtn.addEventListener("click", HandleUserInput); // Handle user input on button click

ThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode"); // Toggle light/dark mode
    localStorage.setItem("Theme-Switcher", ThemeBtn.innerText); // Store theme in local storage
    ThemeBtn.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode"; // Update theme button text
});

DeleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all chats?")) {
        localStorage.removeItem("All-Chats"); // Remove chat history from local storage
        //ChatContainer.innerHTML = ""; // Clear chat container
    }
    DataFromLocalStorage();
});




// Toggle between assistants on button click
PoetBtn.addEventListener("click", () => ToggleAssistant("poet", PoetBtn));
GrumpyBtn.addEventListener("click", () => ToggleAssistant("grumpy", GrumpyBtn));
LogoutBtn.addEventListener("click", HandleLogout); // Handle logout on button click

// Setup initial input field height and scrolling behavior
const InitialHeight = PromptInput.scrollHeight; // Get initial input field height
PromptInput.addEventListener("input", () => {
    PromptInput.style.height = `${InitialHeight}px`; // Set initial height
    PromptInput.style.height = `${PromptInput.scrollHeight}px`; // Adjust height based on content
});

PromptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        HandleUserInput();  // Handle user input on Enter key press (if not in mobile view)
    }
});
