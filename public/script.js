const username = localStorage.getItem('user');

if (username) {
    
    // Create the container div
    let container = document.createElement('div');
    container.classList.add('container');
    
    // Create the button
    let button = document.createElement('button');
    button.className = 'powerButton';
    button.id = 'powerButton';
    button.textContent = 'Power ON';
    button.disabled = true;
    button.addEventListener('click', () => powerButtonClick());
    
    let status = document.createElement('p');
    status.id = 'status';
    status.className = 'status';
    status.textContent = 'Server status: Loading...';
    fetch(`/checkstate`)
        .then(response => response.json())
        .then(data => {
            if (data.active) {
                status.textContent = 'Server status: Online';
                status.className = 'status online-status';
            } else {
                status.textContent = 'Server status: Offline';
                status.className = 'status offline-status';
                button.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while contacting the server.');
        });

    // Append the elements to the container
    container.appendChild(status);
    container.appendChild(button);

    // Append the container to the body (or another parent element)
    document.body.appendChild(container);

    // Power button click event handler
    async function powerButtonClick() {
        // Disable the button after it's clicked once
        const powerButton = document.getElementById('powerButton');
        powerButton.textContent = 'Starting...';
        powerButton.className = 'powerButton powerButton-starting';
        powerButton.disabled = true;

        const resultElement = document.getElementById('status');
        if (resultElement.textContent == 'Server status: Online') {
            alert('The server is already running.');
            powerButton.textContent = 'Power ON';
            return;
        }

        await fetch(`/start?username=${encodeURIComponent(username)}`, { method: 'GET' });
    }

} else {

    // Create the container div
    let container = document.createElement('div');
    container.classList.add('container');

    // Create and append the text (label or description)
    let text = document.createElement('p');
    text.id = 'textField';
    text.className = 'textField';
    text.textContent = 'Kérlek add meg a neved:';
    container.appendChild(text);

    // Create the input field for the name
    let input = document.createElement('input');
    input.type = 'text';
    input.id = 'userInput';
    input.className = 'userInput';
    input.placeholder = 'Név';
    container.appendChild(input);

    // Create the submit button
    let button = document.createElement('button');
    button.textContent = 'Submit';
    button.className = 'submitButton';

    container.appendChild(button);

    // Append the container to the body (or another parent element)
    document.body.appendChild(container);

    // Add an event listener to the button to handle form submission
    button.addEventListener('click', function () {
        let name = input.value.trim();
        if (!name) {
            alert('Kérlek add meg a neved!');
            return;
        }
        localStorage.setItem('user', name);
        location.reload();
    });

}