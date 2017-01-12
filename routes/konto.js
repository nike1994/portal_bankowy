var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.user_id){
    req.db.collection('uzytkownicy').find({"id_uzytkownika":req.session.user_id}).toArray(function(error,tab){
      if(error){
        console.log(error);
      }else{
        req.db.collection("rachunki").find({numer:tab[0].rachunek_oszczednosciowy}).toArray(function(error,tab2){
          if(error){
            console.log(error);
          }else{
              res.render("konto",{rachunek: tab2[0], imie: tab[0].imie,
                nazwisko: tab[0].nazwisko, logowanie: tab[0].ostatnie_logowanie});
          }
        });
      }
    });
  }else{
    res.redirect('/');
  }
});


module.exports = router;
