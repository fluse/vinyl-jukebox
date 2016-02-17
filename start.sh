# $(logname) === current user

# open spotify
open /Applications/Spotify.app

# run server
osascript -e 'tell application "Terminal" to do script "cd Sites/vinyl-jukebox/ && npm run dev"'

sleep 2
# run browser in kiosk mode
osascript scripts/kiosk.scpt
