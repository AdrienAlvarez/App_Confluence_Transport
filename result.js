document.addEventListener('DOMContentLoaded', () => {
    const marge = parseFloat(localStorage.getItem('marge'));
    const prixGazole = parseFloat(localStorage.getItem('prixGazole')); // Récupérer le prix du gazole

    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const retourBtn = document.getElementById('retour-btn');
    const prixGazoleElement = document.getElementById('prix-gazole'); // Élément pour afficher le prix du gazole

    if (marge < 20) {
        resultMessage.textContent = `La marge de ${marge}% est insuffisante pour réaliser ce transport.`;
        resultTitle.classList.add('red-text');
        retourBtn.classList.add('btn-red');
    } else if (marge >= 20 && marge <= 27) {
        resultMessage.textContent = `La marge de ${marge}% est acceptable, mais reste moyenne pour ce transport.`;
        resultTitle.classList.add('orange-text');
        retourBtn.classList.add('btn-orange');
    } else {
        resultMessage.textContent = `La marge de ${marge}% est excellente, vous pouvez effectuer ce transport en toute confiance.`;
        resultTitle.classList.add('green-text');
        retourBtn.classList.add('btn-green');
    }

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
