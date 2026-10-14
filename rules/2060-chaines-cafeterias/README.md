# Chaînes de cafétérias et assimilés — IDCC 2060

La version `2024.1` reprend l'avenant n° 22 du **11 avril 2024** relatif aux salaires minima, étendu par arrêté du **19 août 2024** publié au Journal officiel du 23 août 2024. L'effet général est fixé au **1er septembre 2024**.

## Règles implémentées

- `niveau et échelon` reçoit les classifications couvertes par le tableau publié ;
- `taux horaire minimum conventionnel` expose les minima horaires des niveaux I à IV, de 11,70 € à 14,10 € ;
- `salaire minimum conventionnel` multiplie ce taux par les heures contractuelles ;
- `rémunération minimum annuelle conventionnelle` conserve en €/an la garantie annuelle des cadres de niveau V et la prorata selon la quotité ;
- `niveau et échelon hors grille` signale les classifications non couvertes.

## Audit explicite des rubriques de paie

L'avenant salarial et le conteneur officiel IDCC 2060 ont été examinés avec une recherche dédiée des accords et avenants relatifs aux cotisations **salarié et employeur**, aux assiettes, taux, plafonds, tranches, forfaits et exonérations. La recherche couvre aussi la complémentaire santé, la prévoyance, la retraite complémentaire, la formation professionnelle, l'AT/MP, les primes, indemnités, repas, travail de nuit ou du dimanche, avantages en nature et frais, ainsi que les arrêtés d'extension.

Aucun taux ou assiette conventionnel générique supplémentaire, calculable avec les seules entrées de ce modèle, n'est retenu. Ces rubriques restent externes et ne sont pas remplacées par zéro. Les primes, indemnités, frais, avantages en nature et modalités individuelles doivent être fournis par le calcul appelant ou par un modèle spécialisé. La garantie annuelle des cadres reste en `€/an` conformément au texte et n'est pas divisée automatiquement par douze.

## Sources officielles

- Avenant n° 22 du 11 avril 2024 relatif aux salaires minima, texte Légifrance `KALITEXT000050140869`.
- Arrêté du 19 août 2024 portant extension, publié au Journal officiel du 23 août 2024.
- Conteneur officiel de la convention collective nationale des chaînes de cafétérias et assimilés, IDCC 2060, `KALICONT000005635326`.
- Recherche des textes officiels dédiés aux cotisations salarié/employeur, assiettes, plafonds, tranches, forfaits, santé, prévoyance, retraite, formation, AT/MP, primes, avantages et frais : aucune règle calculable additionnelle retenue.
