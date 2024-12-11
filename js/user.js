document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Récupérer les valeurs du formulaire
    const nom = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const address = document.getElementById('signup-address').value.trim();
    const role = document.getElementById('signup-role').value;

    // Champs spécifiques aux chauffeurs
    let motoColor = '';
    let plaqueCode = '';
    if (role === 'chauffeur') {
        motoColor = document.getElementById('signup-moto-color').value.trim();
        plaqueCode = document.getElementById('signup-plaque-code').value.trim();
    }

    // Nettoyer le nom pour qu'il soit une clé Firebase valide
    const sanitizedNom = nom.replace(/[\.\[\]#$/]/g, '').replace(/\s+/g, '_');

    // Vérifier si l'utilisateur existe déjà
    const userRef = firebase.database().ref('chauffeurs');
    userRef.child(sanitizedNom).once('value').then((snapshot) => {
        if (snapshot.exists()) {
            console.log("Cet utilisateur existe déjà.");
        } else {
            // Enregistrer les données utilisateur dans la base de données
            userRef.child(sanitizedNom).set({
                Nom: nom,
                Email: email,
                password: password, // Note : les mots de passe devraient être hachés pour plus de sécurité
                Numero: phone,
                Addresse: address,
                role: role,
                MotoCouleur: motoColor || null,
                Plaque: plaqueCode || null,
            }).then(() => {
                console.log('Utilisateur inscrit avec succès!');
            }).catch((error) => {
                console.error("Erreur lors de l'inscription: ", error.message);
            });
        }
    }).catch((error) => {
        console.error("Erreur lors de la vérification de l'utilisateur: ", error.message);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        if (!email || !password) {
            console.log("Veuillez remplir tous les champs.");
            return;
        }

        // Référence à la base de données
        const userRef = firebase.database().ref('chauffeurs');

        // Vérifier l'utilisateur et le mot de passe
        userRef.once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    let userFound = false;

                    snapshot.forEach((childSnapshot) => {
                        const user = childSnapshot.val();

                        // Vérifie si l'email et le mot de passe correspondent
                        if (user.Email === email && user.password === password) {
                            userFound = true;
                            console.log("Utilisateur connecté");
                            afficherDetailsUtilisateur(childSnapshot.key); // Utilisez la clé de l'utilisateur pour afficher les détails
                        }
                    });

                    if (!userFound) {
                        console.log("Email ou mot de passe incorrect.");
                    }
                } else {
                    console.log("Aucun utilisateur trouvé.");
                }
            })
            .catch((error) => {
                console.error("Erreur lors de la connexion: ", error.message);
            });
    });
});


function afficherDetailsUtilisateur(userId) {
    const userRef = firebase.database().ref('chauffeurs/' + userId);

    userRef.once('value').then((snapshot) => {
        const userDetails = snapshot.val();
        if (userDetails) {
            const { Email, role, MotoCouleur, Plaque } = userDetails;

            document.getElementById('user-details').innerHTML = `
                <h2>${role === 'chauffeur' ? 'Chauffeur' : 'Client'}</h2>
                <p>Email: ${Email}</p>
                <p>Rôle: ${role}</p>
                ${role === 'chauffeur' ? `
                <p>Couleur de la moto: ${MotoCouleur || 'Non spécifiée'}</p>
                <p>Code de la plaque: ${Plaque || 'Non spécifiée'}</p>` : ''}
            `;
        }
    }).catch((error) => {
        console.error("Erreur lors de l'affichage des détails: ", error.message);
    });
}

document.getElementById('signup-role').addEventListener('change', function () {
    const role = this.value;
    const chauffeurFields = document.getElementById('chauffeur-fields');

    // Afficher/masquer les champs en fonction du rôle
    chauffeurFields.style.display = role === 'chauffeur' ? 'block' : 'none';
});

document.getElementById('signup-plaque').addEventListener('change', function () {
    const plaqueInput = document.getElementById('signup-plaque-code');
    plaqueInput.style.display = this.value === 'oui' ? 'inline' : 'none';
});
