window.addEventListener("load", showUserDetails);

async function openNewPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get("groupId");
  window.location.href = "/addmembers?groupId=" + groupId;
}

async function showUserDetails() {
  console.log("Inside the showUserDetails function...");
  try {
    const token = localStorage.getItem("accessToken");
    console.log("token.......", token);
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get("groupId");

    console.log("group id .....", groupId);

    const response = await axios.get("/groupchat", {
      params: { groupId: groupId },
      headers: { Authorization: token },
    });

    const groupName = response.data.groupName; // Extract group name from response

    // Create a new h2 element for the group name
    const groupChatHeading = document.createElement("h2");
    groupChatHeading.classList.add("group-chat-heading");
    groupChatHeading.textContent = groupName;

    // Find the chat container
    const chatContainer = document.querySelector(".chat-container");

    // Insert the group name before other elements in the chat container
    chatContainer.insertBefore(groupChatHeading, chatContainer.firstChild);

    const userInfo = response.data.users;

    console.log("UserInfo....", userInfo);

    const groupChat = document.getElementById("myTable");
    groupChat.innerHTML = '<h3 style="margin-left: 4px;">Group Members</h3>';

    const table = document.getElementById("myTable");
    const tbody = document.createElement("tbody");

    // Iterate through the array of user details
    userInfo.forEach((userData) => {
      const tr = document.createElement("tr");

      // Create a td element for the name property of each user
      const td = document.createElement("td");
      td.textContent = userData.name + " joined";
      tr.appendChild(td);

      // Append the table row to the table body
      tbody.appendChild(tr);
    });

    // Append the table body to the table
    table.appendChild(tbody);

    // Show chat messages
    await fetchAndDisplayNewChatMessages(groupId);

    // Set up chat message form
    setupChatForm(groupId);
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
}

async function setupChatForm(groupId) {
  console.log("Inside the setUpChat Form.....");

  const chatForm = document.getElementById("chatForm");
  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const chatInput = document.getElementById("chatInput").value;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "/chat",
        { chat: chatInput, groupId: groupId },
        {
          headers: { Authorization: token },
        }
      );

      // Clear chat input field after sending message
      document.getElementById("chatInput").value = "";

      // Show newly added message immediately
      await fetchAndDisplayNewChatMessages(groupId);
    } catch (error) {
      console.error("Error sending chat message:", error.message);
    }
  });
}

async function fetchAndDisplayNewChatMessages(groupId) {
  try {
    console.log("Fetching new chat messages...");

    console.log("groupId...", groupId);

    // Fetch last stored message ID from local storage
    const lastStoredMessageId = localStorage.getItem("lastMessageId");
    const token = localStorage.getItem("accessToken");

    // Fetch new chat messages since the last stored message
    const response = await axios.get("/chatmessage", {
      params: { lastMessageId: lastStoredMessageId, groupId: groupId },
      headers: { Authorization: token },
    });

    const newChatMessages = response.data.chatMessages;

    // Combine stored messages and new messages
    let allChatMessages = [];
    // Inside fetchAndDisplayNewChatMessages(groupId)
    const storageKey = `chatMessages_${groupId}`;
    const storedChatMessages = JSON.parse(
      localStorage.getItem(storageKey) || "[]"
    );
    allChatMessages = storedChatMessages.concat(newChatMessages);

    console.log("all chat messages", allChatMessages);

    // Ensure only the most recent 10 messages are stored
    const maxStoredMessages = 10;
    if (allChatMessages.length > maxStoredMessages) {
      const excessMessagesCount = allChatMessages.length - maxStoredMessages;
      allChatMessages.splice(0, excessMessagesCount);
    }

    // Update last stored message ID in local storage
    if (newChatMessages.length > 0) {
      const lastMessageId = newChatMessages[newChatMessages.length - 1].id;
      localStorage.setItem("lastMessageId", lastMessageId);
    }

    // Store all chat messages in local storage for future use
    localStorage.setItem("chatMessages", JSON.stringify(allChatMessages));

    // Display all messages
    displayChatMessages(allChatMessages);
  } catch (error) {
    console.error("Error fetching and displaying new chat messages:", error);
  }
}

function displayChatMessages(chatMessages) {
  const messagesContainer = document.getElementById("messages");
  messagesContainer.innerHTML = "";

  chatMessages.forEach((chat) => {
    const username = chat.name;
    const message = chat.message;

    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.innerHTML = `${username}: ${message}`;

    ul.appendChild(li);
    messagesContainer.appendChild(ul);
  });

  // Scroll to the bottom of the messages container
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
