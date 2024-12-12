// Afficher les détails de l'utilisateur
function afficherDetailsUtilisateur() {
    const localUser = JSON.parse(localStorage.getItem('connectedUser'));

    if (localUser) {
        document.getElementById('user-details').innerHTML = `
            <h2>Bienvenue, ${localUser.Nom}</h2>
            <p>Email : ${localUser.Email}</p>
        `;
        document.getElementById('logout-button').style.display = 'block';
    } else {
        document.getElementById('user-details').innerHTML = `
            <h2>Veuillez vous connecter pour voir vos informations.</h2>
        `;
        document.getElementById('logout-button').style.display = 'none';
    }
}

        // Déconnexion de l'utilisateur
        document.getElementById('logout-button').addEventListener('click', () => {
            localStorage.removeItem('connectedUser');
            afficherDetailsUtilisateur();
            alert('Vous êtes déconnecté !');
        });

        // Vérification initiale
        afficherDetailsUtilisateur();





// Gestion de l'inscription
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nom = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const address = document.getElementById('signup-address').value.trim();
    const role = document.getElementById('signup-role').value;

    let motoColor = '';
    let plaqueCode = '';
    if (role === 'chauffeur') {
        motoColor = document.getElementById('signup-moto-color').value.trim();
        plaqueCode = document.getElementById('signup-plaque-code').value.trim();
    }

    if (!nom || !email || !password || !phone || !address) {
        alert("Tous les champs sont obligatoires !");
        return;
    }
    if (!email.includes('@')) {
        alert("Adresse email invalide !");
        return;
    }

    const sanitizedNom = nom.replace(/[\.\[\]#$\/]/g, '').replace(/\s+/g, '_');

    try {
        const userRef = firebase.database().ref('chauffeurs');
        const snapshot = await userRef.child(sanitizedNom).once('value');

        if (snapshot.exists()) {
            alert("Cet utilisateur existe déjà.");
        } else {
            await userRef.child(sanitizedNom).set({
                Nom: nom,
                Email: email,
                password: password, // À hacher en production
                Numero: phone,
                Addresse: address,
                role: role,
                MotoCouleur: motoColor || null,
                Plaque: plaqueCode || null,
            });
            alert('Utilisateur inscrit avec succès !');
        }
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error.message);
    }
});

// Gestion de la connexion
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = JSON.parse(localStorage.getItem('connectedUser'));
    if (savedUser) {
        afficherDetailsUtilisateur(savedUser.id);
        window.location.href = '/index.html'; // Redirection si déjà connecté
        return;
    }

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const userRef = firebase.database().ref('chauffeurs');
            const snapshot = await userRef.once('value');

            if (snapshot.exists()) {
                let userFound = false;

                snapshot.forEach((childSnapshot) => {
                    const user = childSnapshot.val();
                    if (user.Email === email && user.password === password) {
                        userFound = true;

                        const connectedUser = {
                            id: childSnapshot.key,
                            Nom: user.Nom,
                            Email: user.Email,
                        };
                        localStorage.setItem('connectedUser', JSON.stringify(connectedUser));

                        alert("Connexion réussie !");
                        window.location.href = '/index.html';
                    }
                });

                if (!userFound) {
                    alert("Email ou mot de passe incorrect.");
                }
            } else {
                alert("Aucun utilisateur trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error.message);
        }
    });
});

// Gestion de la déconnexion
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('connectedUser');
    alert("Déconnexion réussie.");
    window.location.href = '/login.html';
});



// Affichage dynamique des champs pour le rôle chauffeur
function toggleChauffeurFields(isChauffeur) {
    const chauffeurFields = document.getElementById('chauffeur-fields');
    chauffeurFields.style.display = isChauffeur ? 'block' : 'none';
}

document.getElementById('signup-role').addEventListener('change', function () {
    toggleChauffeurFields(this.value === 'chauffeur');
});