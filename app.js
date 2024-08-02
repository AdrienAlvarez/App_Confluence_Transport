// Consommation fixe du camion Man TGX (en litres par km)
const consommation_tgx = 29.52 / 100;  // Consommation de 29,52 litres/100km

// Informations de l'entreprise
const salaire_heure_jour = 11.86;
const salaire_heure_nuit = 14.91;
const charge_sociale_taux = 0.45;

// Coûts variables
const lubrifiant_km = 0.0015;
const pneumatique_km = 0.03;
const entretien_reparations_km = 0.10;

// Données JSON simulées pour l'exemple (remplacer par la vraie réponse API si besoin)
const station_data = {
    "id": "1700004",
    "latitude": "4582600",
    "longitude": "499900",
    "cp": "01700",
    "ville": "BEYNOST",
    "prix": [
        {"nom": "Gazole", "id": "1", "maj": "2024-08-02 08:45:00", "valeur": "1.571"},
        {"nom": "SP95", "id": "2", "maj": "2024-08-02 08:45:00", "valeur": "1.737"},
        {"nom": "E85", "id": "3", "maj": "2024-08-02 08:45:00", "valeur": "0.739"},
        {"nom": "GPLc", "id": "4", "maj": "2024-08-02 08:45:00", "valeur": "0.910"},
        {"nom": "E10", "id": "5", "maj": "2024-08-02 08:45:00", "valeur": "1.671"},
        {"nom": "SP98", "id": "6", "maj": "2024-08-02 08:45:00", "valeur": "1.791"},
    ]
};

// Extraire le prix du Gazole
let prix_carburant_litre = null;
for (let prix of station_data.prix) {
    if (prix.nom === "Gazole") {
        prix_carburant_litre = parseFloat(prix.valeur);
        console.log(`Le prix du Gazole à la station ID 1700004 est : ${prix_carburant_litre} €`);
    }
}

// Si le prix du Gazole n'est pas trouvé, il faut arrêter le programme
if (prix_carburant_litre === null) {
    alert("Prix du Gazole introuvable dans les données fournies.");
    throw new Error("Prix du Gazole introuvable dans les données fournies.");
}

function calculerCoutTransporteur(heuresJour, heuresNuit) {
    const salaireJour = heuresJour * salaire_heure_jour;
    const salaireNuit = heuresNuit * salaire_heure_nuit;
    const salaireBrut = salaireJour + salaireNuit;
    return salaireBrut + (salaireBrut * charge_sociale_taux);
}

function calculerCrk(distanceKm, prixCarburantLitre) {
    const carburantKm = consommation_tgx * prixCarburantLitre;
    const chargesVariablesKm = carburantKm + lubrifiant_km + pneumatique_km + entretien_reparations_km;
    return chargesVariablesKm;
}

function calculerRentabilite(distanceKm, prixVenteFret, crk, coutPeage, coutTransporteur) {
    const coutTotalFret = (crk * distanceKm) + (coutPeage * 4) + coutTransporteur;
    const marge = ((prixVenteFret - coutTotalFret) / prixVenteFret) * 100;
    return { marge, coutTotalFret };
}

function indiceRentabilite(marge) {
    if (marge < 20) {
        return "Orange";
    } else if (marge >= 20 && marge < 27) {
        return "Jaune";
    } else if (marge > 33) {
        return "Vert";
    } else {
        return "Rouge";
    }
}

// Gérer la soumission du formulaire et afficher les résultats
document.getElementById('freight-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Récupérer les valeurs du formulaire
    const prixVenteFret = parseFloat(document.getElementById('prix_vente_fret').value);
    const heuresJour = parseFloat(document.getElementById('heures_jour').value);
    const heuresNuit = parseFloat(document.getElementById('heures_nuit').value);
    const distanceKm = parseFloat(document.getElementById('distance_km').value);
    const coutPeage = parseFloat(document.getElementById('cout_peage').value);

    // Vérification des valeurs
    if (isNaN(prixVenteFret) || isNaN(heuresJour) || isNaN(heuresNuit) || isNaN(distanceKm) || isNaN(coutPeage)) {
        alert("Veuillez remplir correctement tous les champs.");
        return;
    }

    // Calculer les coûts
    const coutTransporteur = calculerCoutTransporteur(heuresJour, heuresNuit);
    const crk = calculerCrk(distanceKm, prix_carburant_litre);
    const { marge, coutTotalFret } = calculerRentabilite(distanceKm, prixVenteFret, crk, coutPeage, coutTransporteur);
    const indice = indiceRentabilite(marge);

    // Afficher les résultats
    document.getElementById('marge').textContent = `Marge: ${marge.toFixed(2)}%`;
    document.getElementById('crk').textContent = `CRK: ${crk.toFixed(4)} €/km`;
    document.getElementById('cout_total_fret').textContent = `Coût total du fret: ${coutTotalFret.toFixed(2)} €`;
    document.getElementById('indice').textContent = `Indice de rentabilité: ${indice}`;

    // Montrer la section des résultats
    document.getElementById('results').style.display = 'block';
});
