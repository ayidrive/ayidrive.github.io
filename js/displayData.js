// Function to display users and set up message sending buttons
function displayUsers() {
  const usersRef = database.ref('chauffeurs');  // Reference to 'chauffeurs' in Firebase

  // Get all users from Firebase
  usersRef.once('value', function(snapshot) {
      const usersData = snapshot.val();
      const usersList = document.getElementById('chauffeur');
      const addressSelect = document.getElementById('addressSelect');
      
      usersList.innerHTML = ''; // Clear the list before adding new data
      addressSelect.innerHTML = '<option value="">Sélectionnez une adresse</option>'; // Clear and reset address dropdown

      if (usersData) {
          const addresses = new Set(); // To hold unique addresses

          // Loop through each user and display them
          Object.keys(usersData).forEach(userId => {
              const user = usersData[userId];
              
              // Add address to the dropdown options
              addresses.add(user.Adresse);

              const post = document.createElement('div');
              post.innerHTML = `
              <div class="post">
                  <div>
                      <strong>Nom:</strong> ${user.Nom} <br>
                      <strong>Adresse:</strong> ${user.Addresse} <br>
                      <strong>Localisation:</strong> ${user.Localisation} <br>
                      
                      <!-- Profile Image on top-right -->
                      <div class="image-chauffeur">
                          <img src="${user.ProfileImage || './images/logoBack.jpg'}" alt="Profile Picture">
                      </div>
          
                      <!-- Hidden extra info -->
                      <div class="extra-info" style="display: none;">
                          <strong>Numéro:</strong> ${user.Numero} <br>
                          <strong>Couleur de la moto:</strong> ${user.MotoCouleur} <br>
                          <strong>Numéro de plaque:</strong> ${user.Plaque} <br>
                      </div>
                  </div>
                  <hr>
                  <div class="listBtn">
                  <!-- See More Button -->
                      <button class="see-more-btn">Plis detay</button>
                      <button onclick="showMessageForm('${user.Numero}', '${user.Adresse}')"><i class="fab fa-whatsapp"></i>Kontakte'm</button>
                      <button style="display: none" onclick="showMessageForm('${user.Numero}', '${user.Adresse}')">Bip</button>
                      <button style="display: none" onclick="showMessageForm('${user.Numero}', '${user.Adresse}')">Sms</button>
                  </div>
              </div>
          `;
          
              post.setAttribute('data-address', user.Adresse); // Store the address in a custom attribute
              usersList.appendChild(post); // Append the div to the usersList container
              
              // Add event listener for 'Voir plus' button to show extra info
              const seeMoreBtn = post.querySelector('.see-more-btn');
              seeMoreBtn.addEventListener('click', () => {
                  const extraInfo = post.querySelector('.extra-info');
                  const isHidden = extraInfo.style.display === 'none';
                  extraInfo.style.display = isHidden ? 'block' : 'none';  // Toggle visibility
                  seeMoreBtn.textContent = isHidden ? 'Voir moins' : 'Voir plus'; // Change button text
              });
          });

          // Populate the address select dropdown
          addresses.forEach(address => {
              const option = document.createElement('option');
              option.value = address;
              option.textContent = address;
              addressSelect.appendChild(option);
          });

      } else {
          usersList.innerHTML = '<p>Aucun chauffeur enregistré.</p>'; // If no data is found
      }
  });
}

// Function to show the message form when a button (Whatsapp, Bip, or SMS) is clicked
function showMessageForm(phoneNumber, address) {
  const contactForm = document.getElementById('contactForm');
  contactForm.style.display = 'block';

  // Set default values in the form
  document.getElementById('clientAddress').value = address || '';  // Set the client address
  document.getElementById('destinationAddress').value = '';  // Clear destination address

  // Show the correct buttons for Whatsapp, Bip, or SMS
  const sendWhatsappButton = document.getElementById('sendWhatsapp');
  const sendBipButton = document.getElementById('sendBip');
  const sendSmsButton = document.getElementById('sendSms');

  sendWhatsappButton.style.display = 'inline-block';
  sendBipButton.style.display = 'inline-block';
  sendSmsButton.style.display = 'inline-block';

  // Assign action to buttons
  sendWhatsappButton.onclick = function() {
      sendMessage(phoneNumber, 'whatsapp');
  };
  sendBipButton.onclick = function() {
      sendMessage(phoneNumber, 'bip');
  };
  sendSmsButton.onclick = function() {
      sendMessage(phoneNumber, 'sms');
  };
}

// Function to handle the message sending process
function sendMessage(phoneNumber, platform) {
  const clientAddress = document.getElementById('clientAddress').value;
  const destinationAddress = document.getElementById('destinationAddress').value;

  if (!clientAddress || !destinationAddress) {
      alert('Veuillez entrer l\'adresse du client et la destination.');
      return;
  }

  // Create the message content
  const message = `Client: ${clientAddress}\nDestination: ${destinationAddress}`;

  // Depending on the platform selected, create the link for sending the message
  let url = '';
  if (platform === 'whatsapp') {
      url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  } else if (platform === 'bip') {
      // Bip messaging platform URL (example, this needs to be customized for Bip)
      url = `bip://send?phone=${phoneNumber}&message=${encodeURIComponent(message)}`;
  } else if (platform === 'sms') {
      url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
  }

  // Open the URL to send the message
  window.location.href = url;
}

// Call displayUsers function to load users initially
displayUsers();

// Optionally, refresh the list every 5 seconds or on new user submission
setInterval(displayUsers, 5000);

// Add event listener to filter users based on address selection
document.getElementById('addressSelect').addEventListener('change', filterByAddress);
