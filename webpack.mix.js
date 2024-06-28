// webpack.mix.js

let mix = require('laravel-mix');


//isme first parameter mai daalna hai ki konsi file complile karni hai aur 2nd parameter mai daalna hai ki kaha pe save karni hai
// publicPath mai daalna hai ki kaha pe save karni hai

mix.js('resources/js/app.js', 'public/js/app.js').sass('resources/scss/app.scss', 'public/css/app.css');