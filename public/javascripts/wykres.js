function rysuj_wykres(daty,wydatki,tytuly){
  var ctx = document.getElementById("wykres").getContext("2d");
  ctx.canvas.height = 100;
  var wykres = new Chart(ctx,{
    type: 'line',

    data:{
      labels: daty ,
      datasets: [{
              data:wydatki,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
              pointBorderColor: "rgba(2, 141, 196, 1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 10,
              pointHoverBorderWidth: 2,
              pointRadius: 5,
              pointHitRadius: 10
       }],

    },
    options: {
      legend: false,
      tooltips: {
          callbacks: {
              label: function(tooltipItem, data) {
                  var value = data.datasets[0].data[tooltipItem.index];
                  var label = data.labels[tooltipItem.index];
                  var title = tytuly[tooltipItem.index];
                  return label+"\n"+value+ 'PLN \n '+ title;
              },
              title: function(tooltipItem, data) {
                  return tytuly[tooltipItem.index];
              }
          },
          bodyFontSize: 15
      }
    }
  });


}
