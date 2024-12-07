// Fonction pour ajouter un chauffeur à la table
document.getElementById("taxiForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les valeurs des champs du formulaire
    const nom = document.getElementById("nom").value;
    const numero = document.getElementById("numero").value;
    const adresse = document.getElementById("adresse").value;
    const localisation = document.getElementById("localisation").value;
    const motoCouleur = document.getElementById("motoCouleur").value;
    const plaque = document.getElementById("plaque").value;

    // Créer une nouvelle ligne dans la table
    const newRow = document.createElement("tr");

    // Ajouter les cellules avec les informations des chauffeurs
    newRow.innerHTML = `
        <td>${nom}</td>
        <td>${numero}</td>
        <td>${adresse}</td>
        <td>${localisation}</td>
        <td>${motoCouleur}</td>
        <td>${plaque}</td>
    `;

    // Ajouter la ligne au tableau
    document.querySelector("#chauffeursTable tbody").appendChild(newRow);

    // Réinitialiser le formulaire
    document.getElementById("taxiForm").reset();
});
