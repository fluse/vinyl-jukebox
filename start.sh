# $(logname) === current user

# open spotify
open /Applications/Spotify.app

# run server
osascript -e 'tell application "Terminal" to do script "node Sites/vinyl-jukebox/server/start.js"'

# run browser in kiosk mode
osascript scripts/kiosk.scpt
