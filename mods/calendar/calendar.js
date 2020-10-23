const saito = require('../../lib/saito/saito');
const ModTemplate = require('../../lib/templates/modtemplate');
const CalendarAppspace = require('./lib/email-appspace/calendar-appspace');



class Calendar extends ModTemplate {

  constructor(app) {
    super(app);

    this.app            = app;
    this.name           = "Calendar";
    this.description    = "Calendar for viewing and making appointments";
    this.categories     = "Utilities";

    this.appointments   = [];
    this.alwaysRun = 1;
    return this;
  }




  respondTo(type) {
    if (type == 'email-appspace') {
      let obj = {};
	  obj.render = this.renderEmail;
	  obj.attachEvents = this.attachEventsEmail;
	  obj.script = `<link href='/saito/lib/fullcalendar/packages/core/main.css' rel='stylesheet' />
    <link href='/saito/lib/fullcalendar/packages/daygrid/main.css' rel='stylesheet' />
    <link href='/saito/lib/fullcalendar/packages/list/main.css' rel='stylesheet' />
    <script src='/saito/lib/fullcalendar/packages/core/main.js'></script>
    <script src='/saito/lib/fullcalendar/packages/daygrid/main.js'></script>
    <script src='/saito/lib/fullcalendar/packages/list/main.js'></script>`;
      return obj;
    }
    return null;
  }
  renderEmail(app, data) {
     data.calendar = app.modules.returnModule("Calendar");;
     CalendarAppspace.render(app, data);
  }
  attachEventsEmail(app, data) {
     data.calendar = app.modules.returnModule("Calendar");;
     CalendarAppspace.attachEvents(app, data);
  }





  onConfirmation(blk, tx, conf, app) {

    let txmsg = tx.returnMessage();
    let calendar = app.modules.returnModule("Calendar");

    if (conf == 0) {

      let publickey = app.wallet.returnPublicKey();

      //
      // save our events
      //
      if (tx.isTo(publickey)) {

        //
        // great lets save this
        //
	let includes_tx = 0;
        for (let i = 0; i < this.appointments.length; i++) {
	  if (this.appointments[i].transaction.sig === tx.transaction.sig) {
	    includes_tx = 1;
	  }
	}
	if (includes_tx == 0) {
	  this.appointments.push(tx);
	}

console.log("ADDING APPOINTMENT: " + JSON.stringify(this.appointments));

        app.storage.saveTransaction(tx);

	//
	// re-render calendar if possible
	//
	try {
	  data = {};
	  data.calendar = this;
	  this.renderEmail(app, data);
	  this.attachEventsEmail(app, data);
	} catch (err) {
	}

      }
    }
  }


  addEvent(event_type="event", event_start=null, event_end=null, title, text) {

    //
    // transaction to end-user, containing msg.request / msg.data is
    //
    let newtx = this.app.wallet.createUnsignedTransactionWithDefaultFee(this.app.wallet.returnPublicKey());
    newtx.transaction.ts   		= new Date().getTime();
    newtx.msg.module       	= "Calendar";
    newtx.msg.type       	= event_type;
    newtx.msg.event_start   = event_start;
    newtx.msg.event_end     = event_end;
    newtx.msg.event_title   = title;
    newtx.msg.event_text    = text;
    newtx = this.app.wallet.signTransaction(newtx);
    this.app.network.propagateTransaction(newtx);


    this.appointments.push(newtx);
  }



  isCalendarActive() {
    let emailmod = this.app.modules.returnModule("Email");
    if (emailmod.browser_active == 1) { return 1; }
    return 0;
  }

  convertTransactionToEvent(tx) {

    let eventobj = {};
        eventobj.title = tx.msg.event_title;
        eventobj.start = tx.msg.event_start;
        eventobj.end   = tx.msg.event_end;
        eventobj.title = tx.msg.event_title;
        eventobj.backgroundColor = 'green',
        eventobj.borderColor = 'green'

    return eventobj;

  }



  //
  // load appointment transactions from archives
  //
  onPeerHandshakeComplete(app, peer) {

    if (this.isCalendarActive() == 0) {
      return;
    }

    this.app.storage.loadTransactions("Calendar", 50, (txs) => {
      for (let i = 0; i < txs.length; i++) {
        this.appointments.unshift(txs[i]);
      }
    });

  }






}

module.exports = Calendar;

