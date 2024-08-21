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

// Coefficient de consommation supplémentaire par tonne
const coefficient_poids = 0.007; // Exemple de coefficient

// URL de l'API pour récupérer les données au format JSON
const url = "https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/prix-des-carburants-en-france-flux-instantane-v2/exports/json";

// Fonction pour récupérer le prix du Gazole à Beynost
async function getPrixGazoleBeynost() {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Échec de la requête : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            let found = false;
            let prixGazole = null;

            for (let station of data) {
                if (station.ville === 'Beynost') {
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
                console.error("Désolé, aucune information sur le prix du Gazole n'a été trouvée pour Beynost.");
            }

            return prixGazole;
        })
        .catch(error => {
            console.error('Erreur:', error);
            return null;  // Retourne null en cas d'erreur pour signaler l'absence de données
        });
}

// Fonction pour calculer le coût du transporteur
function calculerCoutTransporteur(heuresJour, heuresNuit) {
    const salaireJour = heuresJour * salaire_heure_jour;
    const salaireNuit = heuresNuit * salaire_heure_nuit;
    const salaireBrut = salaireJour + salaireNuit;
    return salaireBrut + (salaireBrut * charge_sociale_taux);
}

// Fonction pour calculer le coût variable par kilomètre (CRK) ajusté selon le poids
function calculerCrkAjuste(distanceKm, prixCarburantLitre, poidsAller, poidsRetour) {
    const consommationAller = consommation_tgx * (1 + coefficient_poids * poidsAller);
    const consommationRetour = consommation_tgx * (1 + coefficient_poids * poidsRetour);
    const carburantAller = consommationAller * prixCarburantLitre;
    const carburantRetour = consommationRetour * prixCarburantLitre;

    const chargesVariablesAller = carburantAller + lubrifiant_km + pneumatique_km + entretien_reparations_km;
    const chargesVariablesRetour = carburantRetour + lubrifiant_km + pneumatique_km + entretien_reparations_km;

    // Calcul moyen des coûts pour l'aller-retour
    const chargesVariablesMoyennes = (chargesVariablesAller + chargesVariablesRetour) / 2;
    return chargesVariablesMoyennes;
}

// Fonction pour calculer la rentabilité
function calculerRentabilite(distanceKm, prixVenteFret, crk, coutPeage, coutTransporteur) {
    const coutTotalFret = (crk * distanceKm) + (coutPeage * 4) + coutTransporteur;
    const marge = ((prixVenteFret - coutTotalFret) / prixVenteFret) * 100;
    return { marge, coutTotalFret };
}

// Fonction pour déterminer l'indice de rentabilité
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

// Gestionnaire d'événement pour le formulaire
document.getElementById('freight-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Récupérer les valeurs du formulaire
    const prixVenteFret = parseFloat(document.getElementById('prix_vente_fret').value);
    const heuresJour = parseFloat(document.getElementById('heures_jour').value);
    const heuresNuit = parseFloat(document.getElementById('heures_nuit').value);
    const distanceKm = parseFloat(document.getElementById('distance_km').value);
    const coutPeage = parseFloat(document.getElementById('cout_peage').value);
    const poidsAller = parseFloat(document.getElementById('poids_aller').value);
    const poidsRetour = parseFloat(document.getElementById('poids_retour').value);

    // Vérification des valeurs
    if (isNaN(prixVenteFret) || isNaN(heuresJour) || isNaN(heuresNuit) || isNaN(distanceKm) || isNaN(coutPeage) || isNaN(poidsAller) || isNaN(poidsRetour)) {
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
    const crkAjuste = calculerCrkAjuste(distanceKm, prix_carburant_litre, poidsAller, poidsRetour);
    const { marge, coutTotalFret } = calculerRentabilite(distanceKm, prixVenteFret, crkAjuste, coutPeage, coutTransporteur);
    const indice = indiceRentabilite(marge);

    // Stocker les résultats dans le localStorage
    localStorage.setItem('marge', marge.toFixed(2));
    localStorage.setItem('crk', crkAjuste.toFixed(4));
    localStorage.setItem('coutTotalFret', coutTotalFret.toFixed(2));
    localStorage.setItem('indice', indice);

    // Rediriger vers la page des résultats
    window.location.href = 'result.html';
});
