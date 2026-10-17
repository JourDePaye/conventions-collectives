# Industries de carrières et matériaux de construction — IDCC 3249

La version [2026.3](3249-carrieres-materiaux.2026.3.publicodes) modélise les douze accords régionaux du début de 2026 relatifs aux salaires minimaux des ouvriers et ETAM, tous en vigueur au 1er janvier 2026 et étendus. Elle remplace la version [2026.2](3249-carrieres-materiaux.2026.2.publicodes), de même date d'effet, qui ne modélisait que l'accord Île-de-France (sa grille est reprise à l'identique). La 2026.2 remplaçait elle-même la [2026.1](3249-carrieres-materiaux.2026.1.publicodes), dont la grille inventait un échelon 1.3 et décalait toutes les clés suivantes. Les révisions antérieures restent publiées telles quelles (leurs empreintes sont verrouillées) mais ne sont plus sélectionnées.

## Règles implémentées

- `niveau et échelon` accepte les niveaux 1 à 7 de la grille ouvriers et ETAM : échelons 1 et 2 pour le niveau 1, échelons 1 à 3 pour les niveaux 2 à 7 (20 clés, de `1.1` à `7.3`).
- `région` choisit la grille : le nom de la région de l'accord (tableau ci-dessous), selon le département de l'établissement (article 2 de chaque accord). `'hors champ'` (outre-mer) ou `'non renseigné'` : pas de minimum conventionnel.
- `région couverte` est vraie pour les douze régions des accords.
- `salaire minimum conventionnel` expose le minimum mensuel brut de la grille régionale et le prorata selon la quotité de travail.
- `niveau et échelon hors grille` signale, dans une région couverte, les classifications absentes de la grille (par exemple `1.3`) ; il n'est pas applicable hors des régions couvertes.

Chaque accord exclut les entreprises de fabrication d'éléments en béton et d'éléments préfabriqués en béton pour la construction (code 2361.Z), soumises à l'accord national d'harmonisation du 11 avril 2024 (KALITEXT000050051829), non modélisé. Les cadres relèvent d'un accord national distinct (accord du 18 février 2025) et ne sont pas modélisés.

## Accords régionaux (article 5 : entrée en vigueur le 1er janvier 2026)

| Région | Accord | Légifrance | Arrêté d'extension | Départements (article 2) |
|---|---|---|---|---|
| Auvergne-Rhône-Alpes | 20 mars 2026 | KALITEXT054825928 | 6 juillet 2026 (JORF du 10 juillet 2026) | 01, 03, 07, 15, 26, 38, 42, 43, 63, 69, 73, 74 |
| Bourgogne-Franche-Comté | 11 mars 2026 | KALITEXT054454616 | 11 juin 2026 (JORF du 27 juin 2026) | 21, 25, 39, 58, 70, 71, 89, 90 |
| Bretagne | 3 mars 2026 | KALITEXT054802237 | 11 juin 2026 (JORF du 27 juin 2026) | 22, 29, 35, 56 |
| Centre-Val de Loire | 24 février 2026 | KALITEXT054371003 | 21 mai 2026 (JORF du 29 mai 2026) | 18, 28, 36, 37, 41, 45 |
| Grand Est | 19 février 2026 | KALITEXT054262441 | 5 mai 2026 (JORF du 8 mai 2026) | 08, 10, 51, 52, 54, 55, 57, 67, 68, 88 |
| Hauts-de-France | 16 mars 2026 | KALITEXT054337826 | 21 mai 2026 (JORF du 29 mai 2026) | 02, 59, 60, 62, 80 |
| Île-de-France | 19 mars 2026 | KALITEXT054337807 | 21 mai 2026 (JORF du 29 mai 2026) | 75, 77, 78, 91, 92, 93, 94, 95 |
| Normandie | 6 février 2026 | KALITEXT054304128 | 5 mai 2026 (JORF du 8 mai 2026) | 14, 27, 50, 61, 76 |
| Nouvelle-Aquitaine | 12 mars 2026 | KALITEXT054337788 | 21 mai 2026 (JORF du 29 mai 2026) | 16, 17, 19, 23, 24, 33, 40, 47, 64, 79, 86, 87 |
| Occitanie | 13 mars 2026 | KALITEXT054454633 | 11 juin 2026 (JORF du 27 juin 2026) | 09, 11, 12, 30, 31, 32, 34, 46, 48, 65, 66, 81, 82 |
| Pays de la Loire | 17 février 2026 | KALITEXT054304146 | 5 mai 2026 (JORF du 8 mai 2026) | 44, 49, 53, 72, 85 |
| Sud PACA et Corse | 11 mars 2026 | KALITEXT054802256 | 11 juin 2026 (JORF du 27 juin 2026) | 04, 05, 06, 13, 83, 84 et Corse |

## Grilles mensuelles 2026 (article 3 de chaque accord, en euros)

ARA : Auvergne-Rhône-Alpes, BFC : Bourgogne-Franche-Comté, BRE : Bretagne, CVL : Centre-Val de Loire, GE : Grand Est, HDF : Hauts-de-France, IDF : Île-de-France, NOR : Normandie, NA : Nouvelle-Aquitaine, OCC : Occitanie, PDL : Pays de la Loire, PACA : Sud PACA et Corse.

| Niveau-échelon | ARA | BFC | BRE | CVL | GE | HDF | IDF | NOR | NA | OCC | PDL | PACA |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 1.1 | 1 876 | 1 836 | 1 852 | 1 825 | 1 839 | 1 856 | 1 840 | 1 828 | 1 832 | 1 862 | 1 855 | 1 863 |
| 1.2 | 1 885 | 1 879 | 1 861 | 1 867 | 1 877 | 1 872 | 1 866 | 1 843 | 1 850 | 1 886 | 1 861 | 1 926 |
| 2.1 | 1 896 | 1 897 | 1 865 | 1 874 | 1 884 | 1 874 | 1 874 | 1 862 | 1 864 | 1 894 | 1 878 | 1 933 |
| 2.2 | 1 918 | 1 930 | 1 893 | 1 896 | 1 913 | 1 915 | 1 903 | 1 879 | 1 886 | 1 923 | 1 900 | 1 962 |
| 2.3 | 1 971 | 1 974 | 1 943 | 1 949 | 1 955 | 1 951 | 1 957 | 1 918 | 1 936 | 1 980 | 1 951 | 2 018 |
| 3.1 | 1 982 | 1 986 | 1 963 | 1 963 | 1 963 | 1 960 | 1 969 | 1 928 | 1 950 | 1 989 | 1 967 | 2 027 |
| 3.2 | 2 014 | 2 025 | 1 983 | 1 988 | 2 006 | 1 991 | 2 000 | 1 949 | 1 980 | 2 020 | 1 994 | 2 058 |
| 3.3 | 2 071 | 2 067 | 2 039 | 2 043 | 2 047 | 2 046 | 2 060 | 1 995 | 2 030 | 2 080 | 2 048 | 2 116 |
| 4.1 | 2 081 | 2 081 | 2 048 | 2 059 | 2 058 | 2 056 | 2 069 | 2 020 | 2 044 | 2 090 | 2 063 | 2 128 |
| 4.2 | 2 114 | 2 122 | 2 082 | 2 088 | 2 108 | 2 092 | 2 104 | 2 059 | 2 077 | 2 127 | 2 093 | 2 160 |
| 4.3 | 2 186 | 2 178 | 2 148 | 2 157 | 2 164 | 2 159 | 2 178 | 2 118 | 2 143 | 2 201 | 2 164 | 2 234 |
| 5.1 | 2 188 | 2 188 | 2 159 | 2 170 | 2 171 | 2 165 | 2 187 | 2 133 | 2 158 | 2 206 | 2 174 | 2 241 |
| 5.2 | 2 254 | 2 262 | 2 222 | 2 231 | 2 254 | 2 236 | 2 252 | 2 207 | 2 223 | 2 274 | 2 237 | 2 308 |
| 5.3 | 2 405 | 2 394 | 2 371 | 2 377 | 2 387 | 2 380 | 2 409 | 2 342 | 2 370 | 2 399 | 2 385 | 2 465 |
| 6.1 | 2 447 | 2 435 | 2 409 | 2 423 | 2 431 | 2 422 | 2 451 | 2 355 | 2 418 | 2 439 | 2 431 | 2 501 |
| 6.2 | 2 536 | 2 536 | 2 500 | 2 511 | 2 539 | 2 517 | 2 546 | 2 485 | 2 512 | 2 533 | 2 516 | 2 597 |
| 6.3 | 2 733 | 2 711 | 2 691 | 2 701 | 2 718 | 2 708 | 2 748 | 2 666 | 2 699 | 2 735 | 2 710 | 2 797 |
| 7.1 | 2 784 | 2 766 | 2 744 | 2 761 | 2 770 | 2 761 | 2 814 | 2 695 | 2 767 | 2 791 | 2 769 | 2 851 |
| 7.2 | 2 948 | 2 940 | 2 905 | 2 920 | 2 955 | 2 929 | 2 975 | 2 903 | 2 932 | 2 959 | 3 043 | 3 021 |
| 7.3 | 3 207 | 3 169 | 3 157 | 3 168 | 3 191 | 3 179 | 3 240 | 3 142 | 3 191 | 3 223 | 3 169 | 3 283 |

Base de 35 heures par semaine ou 151,67 heures par mois (article 4 de chaque accord, article 16.1 de la convention). Pour la Bourgogne-Franche-Comté et le Grand Est, le tableau publié rappelle aussi les valeurs de 2025 ; pour Sud PACA et Corse, la colonne de l'accord du 11 mars 2026 est la seconde.

## Audit des rubriques de paie

Les accords inspectés portent sur les salaires minima. Ils ne modifient pas de manière générique et calculable par ce modèle l'assiette, les taux ou plafonds de cotisations, la santé, la prévoyance, la formation professionnelle, les exonérations, les avantages en nature ou les règles AT/MP. Aucun endpoint payroll-wide n'est redéfini ; ces éléments restent hors périmètre plutôt que d'être déduits automatiquement.

## Sources officielles

- Les douze accords régionaux ci-dessus, sur Légifrance (container KALICONT000050551393).
- Convention collective nationale des industries de carrières et matériaux de construction du 6 juillet 2022, étendue par arrêté du 24 septembre 2024 (JORF du 17 novembre 2024).
