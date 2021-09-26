

    //
    // return 0 so other cards do not trigger infinite loop
    //
    return 0;
  }






  //
  // arcade uses
  //
  returnShortGameOptionsArray(options) {

    let sgo = super.returnShortGameOptionsArray(options);
    let nsgo = [];

    for (let i in sgo) {
      let output_me = 1;
      if (output_me == 1) {
        nsgo[i] = sgo[i];
      }
    }

    return nsgo;
  }



} // end Twilight class

module.exports = Twilight;



