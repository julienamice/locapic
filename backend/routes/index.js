var express = require('express');
const fs = require('fs');
const path = require('path');
var router = express.Router();
var bdd = require('../models/bdd')
var userModel = require('../models/user.model')
var positionModel = require('../models/position.model')
var uid2 = require('uid2')
var SHA256 = require('crypto-js/sha256');
var encBase64 = require("crypto-js/enc-base64");
var cloudinary = require('cloudinary').v2
var pictureModel = require('../models/picture.model')
var request = require('request')



cloudinary.config({
  cloud_name: 'dtcdg2plj',
  api_key: '915348134746799',
  api_secret: 'nWRlJGUNapvQpWeDi4EKh-rOwtQ'
});


/* GET home page. */
router.get('/signin', async function (req, res, next) {

  let emailFF = req.query.email
  let passwordFF = req.query.password
  let isLogged = false
  let checkUserDB = await userModel.findOne({
    email: emailFF
  })

  if (checkUserDB) {
    console.log('UserExist')
    let hash = SHA256(passwordFF + checkUserDB.salt).toString(encBase64)

    if (hash === checkUserDB.password) {
      let newToken = uid2(32)
      let updateToken = await userModel.updateOne({ email: emailFF }, { token: newToken })
      isLogged = true
      console.log(isLogged + '   ' + newToken)
      res.json({ isLogged, userToken: newToken, id: checkUserDB.id, user: checkUserDB });
    } else {
      isLogged = false
      res.json({ isLogged, userToken: 'Pas Login' });
    }

  } else {
    console.log('UserNoExist')
    let salt = uid2(32)
    let newToken = uid2(32)
    let newUser = new userModel({
      email: emailFF,
      password: SHA256(passwordFF + salt).toString(encBase64),
      token: newToken,
      salt: salt
    })

    let userSave = await newUser.save()
    console.log(userSave)
    res.json({ userSave });
  }

});

router.post('/logposition', async function (req, res, next) {
  console.log(req.body.id)
  var userCheck = await userModel.findOne({
    id: req.body.userId
  })
  if (userCheck) {
    userCheck.positions.push({ lat: req.body.latitude, long: req.body.longitude })
  }
  console.log(userCheck)
  res.json({ coucou: 'coucou' })
})




router.post('/upload', async function (req, res, next) {

  let newPhoto = req.files.newphoto

  req.files.newphoto.mv(`./public/images/${newPhoto.name}`,
    async function (err) {
      if (err) {
        res.json({ result: false, message: err });
      } else {
        //Envoie et sauvegarde sur cloudary
        var uploadCloud = await cloudinary.uploader.upload(`./public/images/${newPhoto.name}`)
        var urlCloud = uploadCloud.secure_url
        var nameCloud = uploadCloud.original_filename

        //Azure params 
        const subscriptionKey = '45f32aaa10d24ee0a9f21f91273d2f7b';
        const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
        const imageUrl = urlCloud;

        // Request parameters.
        const params = {
          'returnFaceId': 'true',
          'returnFaceLandmarks': 'false',
          'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
            'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
        };

        const options = {
          uri: uriBase,
          qs: params,
          body: '{"url": ' + '"' + imageUrl + '"}',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': subscriptionKey
          }
        };
        //requete pour Azure, analyse  de la photo reconnaissance faciale
        request.post(options, (error, response, body) => {
          if (error) {
            console.log('Error: ', error);
            return;
          }
          let jsonResponse = JSON.parse(body);
          console.log('JSON Response\n');
          console.log(jsonResponse);
          console.log('Gender ' + jsonResponse[0].faceAttributes.gender);
          console.log('age ' + jsonResponse[0].faceAttributes.age);

          //Sauvegarde en base de l'image
          var newPictureDB = new pictureModel({
            pictureName: nameCloud,
            pictureURL: urlCloud,
            pictureInfo: jsonResponse[0]
          })

          var pictureSave = newPictureDB.save()
        });

        var picturesDB = await pictureModel.find()


        //Lecture et suppression des images dans public
        const directory = './public/images/';

        fs.readdir(directory, (err, files) => {
          if (err) throw err;

          for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
              if (err) throw err;
            });
          }
        });

        res.json({ result: true, message: 'File uploaded!', picturesDB: picturesDB });
      }
    })


})



module.exports = router;
