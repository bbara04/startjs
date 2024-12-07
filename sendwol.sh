
#!/bin/bash

# Felhasználónév paraméter ellenőrzése
if [ -z "$1" ]; then
    echo "Használat: $0 <felhasználónév>"
    exit 1
fi

# Felhasználónév tárolása
username=$1

TOKEN="5499872795:AAGG2XQ-dbjkGZFIDYPdbvvdJa0XN6WYOHo"
CHAT_ID="5302671789"
MESSAGE="$username started server at $(date +"%H:%M")"
curl -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d chat_id=$CHAT_ID -d text="$MESSAGE" > /dev/null

wakeonlan 94:c6:91:17:68:c3