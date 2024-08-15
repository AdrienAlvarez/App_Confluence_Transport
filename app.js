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

// URL de l'API pour récupérer les données au format JSON
const url = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/exports/json";

// Fonction pour récupérer le prix du Gazole à Beynost
async function getPrixGazoleBeynost() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Échec de la requête : ${response.status}`);
        }
        const data = await response.json();
        let found = false;
        let prixGazole = null;

        for (let station of data) {
            if (station.ville.toLowerCase() === 'beynost') {
                let prixList = JSON.parse(station.prix.replace(/'/g, '"'));
                for (let prix of prixList) {
                    if (prix['@nom'] === 'Gazole') {
                        prixGazole = parseFloat(prix['@valeur']);
                        found = true;
                        break;
                    }
                }
                break;
            }
        }

        if (!found) {
            throw new Error("Prix du Gazole introuvable à Beynost.");
        }

        return prixGazole;
    } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        return null;  // Retourne null en cas d'erreur pour signaler l'absence de données
    }
}

// Calcul des coûts de transporteur
function calculerCoutTransporteur(heuresJour, heuresNuit) {
    const salaireJour = heuresJour * salaire_heure_jour;
    const salaireNuit = heuresNuit * salaire_heure_nuit;
    const salaireBrut = salaireJour + salaireNuit;
    return salaireBrut + (salaireBrut * charge_sociale_taux);
}

// Calcul du coût par kilomètre (CRK)
function calculerCrk(distanceKm, prixCarburantLitre) {
    const carburantKm = consommation_tgx * prixCarburantLitre;
    const chargesVariablesKm = carburantKm + lubrifiant_km + pneumatique_km + entretien_reparations_km;
    return chargesVariablesKm;
}

// Calcul de la rentabilité
function calculerRentabilite(distanceKm, prixVenteFret, crk, coutPeage, coutTransporteur) {
    const coutTotalFret = (crk * distanceKm) + (coutPeage * 4) + coutTransporteur;
    const marge = ((prixVenteFret - coutTotalFret) / prixVenteFret) * 100;
    return { marge, coutTotalFret };
}

// Définir l'indice de rentabilité en fonction de la marge
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

// Gestion de la soumission du formulaire et affichage des résultats
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

    // Récupérer le prix du Gazole à Beynost
    const prix_carburant_litre = await getPrixGazoleBeynost();

    // Si le prix du Gazole n'est pas trouvé, il faut arrêter le programme
    if (prix_carburant_litre === null) {
        alert("Prix du Gazole introuvable à Beynost.");
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
