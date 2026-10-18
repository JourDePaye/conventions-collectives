# Presse quotidienne et hebdomadaire en régions — IDCC 3242

La convention collective nationale de la presse quotidienne et hebdomadaire en régions du 9 août 2021 (KALITEXT000044339983) fixe les salaires minima par forme de presse (article 5.6). Le paquet modélise la presse quotidienne régionale (PQR) et la presse hebdomadaire régionale (PHR). La valeur Publicodes est `presse en régions` ; les règles sont sous `salarié . convention collective . presse en régions`.

## Versions

| Version | Date d’effet | Extension | Contenu |
|---|---|---|---|
| [2023.1](3242-presse-regions.2023.1.publicodes), [2023.2](3242-presse-regions.2023.2.publicodes) | 1er juillet 2023 | — | Grille de la PQR seulement. Remplacées par 2023.3. |
| [2023.3](3242-presse-regions.2023.3.publicodes) | 1er juillet 2023 | 1er novembre 2025 | PQR : accord du 30 juin 2023 (KALITEXT000048558839). PHR : accord du 2 juin 2023 (KALITEXT000048052775). |
| [2024.1](3242-presse-regions.2024.1.publicodes) | 1er décembre 2024 | — (non étendu) | Employés de la PHR : avenant n° 1 du 15 novembre 2024 (KALITEXT000051352524). Le reste est inchangé. |

Les deux accords de 2023 ont été étendus par arrêté du 22 septembre 2025 (JORF du 4 octobre 2025, JORFTEXT000052353580). Ils s’appliquent aux adhérents de l’organisation signataire (SPHR) à leur date d’effet, aux autres employeurs le premier jour du mois suivant la publication de l’arrêté, soit le 1er novembre 2025. L’avenant n° 1 n’est pas étendu : il ne lie que les adhérents.

## Règles implémentées

- `forme de presse` : `quotidienne régionale` (défaut) ou `hebdomadaire régionale`.
- `niveau` reçoit :
  - PQR : `O` (ouvriers), `E1` à `E6` (échelons des employés), `C1.1`, `C1.2`, `C2.1`, `C2.2`, `C3.1`, `C3.2`, `C4.1`, `C4.2` (sous-groupes des cadres) ;
  - PHR, version 2023.3 : coefficient des employés (`400`, `407`, `414`, `421`, `428`, `435`, `447`, `462`, `480`, `500`, `520`) ou des cadres (`158`, `170`, `190`, `210`) ;
  - PHR, version 2024.1 : groupe des employés `G1` à `G6`, ou coefficient des cadres.
- `salaire minimum conventionnel . grille` donne le minimum mensuel de la classification dans la grille de la forme de presse :
  - PQR : de 1 782,18 € (ouvriers, employés des échelons 1 et 2) à 3 640,40 € (cadres, coefficient 195) ;
  - PHR, employés en 2023 : 1 834,60 € (SMPG) pour les coefficients 400 à 428, puis de 1 803,08 € (435) à 2 155,40 € (520) ;
  - PHR, employés à partir du 1er décembre 2024 : de 1 900 € (G1) à 2 250 € (G6), majorés de 5 % après 5 ans et de 10 % après 10 ans de présence dans l’entreprise (`ancienneté dans l’entreprise`, en années) ;
  - PHR, cadres : de 2 148,64 € (coefficient 158) à 2 855,79 € (coefficient 210).
- `salaire minimum conventionnel` multiplie la grille par `salarié . contrat . temps de travail . quotité` de `modele-social`. Le montant ne doit donc pas être proratisé une seconde fois.
- `niveau hors grille` signale une classification absente de la grille de la forme de presse. La grille retourne alors `0 €/mois` et l’application doit traiter l’anomalie.

Plusieurs minima sont inférieurs au SMIC mensuel en vigueur depuis juin 2026 (1 867,02 €) : l’application doit retenir le plus élevé des deux montants.

## Limites

- **SMPG de la PHR.** Dans la grille des employés de 2023, la note [1] est appelée sur les coefficients 400 à 435, mais son texte limite le SMPG de 1 834,60 € aux coefficients 400 à 428 : le coefficient 435 garde son montant de 1 803,08 €.
- **Ancienneté.** L’avenant n° 1 compte la présence dans l’entreprise ; l’application peut y inclure une ancienneté reprise à l’embauche.
- La PHR de juin 2023 (accord applicable au 1er juin) n’est couverte qu’à partir du 1er juillet 2023, date d’effet de la première version.
- Les barèmes de la presse quotidienne départementale et des journalistes ne sont pas repris : un employeur de ces familles n’a pas de grille dans ce paquet.
- Aucun accord de salaires postérieur à ceux de 2023 n’a été trouvé pour la PQR, ni pour les cadres de la PHR.
- Les primes (hors majoration d’ancienneté des employés de la PHR), la prévoyance et les autres éléments de la convention ne sont pas modélisés. Les grilles antérieures au 1er juillet 2023 ne le sont pas non plus.
