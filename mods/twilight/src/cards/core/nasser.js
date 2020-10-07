

    //
    // NASSER
    //
    if (card == "nasser") {

      let original_us = parseInt(this.countries["egypt"].us);
      let influence_to_remove = 0;

      while (original_us > 0) {
        influence_to_remove++;
        original_us -= 2;
      }

      this.removeInfluence("egypt", influence_to_remove, "us");
      this.placeInfluence("egypt", 2, "ussr");
      this.updateStatus("<div class='status-message' id='status-message'>Nasser - Soviets add two influence in Egypt. US loses half (rounded-up) of all influence in Egypt.</div>");
      return 1;


    }



