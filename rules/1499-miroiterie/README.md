# Miroiterie, transformation et négoce du verre — IDCC 1499

La version `2025.1` modélise l'accord du **26 mars 2025** relatif aux salaires minima professionnels au 1er mai 2025, étendu par arrêté du **13 juin 2025**.

La valeur Publicodes est `miroiterie transformation négoce verre` et les règles sont sous `salarié . convention collective . miroiterie`.

## Règles implémentées

- `coefficient` sélectionne les 17 coefficients publiés, de 140 à 880 ;
- `salaire minimum conventionnel` expose le minimum mensuel brut pour 151,67 heures et le prorata selon la quotité de travail ;
- `salaire minimum horaire` expose le SMP horaire publié ;
- `prime ancienneté horaire` applique les paliers de 3 %, 6 %, 9 %, 12 % et 15 % aux coefficients concernés ;
- `prime de panier de nuit` expose séparément le montant fixé par l'accord ;
- `coefficient hors grille` signale les coefficients non publiés et le minimum retourne zéro.

## Audit des rubriques de paie

L'accord modifie les minima et la prime de panier de nuit. Il ne fournit pas de taux ou d'assiette générique de cotisations, de santé, de prévoyance, de formation professionnelle, d'exonération, d'avantage en nature ou d'AT/MP calculable sans données supplémentaires. Ces rubriques restent donc hors périmètre ; les primes et remboursements ne sont pas intégrés automatiquement au minimum mensuel.

## Sources officielles

- Accord du 26 mars 2025 relatif aux salaires minima professionnels (SMP) au 1er mai 2025, Légifrance, `KALITEXT000051910288`.
- Arrêté du 13 juin 2025 portant extension de l'accord, publié au Journal officiel du 19 juin 2025.
- Convention collective nationale de la miroiterie, de la transformation et du négoce du verre du 9 mars 1988, IDCC 1499.
