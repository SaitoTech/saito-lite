const NavigationTemplate 	= require('./navigation.template.js');

module.exports = NavigationAppspace = {

    render(app, data) {
      document.querySelector(".navigation").innerHTML = NavigationTemplate();
    },


    attachEvents(app, data) {

      document.querySelector('.covid-back').addEventListener('click', (e) => {
        SplashPage.render(app, data);
        SplashPage.attachEvents(app, data);
      });


    }

}
