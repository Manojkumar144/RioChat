window.addEventListener('load', showUserDetails);

async function showUserDetails() {
    console.log("Inside the showUser Details..............");
    const token = localStorage.getItem('accessToken');
    const response = await axios.get('/groupchat', {
        headers: { "Authorization": token }
    });

    const userInfo = response.data.userDetails;

    const groupChat = document.getElementById('myTable');
    groupChat.innerHTML = '<h3 style="margin-left: 4px;">Group Chat</h3>';

    const table = document.getElementById('myTable');
    const tbody = document.createElement('tbody');

    // Iterate through the array of user details
    userInfo.forEach((userData) => {
        const tr = document.createElement('tr');

        // Create a td element for the name property of each user
        const td = document.createElement('td');
        td.textContent = userData.name+" joined";
        tr.appendChild(td);

        // Append the table row to the table body
        tbody.appendChild(tr);
    });

    // Append the table body to the table
    table.appendChild(tbody);
}
