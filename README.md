# Gematria Lab – Prototype

Lokaler Browser-Prototyp eines Gematria-Rechners mit Database Match.

## Enthaltene Ciphers
- Ordinal
- Reduction
- Reverse
- Reverse Reduction
- Standard (English Extended)
- Latin (Agrippa/Jewish)
- Sumerian 6
- Sumerian 2–5 und 7–40
- Reverse Sumerian
- Satanic
- Reverse Satanic
- Primes
- Trigonal
- Squares
- Fibonacci (gespiegelte Gematrinator-Reihe)
- Reverse Primes
- Reverse Trigonal
- Reverse Squares

## Start
`index.html` per Doppelklick im Browser öffnen. Es ist kein Server notwendig.

## Eigene Datenbank
Über „Eigene Datenbank laden“ kann eine `.txt` oder `.csv` importiert werden.

Formate:

    phrase

oder

    phrase,category

Beispiel:

    Golden Gate Bridge,Places
    Aaron Rodgers,NFL
    Apollo,Mythology

Die importierten Daten bleiben nur in der aktuellen Browser-Sitzung. Für eine produktive Version mit Millionen Datensätzen sollte ein Backend (z.B. PostgreSQL + API) verwendet werden.
