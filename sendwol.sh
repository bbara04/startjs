
#!/bin/bash

# Felhasználónév paraméter ellenőrzése
if [ -z "$1" ]; then
    echo "Használat: $0 <felhasználónév>"
    exit 1
fi

# Felhasználónév tárolása
username=$1
ipaddress=$2

TOKEN="7634927453:AAHKziilCwPPLub2iFAUESttmAqqDY4pZPQ"
CHAT_ID="5302671789"
MESSAGE="$username started server at $(date +"%H:%M") from $ipaddress"
curl -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d chat_id=$CHAT_ID -d text="$MESSAGE" > /dev/null

wakeonlan 94:c6:91:17:68:c3