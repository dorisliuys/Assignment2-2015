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
        return item.counts.followed_by;
      });

      var username = data.users.map(function(item){
        return item.username;
      });
      
      yCounts.unshift('Follower Count');

      var chart = c3.generate({

        bindto: '#c3chart',
        
        data: {
          columns: [
            yCounts 
          ],
          type: 'scatter'
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
            label: '# of Followers' 
          }
        }
      });
      hideProgress();

    });
})();


