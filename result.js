document.addEventListener('DOMContentLoaded', () => {
    const marge = parseFloat(localStorage.getItem('marge'));
    const prixGazole = parseFloat(localStorage.getItem('prixGazole')); // Récupérer le prix du gazole

    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const retourBtn = document.getElementById('retour-btn');
    const prixGazoleElement = document.getElementById('prix-gazole'); // Élément pour afficher le prix du gazole

    let resultCategory = '';

    if (marge < 20) {
        resultCategory = 'Insuffisante';
        resultTitle.classList.add('red-text');
        retourBtn.classList.add('btn-red');
    } else if (marge >= 20 && marge <= 27) {
        resultCategory = 'Acceptable';
        resultTitle.classList.add('orange-text');
        retourBtn.classList.add('btn-orange');
    } else {
        resultCategory = 'Excellente';
        resultTitle.classList.add('green-text');
        retourBtn.classList.add('btn-green');
    }

    resultTitle.textContent = resultCategory;
    resultMessage.textContent = `La marge de ${marge}%`;
    resultMessage.classList.add('result-message'); // Appliquer la classe pour la taille du texte

    // Afficher le prix du gazole à Beynost en petit sous le message de résultat
    if (!isNaN(prixGazole)) {
        prixGazoleElement.textContent = `Prix actuel du gazole à Beynost : ${prixGazole.toFixed(3)} €/L`;
    } else {
        prixGazoleElement.textContent = "Prix du gazole à Beynost indisponible.";
    }

    // Gestion du bouton retour
    retourBtn.addEventListener('click', () => {
        window.history.back();
    });
});
