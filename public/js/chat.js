window.addEventListener('load', showUserDetails);

async function showUserDetails() {
    console.log("Inside the showUserDetails function...");
    try {
        const token = localStorage.getItem('accessToken');
        console.log("token.......", token);
        const response = await axios.get('/groupchat', {
            headers: { "Authorization": token }
        });

        const userInfo = response.data.userDetails;

        const groupChat = document.getElementById('myTable');
        groupChat.innerHTML = '<h3 style="margin-left: 4px;">Group Members</h3>';

        const table = document.getElementById('myTable');
        const tbody = document.createElement('tbody');

        // Iterate through the array of user details
        userInfo.forEach((userData) => {
            const tr = document.createElement('tr');

            // Create a td element for the name property of each user
            const td = document.createElement('td');
            td.textContent = userData.name + " joined";
            tr.appendChild(td);

            // Append the table row to the table body
            tbody.appendChild(tr);
        });

        // Append the table body to the table
        table.appendChild(tbody);

        // Show chat messages
        await showChatMessage();

        // Set up chat message form
        setupChatForm();
    } catch (error) {
        console.error("Error fetching user details:", error);
    }
}

async function setupChatForm() {

    const chatForm = document.getElementById('chatForm');
    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const chatInput = document.getElementById('chatInput').value;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post('/chat', { chat: chatInput }, {
                headers: { "Authorization": token }
            });

            // Clear chat input field after sending message
            document.getElementById('chatInput').value = '';

            // Show newly added message immediately
            await showChatMessage();
        } catch (error) {
            console.error('Error sending chat message:', error.message);
        }
    });
}

async function showChatMessage() {
    try {
        console.log("Inside the showChatMessage function...");

        // Fetch chat messages from the server
        const response = await axios.get('/chatmessage');
        const chatMessages = response.data.chatMessages;

        // Reference to the messages container
        const messagesContainer = document.getElementById('messages');
        console.log("Show Chat messages....", chatMessages);

        // Clear existing chat messages
        const messages = document.getElementById('messages');
        messages.innerHTML = '';

        // Loop through chat messages and display username and message
        chatMessages.forEach(chat => {
            const username = chat.name; // Assuming the username property exists in the chat object
            const message = chat.message;

            const ul = document.createElement('ul');
            const li = document.createElement('li');
            li.innerHTML = `${username}: ${message}`;

            ul.appendChild(li);
            messages.appendChild(ul);

            console.log(`${username}: ${message}`);
        });
         // Scroll to the bottom of the messages container
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        console.error("Error fetching chat messages:", error);
    }
}
