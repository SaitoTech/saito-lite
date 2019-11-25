
  let hand1 = ["D13","C12","C11","C10","C9","C1","C5"];
  let h1score = scoreHand(hand1);

  let hand2 = ["S5","D5","H5","C2","H10","D13","C1"];
  let h2score = scoreHand(hand2);

  let winner = pickWinner(h1score, h2score);

console.log(h1score);
console.log(h2score);
console.log("WINNER: " + winner);


  function pickWinner(score1, score2) {

    if (score1.hand_description == "royal flush" && score2.hand_description == "royal flush") {
      if (returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
	return 2;
      }
      return 0;
    }
    if (score1.hand_description == "royal flush") { return 1; }
    if (score2.hand_description == "royal flush") { return 2; }


    if (score1.hand_description == "straight flush" && score2.hand_description == "straight flush") {
      if (returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
	return 1;
      } else {
        return 2;
      }
      return 0;
    }
    if (score1.hand_description == "straight flush") { return 1; }
    if (score2.hand_description == "straight flush") { return 2; }


    if (score1.hand_description == "four-of-a-kind" && score2.hand_description == "four-of-a-kind") {
      if (returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
      return 0;
    }
    if (score1.hand_description == "four-of-a-kind") { return 1; }
    if (score2.hand_description == "four-of-a-kind") { return 2; }


    if (score1.hand_description == "full house" && score2.hand_description == "full house") {
      if (returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
      return 0;
    }
    if (score1.hand_description == "full house") { return 1; }
    if (score2.hand_description == "full house") { return 2; }


    if (score1.hand_description == "flush" && score2.hand_description == "flush") {
      if (returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
      return 0;
    }
    if (score1.hand_description == "flush") { return 1; }
    if (score2.hand_description == "flush") { return 2; }


    if (score1.hand_description == "straight" && score2.hand_description == "straight") {
      if (returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
      return 0;
    }
    if (score1.hand_description == "straight") { return 1; }
    if (score2.hand_description == "straight") { return 2; }


    if (score1.hand_description == "three-of-a-kind" && score2.hand_description == "three-of-a-kind") {
      if (returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
        return 1;
      } else {
        return 2;
      }
      return 0;
    }
    if (score1.hand_description == "three-of-a-kind") { return 1; }
    if (score2.hand_description == "three-of-a-kind") { return 2; }


    if (score1.hand_description == "two pair" && score2.hand_description == "two pair") {
      if (parseInt(score1.cards_to_score[0].substring(1)) > parseInt(score2.cards_to_score[0].substring(1))) {
        return 1;
      } else {
        if (parseInt(score1.cards_to_score[0].substring(1)) < parseInt(score2.cards_to_score[0].substring(1))) {
	  return 2;
	} else {
          if (parseInt(score1.cards_to_score[2].substring(1)) > parseInt(score2.cards_to_score[2].substring(1))) {
	    return 1;
	  } else {
            if (parseInt(score1.cards_to_score[2].substring(1)) < parseInt(score2.cards_to_score[2].substring(1))) {
	      return 2;
	    } else {
              if (returnHigherCard(score1.cards_to_score[4], score2.cards_to_score[4]) == score1.cards_to_score[4]) {
		return 1;
	      } else {
		return 2;
	      }
	    }
	  }
	}
        return 2;
      }
    }
    if (score1.hand_description == "two pair") { return 1; }
    if (score2.hand_description == "two pair") { return 2; }


    if (score1.hand_description == "pair" && score2.hand_description == "pair") {
      if (parseInt(score1.cards_to_score[0].substring(1)) > parseInt(score2.cards_to_score[0].substring(1))) {
        return 1;
      } else {
        if (parseInt(score1.cards_to_score[0].substring(1)) < parseInt(score2.cards_to_score[0].substring(1))) {
	  return 2;
        }
      }
    }
    for (let z = 2; z < score1.cards_to_score.length; z++) {
      if (returnHigherCard(score1.cards_to_score[z], score2.cards_to_score[z]) == score1.cards_to_score[z]) {
	return 1;
      } else {
	return 2;
      }
    }
    if (score1.hand_description == "pair") { return 1; }
    if (score2.hand_description == "pair") { return 2; }


    if (score1.hand_description == "highest card" && score2.hand_description == "highest card") {
      if (returnHigherCard(score1.cards_to_score[0], score2.cards_to_score[0]) == score1.cards_to_score[0]) {
	return 1;
      } else {
	return 2;
      }
    }
    if (score1.hand_description == "highest card") { return 1; }
    if (score2.hand_description == "highest card") { return 2; }

  }



  function scoreHand(hand) {

    let x = convertHand(hand);
    let suite = x.suite;
    let val   = x.val;

    let idx = 0;
    let pairs = [];
    let three_of_a_kind = [];
    let four_of_a_kind = [];
    let straights = [];
    let full_house = [];
    

    //
    // identify pairs
    //
    idx = 1;
    while (idx < 14) {
      let x = isTwo(suite, val, idx);
      if (x == 0) {
	idx = 14;
      } else {
	pairs.push(x);
	idx = x+1;
      }
    } 
 

    //
    // identify triples
    //
    idx = 1;
    while (idx < 14) {
      let x = isThree(suite, val, idx);
      if (x == 0) {
	idx = 14;
      } else {
	three_of_a_kind.push(x);
	idx = x+1;
      }
    }  


    //
    // identify quintuples
    //
    idx = 1;
    while (idx < 14) {
      let x = isFour(suite, val, idx);
      if (x == 0) {
	idx = 14;
      } else {
	four_of_a_kind.push(x);
	idx = x+1;
      }
    }  


    //
    // identify straights
    //
    idx = 1;
    while (idx < 10) {
      let x = isStraight(suite, val, idx);
      if (x == 0) {
	idx = 11;
      } else {
	straights.push(x);
	idx = x+1;
      }
    }


    //
    // remove triples and pairs that are four-of-a-kind
    //
    for (let i = 0; i < four_of_a_kind.length; i++) {

      for( var z = 0; z < three_of_a_kind.length; z++){ 
        if ( three_of_a_kind[z] === four_of_a_kind[i]) {
          three_of_a_kind.splice(z, 1);
	}
      }

      for( var z = 0; z < pairs.length; z++){ 
        if ( pairs[z] === four_of_a_kind[i]) {
          pairs.splice(z, 1);
	}
      }

    }


    //
    // remove pairs that are also threes
    //
    for (let i = 0; i < three_of_a_kind.length; i++) {
      for( var z = 0; z < pairs.length; z++){ 
        if ( pairs[z] === three_of_a_kind[i]) {
          pairs.splice(z, 1);
	}
      }
    }



    //
    // now ready to identify highest hand
    //
    // royal flush
    // straight flush
    // four-of-a-kind		x
    // full-house
    // flush
    // straight			x
    // three-of-a-kind		x
    // two-pair
    // pair				x
    // high card
    //
    let cards_to_score = [];
    let hand_description = "";
    let highest_card = [];


    //
    // ROYAL FLUSH
    //
    if (straights.includes(10)) {
      if (isFlush(suite, val) != "") {
	let x = isFlush(suite, val);
	if (
	  isCardSuite(suite, val, 1,  x) == 1 &&
	  isCardSuite(suite, val, 13, x) == 1 && 
	  isCardSuite(suite, val, 12, x) == 1 && 
	  isCardSuite(suite, val, 11, x) == 1 && 
	  isCardSuite(suite, val, 10, x) == 1 
	) {
	  cards_to_score.push("1"+x); 
	  cards_to_score.push("13"+x); 
	  cards_to_score.push("12"+x); 
	  cards_to_score.push("11"+x); 
	  cards_to_score.push("10"+x); 
	  hand_description = "royal flush";
	  return { cards_to_score : cards_to_score , hand_description : hand_description };
	}
      }  
    }
   
 
    //
    // STRAIGHT FLUSH
    //
    if (straights.length > 0) {
      if (isFlush(suite, val) != "") {
  	let x = isFlush(suite, val);
        for (let i = straights.length-1; i >= 0; i--) {
  	  if (
	    isCardSuite(suite, val, straights[i]+4,  x) == 1 &&
	    isCardSuite(suite, val, straights[i]+3,  x) == 1 && 
	    isCardSuite(suite, val, straights[i]+2,  x) == 1 && 
	    isCardSuite(suite, val, straights[i]+1,  x) == 1 && 
	    isCardSuite(suite, val, straights[i],    x) == 1  
	  ) {
	    cards_to_score.push((straights[i]+4)+x); 
	    cards_to_score.push((straights[i]+3)+x); 
	    cards_to_score.push((straights[i]+2)+x); 
	    cards_to_score.push((straights[i]+1)+x); 
	    cards_to_score.push((straights[i])+x); 
	    hand_description = "straight flush";
	    return { cards_to_score : cards_to_score , hand_description : hand_description };
	  }
	}

      }  
    }
    
    //
    // FOUR OF A KIND
    //
    if (four_of_a_kind.length > 0) {

      if (four_of_a_kind.includes(1)) {
        cards_to_score = ["C1","D1","H1","S1"];
        highest_card = returnHighestCard(suite, val, cards_to_score);
        cards_to_score.push(highest_card);
        hand_description = "four-of-a-kind";
        return { cards_to_score : cards_to_score , hand_description : hand_description }
      }

      cards_to_score = [
	"C"+(four_of_a_kind[four_of_a_kind.length-1]),
	"D"+(four_of_a_kind[four_of_a_kind.length-1]),
	"H"+(four_of_a_kind[four_of_a_kind.length-1]),
	"S"+(four_of_a_kind[four_of_a_kind.length-1])
      ]
      highest_card = returnHighestCard(suite, val, cards_to_score);
      hand_description = "four-of-a-kind";
      cards_to_score.push(highest_card);
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }
    

 
    //
    // FULL HOUSE
    //
    if (three_of_a_kind.length > 0 && pairs.length > 0) {

      let highest_suite = "C";

      for (let i = 0; i < val.length; i++) {
	if (val[i] == three_of_a_kind[three_of_a_kind.length-1]) {
	  if (isHigherSuite(suite[i], highest_suite)) {
	    highest_suite = suite[i];
          }
	  cards_to_score.push(suite[i] + val[i]);
	}
      }
      highest_card = highest_suite + three_of_a_kind[three_of_a_kind.length-1];

      for (let i = 0; i < val.length; i++) {
	if (val[i] == pairs[pairs.length-1]) {
	  cards_to_score.push(suite[i] + val[i]);
	}
      }

      hand_description = "full house";
      return { cards_to_score : cards_to_score , hand_description : hand_description , highest_card : highest_card };
    }


 
    //
    // FLUSH
    //
    if (isFlush(suite, val) != "") {

      let x = isFlush(suite, val);
      let y = [];

      for (let i = 0; i < val.length; i++) {
	if (suite[i] == x) {
	  y.push(val[i]);
	}
      }

      // y now contians onyl in-suite vals
      y.sort();
      y.splice(0, (y.length-5));
      for (let i = y.length-1; i >= 0;  i--) { cards_to_score.push(x + y[i]); }

      hand_description = "flush";
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }



    //
    // STRAIGHT
    //
    if (isStraight(suite, val) > 0) {

      let x = isStraight(suite, val);

console.log("STRAIGHT STARTING AT: " + x);

      if (x == 10) {
	cards_to_score.push(returnHighestSuiteCard(suite, val, 1));
	cards_to_score.push(returnHighestSuiteCard(suite, val, 13));
	cards_to_score.push(returnHighestSuiteCard(suite, val, 12));
	cards_to_score.push(returnHighestSuiteCard(suite, val, 11));
	cards_to_score.push(returnHighestSuiteCard(suite, val, 10));
      } else {
        for (let i = 4; i > 0; i--) {
	  cards_to_score.push(returnHighestSuiteCard(suite, val, x+i));
        }
      }
      hand_description = "straight";
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }


    //
    // THREE OF A KIND
    //
    if (three_of_a_kind.length > 0) {

      let x = three_of_a_kind[three_of_a_kind.length-1];
      let y = [];

console.log(x);

      let cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
	if (val[i] == x) {
console.log("pushing: " + suite[i] + " -- " + val[i]);
	  y.push(suite[i]+val[i]);
	  val.splice(i, 1);
	  suite.splice(i, 1);
	  cards_remaining--;
          i--;
	}
      }

      for (let i = 0; i < y.length; i++) {
        cards_to_score.push(y[i]);
      }

      let remaining1 = returnHighestCard(suite, val);
      let remaining2 = returnHighestCard(suite, val, [remaining1]);
console.log("remaining: " + remaining1 + " -- " + remaining2);
      let remaining_cards = sortByValue([remaining1, remaining2]);
      for (let i = 0; i < remaining_cards.length; i++) {
        cards_to_score.push(remaining_cards[i]);
      }

      hand_description = "three-of-a-kind";
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }


    //
    // TWO PAIR
    //
    if (pairs.length > 1) {

      let x = pairs[pairs.length-1];
      let y = pairs[pairs.length-2];

      if (x > y) { highest_card = x; }
      else { highest_card = y; }

      cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
	if (val[i] == x || val[i] == y) {
	  cards_to_score.push(suite[i]+val[i]);
	  val.splice(i, 1);
	  suite.splice(i, 1);
	  cards_remaining--;
	  i--;
	}
      }

      let remaining1 = returnHighestCard(suite, val, cards_to-score);
      cards_to_score.push(remaining1);
      hand_description = "two pair";

      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }


    //
    // A PAIR
    //
    if (pairs.length > 0) {

      let x = pairs[pairs.length-1];
      let y = [];

      let cards_remaining = val.length;
      for (let i = 0; i < cards_remaining; i++) {
	if (val[i] == x) {
	  y.push(suite[i]+val[i]);
	  val.splice(i, 1);
	  suite.splice(i, 1);
	  cards_remaining--;
	  i--;
	}
      }

      let remaining1 = returnHighestCard(suite, val);
      let remaining2 = returnHighestCard(suite, val, [remaining1]);
      let remaining3 = returnHighestCard(suite, val, [remaining1, remaining2]);

      let cards_remaining2 = sortByValue([remaining1, remaining2, remaining3]);
      cards_to_score.push(y[0]);
      cards_to_score.push(y[1]);
      for (let i = 0; i < cards_remaining2.length; i++) {
        cards_to_score.push(cards_remaining2[i]);
      }
      hand_description = "pair";
      return { cards_to_score : cards_to_score , hand_description : hand_description };

    }



    //
    // HIGHEST CARD
    //
    let remaining1 = returnHighestCard(suite, val);
    let remaining2 = returnHighestCard(suite, val, [remaining1]);
    let remaining3 = returnHighestCard(suite, val, [remaining1, remaining2]);
    let remaining4 = returnHighestCard(suite, val, [remaining1, remaining2. remaining3]);
    let remaining5 = returnHighestCard(suite, val, [remaining1, remaining2, remaining3, remaining4]);

    hand_description = "highest card";
    highest_card = remaining1;
    return { cards_to_score : cards_to_score , hand_description : hand_description };

  }




  function convertHand(hand) {

    let x = {};
        x.suite = [];
        x.val = [];

    for (let i = 0; i < hand.length; i++) {
      x.suite.push(hand[i][0]);
      x.val.push(parseInt(hand[i].substring(1)));
    }


    return x;

  }


  function sortByValue(cards) {

    let x = convertHand(cards);
    let suite = x.suite;
    let val   = x.val;
    let y = [];

    let cards_length = cards.length;
    while (cards_length > 0) {
      let highest_card = cards[0];
      let highest_card_idx = 0;
      for (let i = 1; i < cards_length; i++) {
        if (returnHigherCard(highest_card, cards[i]) == cards[i]) {
	  highest_card = cards[i];
	  highest_card_idx = i;
	}
      }
      y.push(highest_card);
      cards.splice(highest_card_idx, 1);
      cards_length = cards.length;
    }

    return y;
  }


  function returnHigherCard(card1, card2) {

    let card1_suite = card1[0];
    let card1_val = parseInt(card1.substring(1));

    let card2_suite = card2[0];
    let card2_val = parseInt(card2.substring(1));

    if (card1_val == 1) { card1_val == 14; }
    if (card2_val == 1) { card2_val == 14; }

    if (card1_val > card2_val) { return card1; }
    if (card2_val > card1_val) { return card2; }
    if (card2_val == card1_val) { 
      if (isHigherSuite(card1_suite, card2_suite)) {
	return card1;
      } else {
	return card2;
      }
    }

  }


  function isHigherSuite(currentv, newv) {
    if (currentv === "S") { return 1; }
    if (newv == "S") { return 0; }
    if (currentv === "H") { return 1; }
    if (newv == "H") { return 0; }
    if (currentv === "D") { return 1; }
    if (newv == "D") { return 0; }
    if (currentv === "C") { return 1; }
    if (newv == "C") { return 0; }
  }


  function returnHighestSuiteCard(suite, val, x) {

    let suite_to_return = "C";
    let card_to_return = "";

    for (let i = 0; i < val.length; i++) {
      if (val[i] == x) {
        if (card_to_return != "") {
	  if (isHigherSuite(suite_to_return, suite[i])) {
	    suite_to_return = suite[i];
	    card_to_return = suite[i] + val[i];
	  }
	} else {
	  suite_to_return = suite[i];
	  card_to_return = suite[i] + val[i];
	}
      }
    }
    return card_to_return;
  }

  function returnHighestCard(suite, val, noval=[], less_than=14) {

    let highest_card = 0;
    let highest_suite = "C";
    let highest_idx = 0;

    for (let i = 0; i < val.length; i++) {

      if (noval.includes((suite[i]+val[i]))) {
      } else {

        if (highest_card == 1) { 
          if (val[i] == 1) {
	    if (isHigherSuite(suite[i], highest_suite)) {
              highest_idx = i;
  	      highest_card = 1;
  	      highest_suite = suite[i];
	    }
	  }
        } else {
  	  if (val[i] > highest_card && val[i] < less_than) {
	    if (isHigherSuite(suite[i], highest_suite)) {
              highest_idx = i;
  	      highest_card = val[i];
  	      highest_suite = suite[i];
	    } else {
	    }
          }
          if (val[i] == 1 && less_than == 14) {
	    if (isHigherSuite(suite[i], highest_suite)) {
              highest_idx = i;
  	      highest_card = val[i];
  	      highest_suite = suite[i];
	    }
          }
        }
      }
    }
    return highest_suite + highest_card;
  }



  function isFlush(suite, val) {

    let total_clubs = 0;    
    let total_spades = 0;    
    let total_hearts = 0;    
    let total_diamonds = 0;    

    for (let i = 0; i < suite.length; i++) {
      if (suite[i] == "C") {
	total_clubs++;
      }
      if (suite[i] == "D") {
	total_diamonds++;
      }
      if (suite[i] == "H") {
	total_hearts++;
      }
      if (suite[i] == "S") {
	total_spades++;
      }
    }

    if (total_clubs >= 5) { return "C"; }
    if (total_spades >= 5) { return "S"; }
    if (total_hearts >= 5) { return "H"; }
    if (total_diamonds >= 5) { return "D"; }

    return "";

  }



  function isFour(suite, val, low=1) {

    for (let i = (low-1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
	if (val[z] == (i+1)) {
	  total++;
	  if (total == 4) {
	    return (i+1);
	  }
	}
      }
    }

    return 0;

  }




  function isThree(suite, val, low=1) {

    for (let i = (low-1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
	if (val[z] == (i+1)) {
	  total++;
	  if (total == 3) {
	    return (i+1);
	  }
	}
      }
    }

    return 0;

  }



  function isTwo(suite, val, low=1) {

    for (let i = (low-1); i < 13; i++) {
      let total = 0;
      for (let z = 0; z < val.length; z++) {
	if (val[z] == (i+1)) {
	  total++;
	  if (total == 2) {
	    return (i+1);
	  }
	}
      }
    }

    return 0;

  }




  


  function isStraight(suite, val, low=1) {

    for (let i = (low-1); i < 10; i++) {

      //
      // catch royal straight
      //
      if (i == 9) {

	if (
	  val.includes(13) &&
	  val.includes(12) &&
	  val.includes(11) &&
	  val.includes(10) &&
	  val.includes(1)
        ) { 
	  return 10;
        }
	return 0;
      };

      if (
	val.includes((i+1)) &&
        val.includes((i+2)) &&
        val.includes((i+3)) &&
        val.includes((i+4)) &&
        val.includes((i+5))
      ) {
	return (i+1);
      }

    }

    return 0;

  }


  function isCardSuite(suite, val, card, s) {
    for (let i = 0; i < val.length ; i++) {
      if (val[i] == card) {
	if (suite[i] == s) {
	  return 1;
	}
      }
    }
    return 0;
  }




