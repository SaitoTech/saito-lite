
    if (card == "howilearned") {

      let twilight_self = this;

      let my_go = 0;

      if (player == "ussr") { this.game.state.milops_ussr = 5; }
      if (player == "us") { this.game.state.milops_us = 5; }

      if (player == "ussr" && this.game.player == 1) { my_go = 1; }
      if (player == "us"   && this.game.player == 2) { my_go = 1; }

      if (my_go == 1) {

	//
	// make DEFCON boxes clickable
	//
	twilight_self.app.browser.addElementToDom('<div id="5" class="set_defcon_box set_defcon_box_5"></div>', "gameboard");
	twilight_self.app.browser.addElementToDom('<div id="4" class="set_defcon_box set_defcon_box_4"></div>', "gameboard");
	twilight_self.app.browser.addElementToDom('<div id="3" class="set_defcon_box set_defcon_box_3"></div>', "gameboard");
	twilight_self.app.browser.addElementToDom('<div id="2" class="set_defcon_box set_defcon_box_2"></div>', "gameboard");
	twilight_self.app.browser.addElementToDom('<div id="1" class="set_defcon_box set_defcon_box_1"></div>', "gameboard");

        $('.set_defcon_box').css('width', twilight_self.scale(120)+"px");
        $('.set_defcon_box').css('height', twilight_self.scale(120)+"px");
        $('.set_defcon_box').css('z-index', 1000);
        $('.set_defcon_box').css('background-color', 'yellow');
        $('.set_defcon_box').css('opacity', 0.5);
        $('.set_defcon_box').css('display', 'block');
        $('.set_defcon_box').css('position', 'absolute');

console.log("1: " + twilight_self.game.state.defcon_ps[4].top);
console.log("1 - scale: " + twilight_self.scale(twilight_self.game.state.defcon_ps[4].top));

        $('.set_defcon_box_1').css('top', twilight_self.scale(twilight_self.game.state.defcon_ps[4].top)+"px");
        $('.set_defcon_box_1').css('left', twilight_self.scale(twilight_self.game.state.defcon_ps[4].left)+"px");

        $('.set_defcon_box_2').css('top', twilight_self.scale(twilight_self.game.state.defcon_ps[3].top)+"px");
        $('.set_defcon_box_2').css('left', twilight_self.scale(twilight_self.game.state.defcon_ps[3].left)+"px");

        $('.set_defcon_box_3').css('top', twilight_self.scale(twilight_self.game.state.defcon_ps[2].top)+"px");
        $('.set_defcon_box_3').css('left', twilight_self.scale(twilight_self.game.state.defcon_ps[2].left)+"px");

        $('.set_defcon_box_4').css('top', twilight_self.scale(twilight_self.game.state.defcon_ps[1].top)+"px");
        $('.set_defcon_box_4').css('left', twilight_self.scale(twilight_self.game.state.defcon_ps[1].left)+"px");

        $('.set_defcon_box_5').css('top', twilight_self.scale(twilight_self.game.state.defcon_ps[0].top)+"px");
        $('.set_defcon_box_5').css('left', twilight_self.scale(twilight_self.game.state.defcon_ps[0].left)+"px");

	$('.set_defcon_box').off();
	$('.set_defcon_box').on('click', function(e) {

	  let defcon_target = parseInt(e.currentTarget.id);

	  let confirm_it = confirm("Set DEFCON at "+defcon_target+"?");
	  if (!confirm_it) { return; }

          twilight_self.addMove("resolve\thowilearned");

          if (defcon_target > twilight_self.game.state.defcon) {
            let defcon_diff = defcon_target-twilight_self.game.state.defcon;
            for (i = 0; i < defcon_diff; i++) {
              twilight_self.addMove("defcon\traise");
            }
          }

          if (defcon_target < twilight_self.game.state.defcon) {
            let defcon_diff = twilight_self.game.state.defcon - defcon_target;
            for (i = 0; i < defcon_diff; i++) {
              twilight_self.addMove("defcon\tlower");
            }
          }

          twilight_self.endTurn();
	  $('.set_defcon_box').remove();

	});



	//
	// and handle with the HUD too
	//
        twilight_self.updateStatus('<div class="status-message" id="status-message">Set DEFCON at level:<ul><li class="card" id="five">five</li><li class="card" id="four">four</li><li class="card" id="three">three</li><li class="card" id="two">two</li><li class="card" id="one">one</li></ul></div>');
       twilight_self.addShowCardEvents(function(action2) {

          let defcon_target = 5;

          twilight_self.addMove("resolve\thowilearned");

          if (action2 == "one")   { defcon_target = 1; }
          if (action2 == "two")   { defcon_target = 2; }
          if (action2 == "three") { defcon_target = 3; }
          if (action2 == "four")  { defcon_target = 4; }
          if (action2 == "five")  { defcon_target = 5; }

          if (defcon_target > twilight_self.game.state.defcon) {
            let defcon_diff = defcon_target-twilight_self.game.state.defcon;
            for (i = 0; i < defcon_diff; i++) {
              twilight_self.addMove("defcon\traise");
            }
          }

          if (defcon_target < twilight_self.game.state.defcon) {
            let defcon_diff = twilight_self.game.state.defcon - defcon_target;
            for (i = 0; i < defcon_diff; i++) {
              twilight_self.addMove("defcon\tlower");
            }
          }

          twilight_self.endTurn();
	  $('.set_defcon_box').remove();

        });
      }
      return 0;
    }



