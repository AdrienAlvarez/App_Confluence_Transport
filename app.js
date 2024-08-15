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

// Fonction pour obtenir le prix du Gazole via l'API
async function obtenirPrixCarburant(ville) {
    const url = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/exports/json";

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            for (let station of data) {
                if (station.ville.toLowerCase() === ville.toLowerCase()) {
                    for (let prix of eval(station.prix)) {
                        if (prix['@nom'] === 'Gazole') {
                            console.log(`Le prix du Gazole à ${ville} est : ${prix['@valeur']} €`);
                            return parseFloat(prix['@valeur']);
                        }
                    }
                }
            }
        } else {
            console.error("Erreur lors de la récupération des données:", response.status);
        }
    } catch (error) {
        console.error("Erreur lors de l'appel à l'API:", error);
    }
    return null;
}

// Gérer la soumission du formulaire et afficher les résultats
document.getElementById('freight-form').addEventListener('submit', async function(event) {
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

    // Obtenir le prix du carburant
    const prix_carburant_litre = await obtenirPrixCarburant('Beynost');

    if (prix_carburant_litre === null) {
        alert("Prix du Gazole introuvable pour Beynost.");
        return;
    }

    // Calculer les coûts
    const coutTransporteur = calculerCoutTransporteur(heuresJour, heuresNuit);
    const crk = calculerCrk(distanceKm, prix_carburant_litre);
    const { marge, coutTotalFret } = calculerRentabilite(distanceKm, prixVenteFret, crk, coutPeage, coutTransporteur);
    const indice = indiceRentabilite(marge);

    // Stocker les résultats dans le localStorage
    localStorage.setItem('marge', marge.toFixed(2));
    localStorage.setItem('crk', crk.toFixed(4));
    localStorage.setItem('coutTotalFret', coutTotalFret.toFixed(2));
    localStorage.setItem('indice', indice);

    // Rediriger vers la page des résultats
    window.location.href = 'result.html';
});

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
