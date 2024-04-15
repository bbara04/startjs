#!/bin/bash

# Jelenlegi dátum és idő formázása
current_datetime=$(date +"%Y-%m-%d, %H:%M")

# Fájl elérési útja és neve
file_path="./public/last_start.txt"

# Dátum és idő kiírása a fájlba
echo "$current_datetime" > "$file_path"

echo "A dátum és idő ki lett írva a következő fájlba: $file_path"

TOKEN="5499872795:AAGG2XQ-dbjkGZFIDYPdbvvdJa0XN6WYOHo"
CHAT_ID="5302671789"
MESSAGE="Szerver started"
curl -s -X POST https://api.telegram.org/bot$TOKEN/sendMessage -d chat_id=$CHAT_ID -d text="$MESSAGE" > /dev/null

wakeonlan 94:c6:91:17:68:c3