var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  if(req.session.user_id){
    res.redirect('profile');
  }else{
    if(req.query.error){
      res.render('login',{error:"nie ma takiej kombinacji hasła i loginu w naszej bazie danych"});
    }else{
      res.render('login');
    }

 }
});

router.post('/',function(req,res){
  if(!req.session.user_id){
    var login = false;
    req.db.collection('login').find({},{},function(error,item){
      if(error){
        console.log(error);
      }else{
        item.toArray(function(err,tab){
          for(var i=0;i<tab.length;i++){
            if(req.body.login==tab[i].login&&req.body.password==tab[i].haslo){
              login=true;
              req.session.user_id=tab[i].id_uzytkownika;
              var datenow =new Date().toISOString().replace(/T.*/, '');

              req.db.collection("uzytkownicy").update({id_uzytkownika:tab[i].id_uzytkownika},
                {$set:{ostatnie_logowanie:datenow}});
            }
          }
          if(login){
            res.redirect('profile');
          }else{
            res.redirect('/?error=true');
          }
        });
      }
    });
  }else{
    res.redirect('profile');
  }
})

router.get('/wyloguj',function(req,res){
    req.session =null;
    res.redirect('/');
});


router.get('/powiadomienia', function(req, res) {
  if(req.session.user_id){
    req.db.collection('uzytkownicy').find({"id_uzytkownika":req.session.user_id}).toArray(function(error,tab){
      if(error){
        console.log(error);
      }else{
        var powiadomienia = [];
        for(var i=0; i<tab[0].powiadomienia.length;i++){
          powiadomienia.push(tab[0].powiadomienia[i].id);
        }
        req.db.collection("powiadomienia").find({id:{$in:powiadomienia}}).toArray(function(error,tab2){
          if(error){
            console.log(error);
          }else{
            for(var i=0; i<tab2.length;i++){
              for(var j=0; j<tab[0].powiadomienia.length;j++){
                if(tab[0].powiadomienia[j].id==tab2[i].id){
                  tab2[i].status=tab[0].powiadomienia[j].status;
                }
              }
            }
            res.render("powiadomienia",{imie: tab[0].imie,nazwisko: tab[0].nazwisko, logowanie: tab[0].ostatnie_logowanie,
               wiadomosci: tab2});
          }
        });
      }
    });
  }else{
    res.redirect('/');
 }
});

router.post('/powiadomienia',function(req,res){
  req.db.collection('uzytkownicy').update({id_uzytkownika:req.session.user_id,
    powiadomienia:{$elemMatch:{id:parseInt(req.body.wiadomosc)}}},
    {$set:{"powiadomienia.$.status":"przeczytana"}});
  res.send("ok");
});

router.get('/karty', function(req, res) {
  if(req.session.user_id){
    req.db.collection('uzytkownicy').find({"id_uzytkownika":req.session.user_id}).toArray(function(error,tab){
      if(error){
        console.log(error);
      }else{
        req.db.collection("karty").find({id:{$in:tab[0].karty_debetowe}}).toArray(function(error,tab2){
          if(error){
            console.log(error);
          }else{

              res.render("karty",{imie: tab[0].imie,nazwisko: tab[0].nazwisko, logowanie: tab[0].ostatnie_logowanie,
                 karty:tab2})
          }
        });
      }
    });
  }else{
    res.redirect('/');
 }
});

router.post('/karty',function(req,res){
  req.db.collection("karty").update({id:parseInt(req.body.karta)},
  {$set:{status:"zastrzeżona"}});
  res.send("ok");

});

module.exports = router;
