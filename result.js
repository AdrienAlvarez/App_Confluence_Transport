// Charger les résultats du localStorage
document.addEventListener('DOMContentLoaded', () => {
    const marge = localStorage.getItem('marge');
    const crk = localStorage.getItem('crk');
    const coutTotalFret = localStorage.getItem('coutTotalFret');
    const indice = localStorage.getItem('indice');

    document.getElementById('marge').textContent = `Marge: ${marge}%`;
    document.getElementById('crk').textContent = `CRK: ${crk} €/km`;
    document.getElementById('cout_total_fret').textContent = `Coût total du fret: ${coutTotalFret} €`;
    document.getElementById('indice').textContent = `Indice de rentabilité: ${indice}`;

    // Gestion du bouton retour
    document.getElementById('retour-btn').addEventListener('click', () => {
        window.history.back();
    });
});
