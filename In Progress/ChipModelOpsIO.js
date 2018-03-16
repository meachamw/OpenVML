	/*
	   Description:  Developed by William Meacham and Frank Marfai in collaboration with Phoenix College and Scottsdale Community College.
	                 This is an Open Educational Resource (OER) designed to help students understand the fundamental concepts of mathematics.
					 For more information, contact William.Meacham@Scottsdalecc.edu  
	                 Copyright 2017: NonCommercial ShareAlike - International 4.0 - 
	*/
	var canvas, stage, container;
	var savedBounds;
	var num1 = 4, num2 = 2, ops;
	var qn = null;
	var chips = [];
	var savedChips = [];
	var chipCount = 0;
	var downTime;
	var clickCount = 0;
	var update = true;
	var currentAlpha = 1;
	var RADIUS = 22.5;
	var currentRow = 1;
	var currentPosCol = 45;
	var currentPosRow = 160
	var currentNegCol = 45;
	var currentNegRow = 205;
	var blammoSS;
	var blammo;
	var blammos = [];
	var questionText = "";
	var snapToGrid = true;
	var tweensOnTheRun = 0;
	var blowingThemUp = false;
	var update = true;
	var score = 0;
	var feedback = "Whoot Whoot";
	var savePoint = 0;

	function initVM() {
		var chipsPassedIn = false;
		qn = getParameterByName("qn");
		var state = getParameterByName("state");
		if (!(qn == null || qn == "" || state == null || state == "" || state == "undefined")) {
			try {
				console.log(getParameterByName("state"));
				var inParams = JSON.parse(atob(getParameterByName("state")));
				//var inParams = { state: JSON.parse(atob("eyJjaGlwcGllcyI6W3sieCI6MTgwLCJ5IjoyMDUsImFscGhhIjoxLCJ2YWwiOjF9LHsieCI6OTAsInkiOjI5NSwiYWxwaGEiOjEsInZhbCI6LTF9LHsieCI6MjI1LCJ5IjoyMDUsImFscGhhIjoxLCJ2YWwiOjF9LHsieCI6MjcwLCJ5IjoyMDUsImFscGhhIjoxLCJ2YWwiOjF9LHsieCI6MTM1LCJ5IjoyOTUsImFscGhhIjoxLCJ2YWwiOi0xfV0sImNoaXBDb3VudCI6NSwiY3VycmVudFBvc0NvbCI6MzE1LCJjdXJyZW50TmVnQ29sIjoxODAsImN1cnJlbnRQb3NSb3ciOjIwNSwiY3VycmVudE5lZ1JvdyI6Mjk1fQ=="))};
				savedChips = inParams.chippies;
				chipCount = inParams.chipCount;
				currentPosCol = inParams.currentPosCol;
				currentNegCol = inParams.currentNegCol;
				currentPosRow = inParams.currentPosRow;
				currentNegRow = inParams.currentPosCol;
				score = inParams.score;
				chipsPassedIn = true;
			}
			catch (e) {
				console.log("Invalid state passed in." + getParameterByName("state"));
			}
		}
		
		var inNum1,inNum2,inOp;
		inNum1 = getParameterByName("num1");
		inNum2 = getParameterByName("num2");
		inOp = getParameterByName("op");
		if (inNum1 != "" && inNum2 != "" && inOp != "" ) {
			num1 = inNum1;
			num2 = inNum2;
			op = inOp;
		}
		
		resize();
		// create stage and point it to the canvas:
		canvas = document.getElementById("testCanvas");
		stage = new createjs.Stage(canvas);

		// enable touch interactions if supported on the current device:
		createjs.Touch.enable(stage);

		// enabled mouse over / out events
		stage.enableMouseOver(10);
		stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas

	    container = new createjs.Container();
		stage.addChild(container);
		blammoSS = new createjs.SpriteSheet({
			framerate: 36,
			"images": ["../images/b.png"],
			"frames": {width:66.66666, height:66.66666},
			"animations": {
				"blammo":{
					frames:[0,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
					next: false
				}
			}
		});
		blammo = new createjs.Sprite(blammoSS,"blammo");
		blammo.x = 200;
		blammo.regX = 33;
		blammo.y = 200;
		blammo.regY = 33;
		createStage();
		container.on("click", function (evt) {clearSelected()});
        stage.addChild(drawChip(250,90,"RED",-1));
        stage.addChild(drawChip(200,90,"YELLOW",1));
        drawZero();
													 
		if (chipsPassedIn) {
			for (var i = 0; i < savedChips.length; i++) {
				stage.addChild(drawSavedChip(savedChips[i]));
			}
		}
		createjs.Ticker.setFPS(20);
		createjs.Ticker.addEventListener("tick", tick);
		update = true;	
	}
	
	function tick(event) {
		if (update || tweensOnTheRun || blowingThemUp) {
			update = false; 
			stage.update(event);		
		}
	}
	
	function resize() {
			var canvas = document.querySelector('canvas');
			var ctx = canvas.getContext('2d');

		console.log("resizing");
		var height = window.innerHeight*.95;

		var ratio = canvas.width/canvas.height;
		var width = height * ratio;

		canvas.style.width = width+'px';
		canvas.style.height = height+'px';
	}

	function stop() {
		createjs.Ticker.removeEventListener("tick", tick);
	}

	function clearSelected() {
		for (var i = 0; i < chips.length; i++)
			chips[i].alpha = 1;
		update = true;
	}
	
	function drawSavedChip(chip) {
		var color = "RED";
		if (chip.val == 1)
			color = "YELLOW";
		var c = new createjs.Container();
		var bg = new createjs.Shape();
		var pt = RADIUS/2;
		bg.graphics.setStrokeStyle(2).beginStroke("#000000");
		bg.graphics.beginFill(color).dc(pt,pt,RADIUS).endFill();
		bg.graphics.mt(pt-(RADIUS-5),pt).lt(pt+(RADIUS-5),pt);
		if (chip.val == 1)
			bg.graphics.mt(pt,pt-(RADIUS-5)).lt(pt,pt+(RADIUS-5));
//		bg.alpha = 0.5;
		c.addChild(bg);
		c.x = chip.x;
		c.y = chip.y;
		c.index = chip.index;
		c.val = chip.val;
		c.alpha = chip.alpha;
		c.regX = RADIUS/2;
		c.regY = RADIUS/2;
		c.onTheMove = false;
		c.greenMile = false;

		c.cursor = "move";

		c.on("mousedown", function (evt) {
			if (c.onTheMove)
				return;
			downTime = new Date().getTime();
			c.oldX = c.x;
			c.oldY = c.y;
			this.parent.addChild(this);
			this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
		});
		c.on("click", function (evt) {
			if (c.ontheMove)
				return;
			var now = new Date().getTime();
			var timesince = now - downTime;
			if (timesince > 400) {
				console.log("to slow for click");
				clickCount = 0;
				downTime = now;
				return;
			}
			if (Math.abs(c.oldX - c.x) >= 2  || Math.abs(c.oldY - c.y) >= 2)
				return;
			clickCount++;
			if (c.y > 100) {
				if (c.alpha == .25)
					c.alpha = 1;
				else
					c.alpha = .25;
			}
			getOut();
		});
		c.on("pressup", function (evt) {
			if (c.onTheMove)
				return;
			update = true;
			if (Math.abs(c.oldX - c.x) < 2 && Math.abs(c.oldY - c.y) < 2)
				return;

			if (c.x < 10 || c.x  > 580 || c.y < 100 || c.y > 350) {
				if (c.index != -1) {
//					chips.splice(c.index,1);
					deleteChip(c);
				}
				else {
					tweensOnTheRun++;
					c.onTheMove = true;
					createjs.Tween.get(c, {loop: false}, null, false)
					.to({x: xloc, y: yloc}, 1000, createjs.Ease.get(1))
					.call(handleTweenComplete);
				}
			} else {
				if (snapToGrid) {
					c.x = Math.round(c.x/45)*45;
					c.y = Math.round((c.y-25)/45)*45+25;
				}
				if (c.val == 1) {
					currentPosRow = c.y;
					currentPosCol = c.x + 45;
				} else {
					currentNegRow = c.y;
					currentNegCol = c.x + 45;
				}
				kill();
			}
			getOut();
		});
		c.on("pressmove", function (evt) {
			if (c.onTheMove)
				return;
			this.x = evt.stageX + this.offset.x;
			this.y = evt.stageY + this.offset.y;
			// indicate that the stage should be updated on the next tick:
			update = true;
		});
		chips.push(c);
		return c;
	}
	
	function drawChip(xloc,yloc,color,val) {
		var c = new createjs.Container();
		var bg = new createjs.Shape();
		var pt = RADIUS/2;
		bg.graphics.setStrokeStyle(2).beginStroke("#000000");
		bg.graphics.beginFill(color).dc(pt,pt,RADIUS).endFill();
		bg.graphics.mt(pt-(RADIUS-5),pt).lt(pt+(RADIUS-5),pt);
		if (val == 1)
			bg.graphics.mt(pt,pt-(RADIUS-5)).lt(pt,pt+(RADIUS-5));
//		bg.alpha = 0.5;
		c.addChild(bg);
		c.x = xloc;
		c.y = yloc;
		c.index = -1;
		c.val = val;
		c.alpha = 1;
		c.regX = RADIUS/2;
		c.regY = RADIUS/2;
		c.onTheMove = false;
		c.greenMile = false;

		if (yloc >= 100) {
			c.index = chipCount;
			chipCount++;
			chips.push(c);
		} else
			c.index = -1;
		c.cursor = "move";

		c.on("mousedown", function (evt) {
			if (c.onTheMove)
				return;
			downTime = new Date().getTime();
			c.oldX = c.x;
			c.oldY = c.y;
			this.parent.addChild(this);
			this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
		});

		c.on("click", function (evt) {
			if (c.ontheMove)
				return;
			var now = new Date().getTime();
			var timesince = now - downTime;
			if (timesince > 400) {
				console.log("to slow for click");
				clickCount = 0;
				downTime = now;
				return;
			}
			if (Math.abs(c.oldX - c.x) >= 2  || Math.abs(c.oldY - c.y) >= 2)
				return;
			clickCount++;
			if (c.y > 100) {
				if (c.alpha == .25)
					c.alpha = 1;
				else
					c.alpha = .25;
				 getOut();
			} else if (c.y <= 100) {
			  if ((c.val == 1 && currentPosCol > 540) ||
			      (c.val == -1 && currentNegCol > 540))
				  return;
				var newY,newX;
				if (c.val == 1) {
					c.row = currentPosRow;
					c.col = currentPosCol;
				    newX = currentPosCol;
					newY = currentPosRow;
					currentPosCol += 45;
				} else {
					c.row = currentNegRow;
					c.col = currentNegCol;
				    newX = currentNegCol;
					newY = currentNegRow;
					currentNegCol += 45;
				}
				tweensOnTheRun++;
				c.onTheMove = true;
				createjs.Tween.get(c, {loop: false}, null, false) // get a new tween targeting circle
				.to({x: newX, y: newY,alpha:currentAlpha}, 1000, createjs.Ease.get(1)) // tween x/y/alpha properties over 1s (1000ms) with ease out
				.call(handleTweenComplete);
				c.index = chipCount;
				chipCount++;
				chips.push(c);
				stage.addChild(drawChip(xloc,yloc,color,val));
			}

		});
		c.on("pressup", function (evt) {
			if (c.onTheMove)
				return;
			update = true;
			if (Math.abs(c.oldX - c.x) < 2 && Math.abs(c.oldY - c.y) < 2)
				return;

			if (c.x < 10 || c.x  > 580 || c.y < 100 || c.y > 350) {
				if (c.index != -1) {
//					chips.splice(c.index,1);
					deleteChip(c);
				}
				else {
					tweensOnTheRun++;
					c.onTheMove = true;
					createjs.Tween.get(c, {loop: false}, null, false)
					.to({x: xloc, y: yloc}, 1000, createjs.Ease.get(1))
					.call(handleTweenComplete);
				}
			} else {
				if (snapToGrid) {
					c.x = Math.round(c.x/45)*45;
					c.y = Math.round((c.y-25)/45)*45+25;
				}
				if (c.val == 1) {
					currentPosRow = c.y;
					currentPosCol = c.x + 45;
				} else {
					currentNegRow = c.y;
					currentNegCol = c.x + 45;
				}

				if (c.index == -1) {
					c.alpha = currentAlpha;
					c.index = chipCount;
					chipCount++;
					chips.push(c);							 
					stage.addChild(drawChip(xloc,yloc,color,val));
				}
			kill();
			}
			getOut();

		});
		c.on("pressmove", function (evt) {
			if (c.onTheMove)
				return;
			this.x = evt.stageX + this.offset.x;
			this.y = evt.stageY + this.offset.y;
			update = true;
		});
		return c;
	}

	function kill() {
		for (var i = 0; i < chips.length-1; i++) {
			if (!chips[i].onTheMove) {
				for (var j = i; j < chips.length; j++) {
					if (!chips[j].onTheMove) {
						if (chips[i].val + chips[j].val == 0 &&
							Math.abs(chips[i].x - chips[j].x) < 20 &&
							Math.abs(chips[i].y - chips[j].y) < 20) {
							chips[i].greenMile = true;
							chips[j].greenMile = true;
						}
					}
				}
			}
		}
		blowUpStacked();
	}
	function handleTweenComplete() {
		this.onTheMove = false;
		tweensOnTheRun--;
		kill();
		getOut();
	}

    function drawZero() {
		var c = new createjs.Container();
		var bg = new createjs.Shape();
		var pt = RADIUS/2;
		bg.graphics.setStrokeStyle(2).beginStroke("#000000");
		bg.graphics.beginFill("RED").dc(30,80,RADIUS).endFill();
		bg.graphics.mt(30-(RADIUS-5),80).lt(30+(RADIUS-5),80);
		bg.alpha = 0.75;
		bg.graphics.setStrokeStyle(2).beginStroke("#000000");
		bg.graphics.beginFill("YELLOW").dc(30,35,RADIUS).endFill();
		bg.graphics.mt(30-(RADIUS-5),35).lt(30+(RADIUS-5),35);
		bg.graphics.mt(30,35-(RADIUS-5)).lt(30,35+(RADIUS-5));
		bg.alpha = 0.75;
		c.addChild(bg);
		c.x = 290;
		c.y = 30;
		c.index = -1;
		c.regX = RADIUS/2;
		c.regY = RADIUS;
		c.cursor = "move";

		c.on("mousedown", function (evt) {
			downTime = new Date().getTime();
			c.oldX = c.x;
			c.oldY = c.y;
			this.parent.addChild(this);
			this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
		});
		c.on("pressmove", function (evt) {
			this.x = evt.stageX + this.offset.x;
			this.y = evt.stageY + this.offset.y;
			// indicate that the stage should be updated on the next tick:
			update = true;
		});
		c.on("pressup", function (evt) {
			update = true;
			if (Math.abs(c.oldX - c.x) < 2 && Math.abs(c.oldY - c.y) < 2)
				return;

			if (c.x < 10 || c.x  > 580 || c.y < 100 || c.y > 300) {
					createjs.Tween.get(c, {loop: false}, null, false)
					.to({x: 290, y: 30}, 1000, createjs.Ease.get(1))
			} else {
				var newX,newY;
				if (snapToGrid) {
					newX = Math.round(c.x/45)*45;
					newY = Math.round((c.y-25)/45)*45+25;
				} else {
				console.log("No Snap");
					newX = c.x+20;
					newY = c.y+12.5;
				}
//				var newX = Math.round((c.x+12.5)/45)*45;
//				var newY = Math.round((c.y-12.5)/45)*45+25;
				stage.addChild(drawChip(newX,newY,"YELLOW",1));
				stage.addChild(drawChip(newX,newY+45,"RED",-1));
				currentPosCol = newX+45;
				currentPosRow = newY;
				currentNegCol = newX+45;
				currentNegRow = newY+45;
				c.x = 290;
				c.y = 30;
				kill();
			}
			getOut();

		});

		stage.addChild(c);
	}

	function placeZeroChips(yellowChip,redChip) {
		var newX, newYellowY,newRedY;
		if (currentPosCol >= currentNegCol) {   // Yellow is further out
			newX = currentPosCol;
			newYellowY = currentPosRow;
			currentPosCol+= 45;
			currentNegCol = currentPosCol;
			if (currentPosRow < currentNegRow &&
				currentPosRow < 535)           // Yellow is higher and room below
				newRedY = currentPosRow + 45;
			else
				newRedY = currentPosRow - 45;  // Yellow is higher, no room below
			currentNegRow = newRedY;
		} else {								// Red is further out
			newX = currentNegCol;
			newRedY = currentNegRow;
			currentNegCol += 45;
			currentPosCol = currentNegCol;
			console.log("row: " + currentPosRow + ":" + currentNegRow);
			console.log("col: " + currentPosCol + ":" + currentNegCol);
			if (currentPosRow < currentNegRow &&
				currentPosRow > 145)            // Red is higher and room above
				newYellowY = currentNegRow - 45;
			else								// Redis higher, no room above
				newYellowY = currentNegRow + 45;
			currentPosRow = newYellowY;
		}
		tweensOnTheRun += 2;
		yellowChip.onTheMove = true;
		createjs.Tween.get(yellowChip, {loop: false}, null, false)
				.to({x: newX, y: newYellowY,alpha:currentAlpha}, 1000, createjs.Ease.get(1))
				.call(handleTweenComplete);
		redChip.onTheMove = true;
		createjs.Tween.get(redChip, {loop: false}, null, false)
				.to({x: newX, y: newRedY,alpha:currentAlpha}, 1000, createjs.Ease.get(1))
				.call(handleTweenComplete);
	}
	function blowEmUp() {
		blowingThemUp = true;
		for (var i = 0; i < chipCount;) {
			if (chips[i].alpha == .25) {
				var blammoClone = blammo.clone();
				blammoClone.x = chips[i].x;
				blammoClone.y = chips[i].y;
				stage.addChild(blammoClone);
				blammos.push(blammoClone);
				var deadChip = chips[i];
				chipCount--;
				chips.splice(i, 1);
				tweensOnTheRun++;
				createjs.Tween.get(deadChip)
					.to({alpha:0, visible:false}, 500)
					.call(handleTweenComplete);
			} else
			  i++;
		}
		setTimeout(clearBlammos, 3000);
	}

	function blowUpStacked() {
		blowingThemUp = true;
		for (var i = 0; i < chipCount;) {
			if (chips[i].greenMile == true) {
				var blammoClone = blammo.clone();
				blammoClone.x = chips[i].x;
				blammoClone.y = chips[i].y;
				stage.addChild(blammoClone);
				blammos.push(blammoClone);
				var deadChip = chips[i];
				chipCount--;
				chips.splice(i, 1);
				tweensOnTheRun++;
				createjs.Tween.get(deadChip)
					.to({alpha:0, visible:false}, 500)
					.call(handleTweenComplete);
			} else
			  i++;
		}
		setTimeout(clearBlammos, 3000);
	}

	function clearBlammos() {
		while (blammos.length > 0) {
			stage.removeChild(blammos.pop());
		}
		blowingThemUp = false;
	}

	function hitTest(chip1,chip2) {
		var distance = Math.sqrt(Math.pow(chip1.x-chip2.x,2)+Math.pow(chip1.y-chip2.y,2));
		return (distance < RADIUS*2);
	}

	function createStage() {
		var resetImage = new Image();
		var oppositeImage = new Image();
		var bombImage = new Image();
		oppositeImage.src = "../images/Opposite.PNG";
		oppositeImage.onload=handleOppositeLoad;
		resetImage.src = "../images/resetButton.png";
		resetImage.onload = handleResetButtonLoad;
		bombImage.src = "../images/bombSmall.png";
		bombImage.onload = handleBombLoad;

		var graphics = new createjs.Graphics();
		graphics.setStrokeStyle(1).beginStroke("#D3D3D3").drawRect(280, 15, 60, 100);
		graphics.setStrokeStyle(1).beginStroke("#D3D3D3").drawRect(5, 5, 580, 420);
		graphics.setStrokeStyle(1).beginStroke("#D3D3D3").drawRect(10, 10, 570, 110);
		graphics.setStrokeStyle(1).beginStroke("#D3D3D3").beginFill("#FFF8DC").drawRect(10, 125, 570, 255);
        graphics.alpha=0.25;
        for (var i = 0; i < 17; i++)
        	graphics.mt(10,140+i*15).lt(580,140+i*15);
        for (var i = 0; i < 37; i++)
        	graphics.mt(25+i*15,124).lt(25+i*15,380);
  		var text = new createjs.Text("Add Zero", "12px Arial", "#000000");
        text.x = 350;
        text.y = 65;
        text.textBaseline = "alphabetic";
        stage.addChild(text);

		var shape = new createjs.Shape(graphics);
        container.addChild(shape);
        if (questionText != "") {
        	var qtext = new createjs.Text("Solve: " + questionText, "18px Arial", "#0000FF");
        	qtext.x = 20;
        	qtext.y = 150;
        	qtext.textBaseline = "alphabetic";
        	stage.addChild(qtext);
        }
        createSnapToGridHotSpot(110,395);
        createSnapToGridHotSpotText(15,410);
	}
	function handleBombLoad(event) {
		var image = event.target;
		var bitmap = new createjs.Bitmap(image);
		stage.addChild(bitmap);
		var text = new createjs.Text("Clear Marked Chips", "12px Arial", "#000000");
        text.x = 450;
        text.y = 100;
        text.textBaseline = "alphabetic";
        stage.addChild(text);
		bitmap.regX = bitmap.image.width / 2 | 0;
		bitmap.regY = bitmap.image.height / 2 | 0;
		bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1;
		bitmap.name = "bmp_resetButton";
		bitmap.cursor = "pointer";
		this.scaleX = this.scaleY = this.scale;

		bitmap.x = 510;
		bitmap.y = 50;
		this.scaleX = this.scaleY = this.scale;
		bitmap.on("rollover", function (evt) {
			this.scaleX = this.scaleY = this.scale * 1.2;
			update = true;
		});
		bitmap.on("click", function(evt) {
				blowEmUp();
		});
	}
	function handleOppositeLoad(event) {
		var image = event.target;
		var bitmap = new createjs.Bitmap(image);
		stage.addChild(bitmap);
		var text = new createjs.Text("Opposite", "12px Arial", "#000000");
        text.x = 20;
        text.y = 95;
        text.textBaseline = "alphabetic";
        stage.addChild(text);
		bitmap.regX = bitmap.image.width / 2 | 0;
		bitmap.regY = bitmap.image.height / 2 | 0;
		bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1;
		bitmap.name = "bmp_resetButton";
		bitmap.cursor = "pointer";
		this.scaleX = this.scaleY = this.scale;
		bitmap.x = 45;
		bitmap.y = 50
		bitmap.on("rollover", function (evt) {
			this.scaleX = this.scaleY = this.scale * 1.2;
			update = true;
		});

		bitmap.on("rollout", function (evt) {
			this.scaleX = this.scaleY = this.scale;
			update = true;
		});

		bitmap.on("click",function (evt) {
			console.log("click");
			var count = 0;
			var flipSelected = false;
			for (var i = 0; i < chips.length; i++) {
				if (chips[i].alpha == .25) {
					flipSelected = true;
					break;
				}
			}
			var color;
			var pt = RADIUS/2;
			for (var i = 0; i < chips.length; i++){
				if ((flipSelected && chips[i].alpha == .25) || !flipSelected) {
					chips[i].val *= -1;
					if (chips[i].val == 1)
						color = "YELLOW";
					else
						color = "RED";
					var bg = chips[i].getChildAt(0);
					bg.graphics.clear().setStrokeStyle(2).beginStroke("#000000");
					bg.graphics.beginFill(color).dc(pt,pt,RADIUS).endFill();
					bg.graphics.mt(pt-(RADIUS-5),pt).lt(pt+(RADIUS-5),pt);
					if (chips[i].val == 1)
						bg.graphics.mt(pt,pt-(RADIUS-5)).lt(pt,pt+(RADIUS-5));
				}
			}
			update = true;
		});

	}
	function handleResetButtonLoad(event) {

		var image = event.target;
		var bitmap = new createjs.Bitmap(image);
		stage.addChild(bitmap);
		var text = new createjs.Text("Start Over", "12px Arial", "#000000");
        text.x = 90;
        text.y = 95;
        text.textBaseline = "alphabetic";
        stage.addChild(text);
		bitmap.regX = bitmap.image.width / 2 | 0;
		bitmap.regY = bitmap.image.height / 2 | 0;
		bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1;
		bitmap.name = "bmp_resetButton";
		bitmap.cursor = "pointer";
		this.scaleX = this.scaleY = this.scale;
		bitmap.x = 120;
		bitmap.y = 50
		bitmap.on("click",function (evt) {
			currentPosCol = 45;
			currentPosRow = 160
			currentNegCol = 45;
			currentNegRow = 205;
			for (var i = 0; i < chips.length; i++)
				chips[i].alpha = .25;
			blowEmUp();
			getOut();

		 });
		bitmap.on("rollover", function (evt) {
			this.scaleX = this.scaleY = this.scale * 1.2;
			update = true;
		});

		bitmap.on("rollout", function (evt) {
			this.scaleX = this.scaleY = this.scale;
			update = true;
		});
	}
	function createSnapToGridHotSpotText(xloc,yloc) {
		var hsText = new createjs.Text("Snap To Grid", "12px Arial", "#000000");
        hsText.x = xloc;
        hsText.y = yloc;
        hsText.textBaseline = "alphabetic";
        stage.addChild(hsText);
    }

	function createSnapToGridHotSpot(xloc,yloc) {
		var hs = new createjs.Shape();
		var radius = 10;
		hs.graphics.beginFill("#0000FF").setStrokeStyle(2);
		hs.graphics.drawCircle(5, 5, 10).endFill();
		hs.x = xloc;
		hs.y = yloc;
		hs.regX = 1.5;
		hs.regY = -1.5;
		hs.selected = false;
		hs.alpha = 1;
		hs.scaleX = hs.scaleY = hs.scale = 1;
		hs.on("rollover", function (evt) {
			this.scaleX = this.scaleY = this.scale * 1.2;
			update = true;
		});
		hs.on("rollout", function (evt) {
			this.scaleX = this.scaleY = this.scale;
			update = true;
		});
		hs.on("click", function (evt) {
			if (snapToGrid == true) {
				snapToGrid = false;
				hs.alpha = .2;
			} else {
				snapToGrid = true;
				hs.alpha = 1;
			}
		});
		stage.addChild(hs);
	}

	function deleteChip(chip) {
		createjs.Tween.get(chip)
		.to({alpha:0, visible:false}, 500)
		.call(deleteChipComplete,[chip]);
	}
	function deleteChipComplete(chip) {
		for (var i = 0; i < chips.length; i++) {
			if (chip == chips[i]) {
				chips.splice(i,1);
				break;
			} 
		}
		chipCount--;
		stage.removeChild(chip);
		getOut();
	}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getOut() {
	if (qn != null) {
		console.log(qn+"::"+score+","+feedback+","+btoa(JSON.stringify(saveState())),'*');
		parent.postMessage(qn+"::"+score+","+feedback+","+btoa(JSON.stringify(saveState())),'*');
	}
}

function saveState() {
	var reportscore = 0;
	var posChips = 0, negChips = 0;

	var chippies = [];
	for (var i = 0; i < chips.length; i++) {
		var saveChip = new Object();
		saveChip.x = chips[i].x;
		saveChip.y = chips[i].y;
		saveChip.alpha = chips[i].alpha;
		saveChip.val = chips[i].val;
//		saveChip.greenMile = chips[i].greenMile;
		chippies[i] = saveChip;
		if (chips[i].val == 1)
			posChips++;
		else	
			negChips++;
	}
	if (posChips == 4 && negChips == 2) 
		score = 1;
	else 
		score = 0;
	if (score == 1 && savePoint == 0) {
		reportscore = 1;
		savePoint = 1;
		console.log("Writing Save Point");
	}
	if (score == 0 && savePoint == 1) {
		reportscore = 0;
		savePoint = 0;
	}
	var state = {
		chippies : chippies,
		chipCount: chipCount,
		currentPosCol: currentPosCol,
		currentNegCol: currentNegCol,
		currentPosRow: currentPosRow,
		currentNegRow: currentNegRow,
		score: score,
		feedback: feedback,
		reportscore: reportscore
	};
	return state;
}

function setLayer(layer){
	var check = "&#10004;";
	if (currentAlpha == .4) {

		currentAlpha = 1;
		document.getElementById("layerOne").innerHTML = "&nbsp;";
	} else {
		currentAlpha = .4;

		document.getElementById("layerOne").innerHTML = "&#10004;";
	}
}
function play_single_sound() {
		document.getElementById('audiotag1').play();
}
