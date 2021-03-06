//set up spinner
var spinnerVisible = false;

function showProgress() {
  if (!spinnerVisible) {
    $("div#spinner").fadeIn("fast");
    spinnerVisible = true;
  }
}

function hideProgress() {
  if (spinnerVisible) {
    var spinner = $("div#spinner");
spinner.fadeOut("medium");
    spinner.stop();
    spinner.hide();
    spinnerVisible = false;
  }
}



(function() {
  showProgress();

  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
      var yCounts = data.users.map(function(item){
        return item.counts.media;
      });

      var username = data.users.map(function(item){
        return item.username;
      });

      
      yCounts.unshift('Media Count');

      var chart = c3.generate({
        bindto: '#c3chart',
      
        data: {  
          columns: [
            yCounts 
          ]

        },
        axis: {
          x: {
          type: 'category', 
          categories: username,
          tick: {
                rotate: -60,
                multiline: false
            },
            height: 135,
      },
          y: {
            label: '# of Posts' 
          }
        }

    });
      hideProgress();
  }); // END .done
})();
