var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    if(req.session.user_id){
      req.db.collection('uzytkownicy').find({"id_uzytkownika":req.session.user_id}).toArray(function(error,tab){
        if(error){
          console.log(error);
        }else{
          req.db.collection("rachunki").find({numer:tab[0].rachunek}).toArray(function(error,tab2){
            if(error){
              console.log(error);
            }else{
                var wiadomosci = tab[0].powiadomienia;
                var nieprzeczytane=0;
                for(var i=0;i<wiadomosci.length;i++){
                  if(wiadomosci[i].status=="nieprzeczytana"){
                    nieprzeczytane++;
                  }
                }
                res.render("profile",{saldo:tab2[0].saldo, transakcje: tab2[0].transakcje, imie: tab[0].imie,
                  nazwisko: tab[0].nazwisko, logowanie: tab[0].ostatnie_logowanie, wiadomosci: nieprzeczytane})
            }
          });
        }
      });
    }else{
      res.redirect('/');
   }
});


module.exports = router;
