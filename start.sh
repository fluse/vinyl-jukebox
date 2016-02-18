# $(logname) === current user

# open spotify
open /Applications/Spotify.app

# run database
osascript -e 'tell application "Terminal" to do script "mongod"'

# run server
osascript -e 'tell application "Terminal" to do script "cd Sites/vinyl-jukebox/ && npm run dev"'

# run browser in kiosk mode
osascript scripts/kiosk.scpt
