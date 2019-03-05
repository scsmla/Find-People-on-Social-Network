## Find-People-on-Social-Network

#### Requirement
First need npm, node installed `sudo apt install node`

Install cmake(for face recognition) `sudo apt-get install cmake`

Install libx11 for the dlib GUI `sudo apt-get install libx11-dev`

Install libpng for reading images `sudo apt-get install libpng-dev`

#### How to make it work

Provide an image of wanted user in imgTest folder

Run `npm install` to install necessary module

Run `npm start` to get data from the specific user

Provide fb account in credential.rem.js save it as credential.js to make next step work

Run `node login_fb` to compare users and find them

