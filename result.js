// Charger les résultats du localStorage
document.addEventListener('DOMContentLoaded', () => {
    const marge = parseFloat(localStorage.getItem('marge'));

    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const retourBtn = document.getElementById('retour-btn');

    if (marge < 20) {
        resultMessage.textContent = `La marge de ${marge}% est insuffisante pour réaliser ce transport.`;
        resultTitle.style.color = 'red';
        retourBtn.style.backgroundColor = 'red';
    } else if (marge >= 20 && marge <= 27) {
        resultMessage.textContent = `La marge de ${marge}% est acceptable, mais reste moyenne pour ce transport.`;
        resultTitle.style.color = 'yellow';
        retourBtn.style.backgroundColor = 'yellow';
    } else {
        resultMessage.textContent = `La marge de ${marge}% est excellente, vous pouvez effectuer ce transport en toute confiance.`;
        resultTitle.style.color = 'green';
        retourBtn.style.backgroundColor = 'green';
    }

    // Gestion du bouton retour
    retourBtn.addEventListener('click', () => {
        window.history.back();
    });
});
