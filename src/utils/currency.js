/**
 * Affichage des montants en Franc CFA (FCFA).
 * Les prix sont saisis et stockés en FCFA partout (menu, commandes).
 */

/**
 * Formate un montant déjà en FCFA pour l'affichage.
 * @param {number} amountCfa - Montant en FCFA
 * @returns {string} ex. "7 868 FCFA"
 */
export function formatFCFA(amountCfa) {
  if (amountCfa == null || Number.isNaN(Number(amountCfa))) return '0 FCFA'
  const n = Math.round(Number(amountCfa))
  return `${n.toLocaleString('fr-FR')} FCFA`
}
