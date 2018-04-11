	/*
	   Description:  Developed by William Meacham and Frank Marfai in collaboration with Phoenix College and Scottsdale Community College.
	                 This is an Open Educational Resource (OER) designed to help students understand the fundamental concepts of mathematics.
					 For more information, contact William.Meacham@Scottsdalecc.edu  
	                 Copyright 2017: NonCommercial ShareAlike - International 4.0 - 
	*/
	var canvas, stage, container;
	var beanBags = [];
	var tiles = [];
	var selectingTiles = 0;
	var RADIUS = 40;
	var tileCount = 0;
	var multiples = [];
	var activeCount = 0;


    
	function initVM() {
		var dataPassedIn = false;
		qn = getParameterByName("qn");
		var state = getParameterByName("state");
		if (!(qn == null || qn == "" || state == null || state == "" || state == "undefined")) {
			try {
				var inParams = JSON.parse(atob(getParameterByName("state")));
				//var inParams = { state: JSON.parse(atob("eyJjaGlwcGllcyI6W3sieCI6MTgwLCJ5IjoyMDUsImFscGhhIjoxLCJ2YWwiOjF9LHsieCI6OTAsInkiOjI5NSwiYWxwaGEiOjEsInZhbCI6LTF9LHsieCI6MjI1LCJ5IjoyMDUsImFscGhhIjoxLCJ2YWwiOjF9LHsieCI6MjcwLCJ5IjoyMDUsImFscGhhIjoxLCJ2YWwiOjF9LHsieCI6MTM1LCJ5IjoyOTUsImFscGhhIjoxLCJ2YWwiOi0xfV0sImNoaXBDb3VudCI6NSwiY3VycmVudFBvc0NvbCI6MzE1LCJjdXJyZW50TmVnQ29sIjoxODAsImN1cnJlbnRQb3NSb3ciOjIwNSwiY3VycmVudE5lZ1JvdyI6Mjk1fQ=="))};
				savedTiles = inParams.tiles;
				savedMultiples = inParams.multiples
				activeCount = inParams.activeCount;			
				score = inParams.score;
				chipsPassedIn = true;
			}
			catch (e) {
				console.log("Invalid state passed in." + getParameterByName("state"));
			}
		}		
		// create stage and point it to the canvas:
		canvas = document.getElementById("testCanvas");
		stage = new createjs.Stage(canvas);

		// enable touch interactions if supported on the current device:
		createjs.Touch.enable(stage);


		// enabled mouse over / out events
		stage.enableMouseOver(10);
		stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
		if (dataPassedIn) {
			for (var i = 0;
			i < savedTiles.length; i++) {
				stage.addChild(drawSavedTile(savedTile[i]));
			}
			for (var i = 0; i < savedMultiples.length; i++) {
				stage.addChild(drawSavedMultiple(savedMultiples[i]));
			}
		}

 		addStageElements();
		createjs.Ticker.setFPS(50);
		createjs.Ticker.addEventListener("tick", tick);
		update = true;
	}

	function tick(event) {
		if (update || activeCount) {
			update = false; // only update once
			stage.update(event);
		}
	}

	function addStageElements() {
	    container = new createjs.Container();
		stage.addChild(container);

		createStage();
		var tileXloc = 40;
		var tileYloc = 24*40;
		for (var i = 0; i < 144; i++) {
			stage.addChild(createTile(tileXloc,tileYloc,i+2));
			tileXloc+= 40;
			if (tileXloc == 280)
				tileXloc = 40;
			if (tileXloc == 40)
				tileYloc -= 40;
		}
		beanBags[0] = createBeanBag(295,900,"#FF0000",2,"Red");
		beanBags[1] = createBeanBag(295,900,"#FF0000",2,"Red");
		beanBags[2] = createBeanBag(295,860,"#00FF00",3,"Green");
		beanBags[3] = createBeanBag(295,820,"#0000FF",4,"Blue");
		beanBags[4] = createBeanBag(295,780,"#8800FF",5,"Purple");
		beanBags[5] = createBeanBag(295,740,"#444444",6,"Brown");
		beanBags[6] = createBeanBag(295,700,"#FF8800",7,"Orange");
		beanBags[7] = createBeanBag(295,660,"#FFFF00",8,"Yellow");
		beanBags[8] = createBeanBag(295,620,"#AAAAAA",9,"Grey");
		for (var i = 0; i < 9; i++)
			stage.addChild(beanBags[i]);
	}
	function resetAll() {
		stage.clear();
		stage.removeAllChildren();
//		multiples.length = 0;
		multiples = [];
		tileCount = 0;
//		tiles.length = 0;
		tiles = [];
		addStageElements();
		stage.update();
		update = true;
	}

	function stop() {
		createjs.Ticker.removeEventListener("tick", tick);
	}
	function createLabelText(xloc,yloc,label) {
		var hsText = new createjs.Text(label, "12px Arial", "#000000");
        hsText.x = xloc;
        hsText.y = yloc;
        hsText.textBaseline = "alphabetic";
        stage.addChild(hsText);
    }	
    
	function createBeanBag(xloc,yloc,color,val,label) {
		createLabelText(xloc + 30, yloc + 9, label);
		var c = new createjs.Container();
		var bg = new createjs.Shape();
		var pt = RADIUS;
		bg.graphics.setStrokeStyle(2).beginStroke("#000000");
		bg.graphics.beginFill(color).rr(0,0,40,40,3).endFill();
//		bg.alpha = 0.5;
		bg.name = "tile";
		c.addChild(bg);	
		var text = new createjs.Text("Drop", "bold 12px Arial", "#000000");
		text.textAlign="center";
		text.mouseEnabled = false;
        text.x = 20;
        text.y = 25;
        text.textBaseline = "alphabetic";
//        text.visible = false;
        c.addChild(text);
		c.x = xloc;
		c.y = yloc;
		c.rootX = xloc;
		c.rootY = yloc;
		c.index = -1;
		c.val = val;
		c.alpha = 1;
		c.regX = 15;
		c.regY = 15; 
		c.set = false;

		if (yloc >= 100) {
//			c.index = tileCount;
//			tileCount++;
//			tiles.push(c);		
		} else
			c.index = -1;
		c.cursor = "move";
		
		c.on("mousedown", function (evt) {
			downTime = new Date().getTime();
			c.oldX = c.x;
			c.oldY = c.y;
			if (c.set)
				return;
			this.parent.addChild(this);
			this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
			update = true;
		});

		c.on("click", function (evt) {
			if (Math.abs(c.oldX - c.x) > 5 && Math.abs(c.oldY - c.y) > 5)
				return;
			if (!c.set)
				return;
			else {
				c.mult.tweenCount++;
				var nextTile = c.mult.tweenCount*c.mult.val;
				if (nextTile > 145)
					return;
				var col = (nextTile-2) % 6;
				var row = Math.floor((nextTile-2) / 6);
				var xloc = col*40+40;
				var yloc = 960-row*40;
				tossBag(c.x,c.y,xloc,yloc,color,c);
			}
			getOut();	
			update = true;
		});
		c.on("pressup", function (evt) {
			if (c.set) {
				c.x = xloc;
				c.y = yloc;
				return;
			}
			update = true;
			if (Math.abs(c.oldX - c.x) < 2 && Math.abs(c.oldY - c.y) < 2)
				return;
			c.x = Math.round(c.x/40)*40;
			c.y = Math.round(c.y/40)*40;
			c.col = c.x/40-1;
			c.row = 24 - c.y/40;
			c.val = c.row*6+c.col+2;
			console.log(c.x + ":"+c.y + ":" +c.col + ":" + c.row + ":" +c.val);
			if (c.col < 0 || c.col  > 5 || c.row < 0 || c.row > 11 ||
				c.set == true) {
				activeCount++;
				createjs.Tween.get(c, {loop: false}, null, false)
				.to({x: xloc, y: yloc}, 1000, createjs.Ease.get(1))
				.call(handleTweenComplete);
			} else {
				//instantiate object using the constructor function
				var mult = new Multiple(color);
				mult.val = c.val;
				mult.count = 1;
				console.log(mult.getInfo());
				multiples.push(mult);
				drawTileColors();	
				c.set = true;
				c.cursor = "pointer";
				c.mult = mult;
				console.log(c.mult.val);
				c.getChildAt(1).text = "Toss";
				c.x = xloc;
				c.y = yloc;
			}
			update = true;
			return;
//			getOut();

		});
		c.on("pressmove", function (evt) {
			if (!c.set) {
				this.x = evt.stageX + this.offset.x;
				this.y = evt.stageY + this.offset.y;
				update = true;
			}
		});
		return c;
	}
	
	function handleTweenComplete() {
		activeCount--;
	}

	function tossBag(startX,startY,endX,endY,color,parent) {
		var c = new createjs.Container();
		var bg = new createjs.Shape();
		var pt = RADIUS;
		bg.graphics.setStrokeStyle(2).beginStroke("#000000");
		bg.graphics.beginFill(color).rr(0,0,40,40,3).endFill();
//		bg.alpha = 0.5;
		bg.name = "tile";
		c.addChild(bg);	
		c.x = startX;
		c.y = startY;
		c.alpha = 1;
		c.regX = 15;
		c.regY = 15; 
		stage.addChild(c);
		activeCount++;
		createjs.Tween.get(c, {loop: false}, null, false) 
		.to({x: endX, y: endY, rotation: 720}, 750, createjs.Ease.get(1))
		.call(handleComplete);
		function handleComplete() {
			activeCount--;
			stage.removeChild(c);
			update = true;
			parent.mult.count++;
 			drawTileColors();
       }
	}
	function tossAll() {
		var c = new createjs.Container();
		var bg = new createjs.Shape();
		bg.graphics.setStrokeStyle(2).beginStroke("#000000");
		bg.graphics.beginFill("CYAN").rr(0,0,50,50,3).endFill();
		bg.name = "tile";
		bg.alpha = .5;
		c.addChild(bg);	
		var text = new createjs.Text("Toss All", "bold 12px Arial", "#000000");
		text.textAlign="center";
		text.mouseEnabled = false;
        text.x = 25;
        text.y = 25;
        text.textBaseline = "alphabetic";
//        text.visible = false;
        c.addChild(text);		
        c.x = 300;
		c.y = 950;
		c.regX = 15;
		c.regY = 15; 
		c.on("rollover", function (evt) {
				console.log("mouse over");
				bg.alpha = 1;
				update = true;
		});
		c.on("rollout", function (evt) {
				console.log("mouse out");
				bg.alpha = .5;
				update = true;
		});
		c.on("click", function (evt) {
			for (var i = 0; i < multiples.length; i++) {
				multiples[i].count = 144/multiples[i].val;
				multiples[i].tweenCount = multiples[i].count;
			}
			drawTileColors();
		});
		stage.addChild(c);
	}

	function Multiple (color) {
		this.color = color;
		this.val = 0;
		this.count = 1;
		this.tweenCount = 1;
		this.getInfo = function getInfo() {
			return 'A ' + this.val + ' ' + this.color + '.';
		};
	}
 


	function drawTileColors() {
		// Clear color arrays for all tiles
		for (var i = 0; i < 144; i++) {
//			var tile = tiles[i].getChildAt(0);
			var tile = tiles[i].tile;
			tile.colors = [];
//			tile.colors.length = 0;
		}		
		for (var j = 0; j < multiples.length; j++) {
			var fillCount = 0;
			for (var i = multiples[j].val-2; i < 144; i++) {
				if ((i+2)%multiples[j].val == 0) {
					fillCount++;
					var tile = tiles[i].getChildAt(0);
					tile.colors.push(multiples[j].color);
					if (fillCount >= multiples[j].count)
						break;
				}
			}
		}
		for (var i = 0; i < 144; i++) {
//			var tile = tiles[i].getChildAt(0);
			var tile = tiles[i].tile;
			tile.graphics.clear();
			drawTile(tile);
			tile.alpha = .7;
		}
		update = true;
	}
	
	function drawTile(tile) {
		var color = tile.baseColor;
		if (tile.colors.length == 0) {
			color = tile.baseColor;
			tile.graphics.beginFill(color);
			tile.graphics.beginStroke("#000000").rr(0, 0, 40, 40,3);
		} else {
			var rows = tile.colors.length;
			var rowWidth = 40/rows;
			for (var i = 0; i < rows; i++) {
				tile.graphics.beginFill(tile.colors[i]);
				tile.graphics.rr(0, rowWidth*i, 40, rowWidth,3);
			}
		}
		tile.graphics.endFill().setStrokeStyle(2).beginStroke("#000000").rr(0, 0, 40, 40,3);
		update = true;
	}
	function createTile(xloc,yloc,value) {		
		var tC = new createjs.Container();
		tC.x = xloc-15;
		tC.y = yloc-15;
		var tile = new createjs.Shape();
		tile.baseColor = "#FFF8DC";
		tile.colors = [];
		drawTile(tile);
//		tile.graphics.beginFill("CYAN");
//		tile.graphics.setStrokeStyle(1).beginStroke("#000000").rr(0, 0, 40, 40,3);
		tile.alpha = 1;
		tile.name = "tile";
		tC.tile = tile;
		tC.addChild(tile);
//		console.log(tC.tile.name);
		var text = new createjs.Text(value, "bold 20px Arial", "#000000");
		text.textAlign="center";
		text.mouseEnabled = false;
        text.x = 20;
        
        text.y = 25;
        text.textBaseline = "alphabetic";

        tC.addChild(text);
		tC.row = xloc/40;
		tC.col = 23-yloc/40
		tC.selected = false;
		tC.set = false;
		tC.val = tile.row*6+tile.col+2;
		tiles[tileCount] = tC;
		tileCount++;
        return tC;

	}
 
	function createStage() {

		var graphics = new createjs.Graphics();
		graphics.setStrokeStyle(1).beginStroke("#D3D3D3").drawRect(5, 5, 370, 1000);
		graphics.setStrokeStyle(1).beginStroke("#D3D3D3").drawRect(10, 10, 360, 990);
		var shape = new createjs.Shape(graphics);
        container.addChild(shape);
        tossAll();
        var resetImage = new Image();
		resetImage.src = "../images/resetButton.png";
		resetImage.onload = handleResetButtonLoad;
	}
	
	function handleResetButtonLoad(event) {
	
		var image = event.target;
		var bitmap = new createjs.Bitmap(image);
		container.addChild(bitmap);
		var text = new createjs.Text("Start Over", "12px Arial", "#000000");
        text.x = 290;
        text.y = 590;
        text.textBaseline = "alphabetic";
        container.addChild(text);
		bitmap.regX = bitmap.image.width / 2 | 0;
		bitmap.regY = bitmap.image.height / 2 | 0;
		bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1;
		bitmap.name = "bmp_resetButton";
		bitmap.cursor = "pointer";
		this.scaleX = this.scaleY = this.scale;
		bitmap.x = 310;
		bitmap.y = 550
		bitmap.on("click",function (evt) {
			resetAll();
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
	function saveState() {
		var reportscore = 0;

		// 8 colors.  1 bit per color
		// 8 tiles.  Each tile has a stats.  Drop or toss
		var tiles = [];
		for (var i = 0; i < tiles.length; i++) {
			var saveTile = new Object();
			saveTile.x = tiles[i].x;
			saveTile.y = tiles[i].y;
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
		return;
		var outtxt = num100*100+num10*10+num1; 
		if (qn != null) {
			parent.postMessage(qn+"::"+outtxt,'*');
	//		alert(qn+"::"+outtxt);
		}	
	}

	function resize() {
		var canvas = document.querySelector('canvas');
		var ctx = canvas.getContext('2d');

		var height = window.innerHeight;
	
		var ratio = canvas.width/canvas.height;
		var width = height * ratio;
	
		canvas.style.width = width+'px';
		canvas.style.height = height+'px';
	}