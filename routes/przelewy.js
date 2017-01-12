var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.session.user_id){
    req.db.collection('uzytkownicy').find({"id_uzytkownika":req.session.user_id}).toArray(function(error,tab){
      if(error){
        console.log(error);
      }else{
          res.render("przelewy",{imie: tab[0].imie,nazwisko: tab[0].nazwisko, logowanie: tab[0].ostatnie_logowanie,
             rachunek:tab[0].rachunek, rachunek_oszczednosciowy:tab[0].rachunek_oszczednosciowy});
      }
    });
  }else{
    res.redirect('/');
 }
});

router.post('/', function(req,res){
  if(req.session.user_id){
    req.db.collection('rachunki').find({numer:req.body.rachunek}).toArray(function(error,tab){
      if(error){
        console.log(error);
      }else{
        req.db.collection("rachunki").find({numer:req.body.z_rachunku}).toArray(function(error,tab2){
          if(error){
            console.log(error);
          }else{
            var saldo = (parseFloat(tab2[0].saldo)-parseFloat(req.body.kwota)).toFixed(2);
            var datenow =new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');;

            if(tab[0]){
              req.db.collection("uzytkownicy").find({id_uzytkownika:tab[0].id_uzytkownika}).toArray(function(error,uzytkownik){
                if(error){
                  console.log(error);
                }else{
                  req.db.collection("uzytkownicy").find({id_uzytkownika:tab2[0].id_uzytkownika}).toArray(function (error,uzytkownik2) {
                    if(error){
                      console.log(error);
                    }else{
                      var odbiorca=uzytkownik[0].imie+' '+uzytkownik[0].nazwisko;
                      req.db.collection("rachunki").update({numer:req.body.z_rachunku},
                         {$push:{transakcje:{"data":datenow,"nazwa_odbiorcy": odbiorca,
                         "tytul":req.body.tytul,"kwota":parseFloat("-"+req.body.kwota),"saldo":tab2[0].saldo}}});
                      req.db.collection("rachunki").update({numer:req.body.z_rachunku},{$set:{"saldo":saldo}});

                      odbiorca = uzytkownik2[0].imie+' '+uzytkownik2[0].nazwisko;
                      saldo = (parseFloat(tab[0].saldo) + parseFloat(req.body.kwota)).toFixed(2);
                      req.db.collection("rachunki").update({numer:req.body.rachunek},
                        {$push:{transakcje:{"data":datenow,"nazwa_odbiorcy":odbiorca,
                        "tytul":req.body.tytul,"kwota":req.body.kwota,"saldo":tab[0].saldo}}});
                      req.db.collection("rachunki").update({numer:req.body.rachunek},{$set:{"saldo":saldo}});
                      res.redirect('/');
                    }
                  });
                }
              });
            }else{
              req.db.collection("rachunki").update({numer:req.body.z_rachunku},
                 {$push:{transakcje:{"data":datenow,"nazwa_odbiorcy":req.body.rachunek,
                 "tytul":req.body.tytul,"kwota":parseFloat("-"+req.body.kwota),"saldo":tab2[0].saldo}}});
              req.db.collection("rachunki").update({numer:req.body.z_rachunku},{$set:{"saldo":saldo}});
            }
          }
        });
      }
    });
  }else{
    res.redirect('/');
 }
});


module.exports = router;
