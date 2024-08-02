// Charger les résultats du localStorage
document.addEventListener('DOMContentLoaded', () => {
    const marge = parseFloat(localStorage.getItem('marge'));

    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const retourBtn = document.getElementById('retour-btn');

    let messageText = '';

    if (marge < 20) {
        messageText = `La marge de ${marge}% est insuffisante\n\npour réaliser ce transport.`;
        resultTitle.style.color = 'red';
        retourBtn.style.backgroundColor = 'red';
    } else if (marge >= 20 && marge <= 27) {
        messageText = `La marge de ${marge}% est acceptable\n\nmais reste moyenne pour ce transport.`;
        resultTitle.style.color = 'yellow';
        retourBtn.style.backgroundColor = 'yellow';
    } else {
        messageText = `La marge de ${marge}% est excellente\n\nvous pouvez effectuer ce transport en toute confiance.`;
        resultTitle.style.color = 'green';
        retourBtn.style.backgroundColor = 'green';
    }

    resultMessage.textContent = messageText;
    resultMessage.classList.add('result-message');

    // Gestion du bouton retour
    retourBtn.addEventListener('click', () => {
        window.history.back();
    });
});
