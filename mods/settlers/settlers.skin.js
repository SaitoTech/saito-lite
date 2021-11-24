class SettlersSkin {

	constructor(){
	}

	render(option = "classic"){
		console.log("Skin Option:",option);
		
		switch(option){
			case "elements":
			this.c1 = {name: "shrine", svg:`<svg viewbox="0 0 200 200" stroke="black"><line x1="25" x2="175" y1="30" y2="30" stroke-width="15px"/><line x1="45" x2="155" y1="70" y2="70"  stroke-width="9px"/><line x1="55" x2="30" y1="30" y2="200"  stroke-width="21px"/><line x1="145" x2="170" y1="30" y2="200"  stroke-width="21px"/>
	<line x1="100" x2="100" y1="30" y2="70"  stroke-width="18px"/></svg>`};
				this.c2 = {name: "pagoda", svg:`<svg viewbox="0 0 200 200"><polygon points="100,0 160,30, 120,25 120,40 170,70 130,65 130,100 180,130 140,125 140,180 190,180 200,200 0,200 10,180 60,180 60,125 20,130 70,100 70,65 30,70 80,40 80,25 40,30"/></svg>`};
				this.r = {name: "foot path"};
				this.b = {name: "demon"};
				this.s = {name: "yinyang master", img:`<i class="fas fa-magic"></i>`};
				this.t = {name: "nature"};
				this.vp = {name: "Mana", svg:`<svg viewbox="0 0 200 200"><circle fill="gold" cx="100" cy="100" r="95" stroke="goldenrod" stroke-width="5"/> <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="132px" fill="saddlebrown">1</text></svg>`};
				this.longest = {name: "Philosopher's Path",svg:`<svg viewbox="0 0 200 200"><circle fill="gold" cx="100" cy="100" r="95" stroke="goldenrod" stroke-width="5"/>
		      						<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="132px" fill="saddlebrown">2</text></svg>`};
				this.largest = {name:"Largest Yinyang Bureau",svg:`<svg viewbox="0 0 200 200"><circle fill="silver" cx="100" cy="100" r="95" stroke="goldenrod" stroke-width="5"/>
		      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="132px" fill="saddlebrown">2</text></svg>`};
				this.resources = [{name: "fire",count:3,ict:1,tile:"/settlers/img/sectors/brick1.png",card:"/settlers/img/cards/brick.png"},
								  {name: "wood",count:4,ict:1,tile:"/settlers/img/sectors/wood1.png",card:"/settlers/img/cards/wood.png"},
								  {name: "earth",count:4,ict:1,tile:"/settlers/img/sectors/_wheat1.png",card:"/settlers/img/cards/wheat_old.png"},
								  {name: "water",count:4,ict:1, tile:"/settlers/img/sectors/wool1.png",card:"/settlers/img/cards/wool.png"},
								  {name: "metal",count:3,ict:1, tile:"/settlers/img/sectors/ore1.png",card:"/settlers/img/cards/ore.png"},
								  {name: "desert",count:1,ict:1}];

								  //Order is IMPORTANT, settlers.js references priceList by index number
				this.priceList = [["fire","wood"],["fire","wood","earth","water"],["metal","metal","metal","earth","earth"],["metal","water","earth"]];
				this.cardDir = "/settlers/img/cards/";
				this.back = "/settlers/img/cards/red_back.png"; //Hidden Resource cards 
				this.card = {name: "meditation", back: "/settlers/img/cards/red_back.png"};
				this.deck = [{ card : "Yinyang Shi",count:14, img: "/settlers/img/cards/wizard.png", action:1},
							 { card : "Elixir of Life" ,count:2, img : "/settlers/img/cards/potion.png" , action : 2 },
							 { card : "Possession" , count:2, img : "/settlers/img/cards/treasure.png" , action : 3 },
							 { card : "Pilgrimage" , count:2, img : "/settlers/img/cards/wagon.png" , action : 4},
							 { card : "Apostles" , count:1, img : "/settlers/img/cards/drinking.png", action: 0 },
						     { card : "Armed Alcolytes" , count:1, img : "/settlers/img/cards/knight.png", action: 0 },
						     { card : "Gift Shop" , count:1, img : "/settlers/img/cards/shop.png", action: 0 },
						     { card : "Scriptures" , count:1, img : "/settlers/img/cards/scroll.png", action: 0 },
						     { card : "Monastery" , count:1, img : "/settlers/img/cards/church.png", action: 0 }];	
				this.gametitle = "Alchemists of Saitoa";			
				this.winState = "annointed high priest";
			break;
			
			default: //Classic
				this.c1 = {name: "village", svg:`<svg viewbox="0 0 200 200"><polygon points="0,75 100,0, 200,75 200,200 0,200"/></svg>`};
				this.c2 = {name: "city", svg:`<svg viewbox="0 0 200 200"><polygon points="0,100 100,100, 100,50 150,0 200,50 200,200 0,200"/></svg>`};
				this.r = {name: "road"};
				this.b = {name: "bandit"};
				this.s = {name: "knight", img:`<i class="fas fa-horse-head"></i>`};
				this.t = {name: "bank"};
				this.vp = {name: "VP", svg:`<svg viewbox="0 0 200 200"><circle fill="gold" cx="100" cy="100" r="95" stroke="goldenrod" stroke-width="5"/> <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="132px" fill="saddlebrown">1</text></svg>`};
				this.longest = {name: "Longest Road",svg:`<svg viewbox="0 0 200 200"><circle fill="gold" cx="100" cy="100" r="95" stroke="goldenrod" stroke-width="5"/>
		      						<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="132px" fill="saddlebrown">2</text></svg><i class="fas fa-road" style="color:goldenrod;"></i>`};
				this.largest = {name:"Largest Army",svg:`<svg viewbox="0 0 200 200"><circle fill="silver" cx="100" cy="100" r="95" stroke="goldenrod" stroke-width="5"/>
		      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="132px" fill="saddlebrown">2</text></svg><i class="fas fa-horse-head" style="color:goldenrod;"></i>`};
				this.resources = [{name: "brick",count:3,ict:3,icon:"/settlers/img/icons/brick-icon.png"},
								  {name: "wood",count:4,ict:3,icon:"/settlers/img/icons/wood-icon.png"},
								  {name: "wheat",count:4,ict:1,icon:"/settlers/img/icons/wheat-icon.png"},
								  {name: "wool",count:4,ict:1,icon:"/settlers/img/icons/wool-icon.png"},
								  {name: "ore",count:3,ict:3,icon:"/settlers/img/icons/ore-icon.png"},
								  {name: "desert",count:1,ict:1}];

								  //Order is IMPORTANT
				this.priceList = [["brick","wood"],["brick","wood","wheat","wool"],["ore","ore", "ore","wheat","wheat"],["ore","wool","wheat"]];
				this.cardDir = "/settlers/img/cards/";
				this.back = "/settlers/img/cards/red_back.png"; //Hidden Resource cards 
				this.card = {name: "development", back: "/settlers/img/cards/red_back.png"};
				this.deck = [{ card : "Knight",count:14, img: "/settlers/img/cards/knight.png", action:1},
							 { card : "Unexpected Bounty" ,count:2, img : "/settlers/img/cards/treasure.png" , action : 2 },
							 { card : "Legal Monopoly" , count:2, img : "/settlers/img/cards/scroll.png" , action : 3 },
							 { card : "Caravan" , count:2, img : "/settlers/img/cards/wagon.png" , action : 4},
							 { card : "Microbrewery" , count:1, img : "/settlers/img/cards/drinking.png", action: 0 },
						     { card : "Bazaar" , count:1, img : "/settlers/img/cards/shop.png", action: 0 },
						     { card : "Advanced Industry" , count:1, img : "/settlers/img/cards/windmill.png", action: 0 },
						     { card : "Cathedral" , count:1, img : "/settlers/img/cards/church.png", action: 0 },
						     { card : "Chemistry" , count:1, img : "/settlers/img/cards/potion.png", action: 0 }];
				this.gametitle="Settlers of Saitoa";
				this.winState="elected governor";		
		}
		this.rules = [`Gain 1 ${this.vp.name}.`,
						`Move the ${this.b.name} to a tile of your choosing`,
						`Gain any two resources`,
						`Collect all cards of a resource from the other players`,
						`Build 2 ${this.r.name}s`];
	}



	resourceArray(){
		let newArray = [];
		for (let i of this.resources){
			if (i.count>1)
				newArray.push(i.name);
		}
		return newArray;
	}

	resourceObject(){
		let newObj = {};
		for (let i of this.resources){
			newObj[i.name] = 0;
		}
		return newObj;	
	}

	resourceCard(res){
		for (let i of this.resources){
			if (i.name == res){
				if (i.card)
					return i.card;
				else return `${this.cardDir}${res}.png`;
			}

		}
		return null;	
	}

	resourceIcon(res){
		for (let i of this.resources){
			if (i.name == res){
				if (i.icon){
					return i.icon;
				}
			}
		}
		return null;
	}

	
	/*
		Return the name of the "desert" (i.e. the singular, non-producing tile)
	*/
	nullResource(){
	   for (let i of this.resources)
	   	if (i.count==1)
	   		return i.name;
	}
///settlers/img/sectors/${this.game.state.hexes[i].resource}${x}.png">`
	returnHexes(){
		let hexes = [];
    	for (let i of this.resources){
    		for (let j = 0; j < i.count; j++){
    			if (i.tile) hexes.push({resource:i.name,img: i.tile});
    			else hexes.push({resource:i.name, img: this.randomizeTileImage(i)});
    		}

    	}
	    return hexes;
	}

	randomizeTileImage(resObj){
		let tileDir = "/settlers/img/sectors/";
		let x = Math.ceil(Math.random()*resObj.ict); 
		return tileDir+resObj.name+x+".png";
	}

	returnDeck(option){
	 let deck = [];
	 for (let i of this.deck){
    	for (let j = 0; j < i.count; j++){
    		deck.push(i);
    	}
	 }
	 return deck;
	}

	isActionCard(cardname){
		for (let c of this.deck){
			if (cardname == c.card && c.action>0)
				return true;
		}
		return false;
	}
}

module.exports = SettlersSkin