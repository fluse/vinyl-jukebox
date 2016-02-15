# app js
browserify -t [ babelify --presets [ es2015 react ] ] ./../src/js/app.js -o ./../public/dist/app.js
