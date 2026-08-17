Game.Win('Third-party');
if(CallTrackerHelper === undefined) var CallTrackerHelper = {};
if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/' + (0 ? 'Beta/' : '') + 'CCSE.js');
CallTrackerHelper.name = 'Call Tracker Helper';
CallTrackerHelper.pic = 'https://arjun-sharma12.github.io/img/alchemylab.png';
CallTrackerHelper.version = '1.1';
CallTrackerHelper.GameVersion = '2.058';

CallTrackerHelper.launch = function(){
	CallTrackerHelper.init = function(){
        CallTrackerHelper.colorLookup = {
            'golden': 	'#ff00ff', 
			'reindeer': '#ff7f00', 
            'News':     '#00FF00',
            'Stocks':   '#7F7FFF',
            'Redraw':   '#7F7F7F',
			'JPL':      '#007f00',
            'default':  '#ff00ff'
        }

        Game.customStatsMenu.push(function(){
			CCSE.AppendStatsVersionNumber(CallTrackerHelper.name, CallTrackerHelper.version);
		});
		
		CCSE.CreateSpecialObject('Insuppressible Timer', 
			function(){return true;}, 
			function(picframe){
				picframe.pic = CallTrackerHelper.pic;
				picframe.frame = 0;
			}, 
			CallTrackerHelper.ToggleSpecialMenu
		);

        Game.customDrawSpecial.push(CallTrackerHelper.Update);
		
		CCSE.customLoad.push(function(){
			l('specialPopup').className='framed prompt offScreen';
		});
		
		CallTrackerHelper.isLoaded = 1;
    }

    CallTrackerHelper.ToggleSpecialMenu = function(str){
		str = CCSE.SetSpecialMenuImage(str, CallTrackerHelper.pic, 0);
		
		str += '<h3>Insuppressibles</h3>' + 
			   '<div class="line"></div>' + 
			   '<div id="InsuppressiblesBar" style="text-align:left;margin-bottom:4px;"></div>';
		
		return str;
	}

    CallTrackerHelper.bar = function(name, bars, time) {
        var div = document.createElement('div');
		div.style.width = '100%';
		div.style.height = '10px';
		div.style.margin = 'auto';
		div.style.position = 'absolute';
		div.style.left = '0px';
		div.style.top = '0px';
		div.style.right = '0px';
		div.style.bottom = '0px';

		var type = document.createElement('span');
		type.style.display = 'inline-block';
		type.style.textAlign = 'right';
		type.style.width = '117px';
		type.style.marginRight = '5px';
		type.style.verticalAlign = 'text-top';
		type.textContent = name;
		div.appendChild(type);

		for (var i = 0; i < bars.length; i++) {
			var colorBar = document.createElement('span');
			colorBar.id = bars[i].id
			colorBar.style.display = 'inline-block';
			colorBar.style.height = '10px';
			if (bars.length - 1 == i) {
				colorBar.style.borderTopRightRadius = '10px';
				colorBar.style.borderBottomRightRadius = '10px';
			}
			if (typeof bars[i].color !== 'undefined') {
				colorBar.style.backgroundColor = bars[i].color;
			}
			div.appendChild(colorBar);
		}

		var timer = document.createElement('span');
		timer.id = time;
		timer.style.marginLeft = '5px';
		timer.style.verticalAlign = 'text-top';
		div.appendChild(timer);
		return div
	}

    CallTrackerHelper.Update = function(){
		if(Game.specialTab == 'Insuppressible Timer'){
			var maxWidth = l('InsuppressiblesBar').getBoundingClientRect().width - 185;
			
			l('InsuppressiblesBar').innerHTML = '';
			
			for(var key in Game.shimmerTypes){
				if(Game.shimmerTypes[key].spawnConditions() && Game.shimmerTypes[key].spawned == 0 && Game.shimmerTypes[key].spawnsOnTimer){
					var InsuppressiblesBarShimmer = document.createElement('div');
					InsuppressiblesBarShimmer.id = 'InsuppressiblesBar' + key;
					InsuppressiblesBarShimmer.style.height = '12px';
					InsuppressiblesBarShimmer.style.margin = '0px 10px';
					InsuppressiblesBarShimmer.style.position = 'relative';
					
					if (typeof CallTrackerHelper.colorLookup[key] !== 'undefined') {
						classColor = CallTrackerHelper.colorLookup[key];
					}
					else {
						classColor = CallTrackerHelper.colorLookup['default'];
					}
					
					InsuppressiblesBarShimmer.appendChild(CallTrackerHelper.bar('Next ' + key, [{id: key + 'TBMinBar', color: '#b3b3b3'}, {id: key + 'TBBar', color: classColor}], key + 'TBTime'));
					l('InsuppressiblesBar').appendChild(InsuppressiblesBarShimmer);
					
					InsuppressiblesBarShimmer.style.display = '';
					l(key + 'TBMinBar').style.width = Math.round(Math.max(0, Game.shimmerTypes[key].minTime - Game.shimmerTypes[key].time) * maxWidth / Game.shimmerTypes[key].maxTime) + 'px';
					if (Game.shimmerTypes[key].minTime == Game.shimmerTypes[key].maxTime) {
						l(key + 'TBMinBar').style.borderTopRightRadius = '10px';
						l(key + 'TBMinBar').style.borderBottomRightRadius = '10px';
					}
					else {
						l(key + 'TBMinBar').style.borderTopRightRadius = '';
						l(key + 'TBMinBar').style.borderBottomRightRadius = '';
					}
					l(key + 'TBBar').style.width = Math.round(Math.min(Game.shimmerTypes[key].maxTime - Game.shimmerTypes[key].minTime, Game.shimmerTypes[key].maxTime - Game.shimmerTypes[key].time) * maxWidth / Game.shimmerTypes[key].maxTime) + 'px';
					l(key + 'TBTime').textContent = Math.ceil((Game.shimmerTypes[key].maxTime - Game.shimmerTypes[key].time) / Game.fps);
				}
			}
			
            // News
            var InsuppressiblesBarNews = document.createElement('div');
            InsuppressiblesBarNews.id = 'InsuppressiblesBarNews';
            InsuppressiblesBarNews.style.height = '12px';
            InsuppressiblesBarNews.style.margin = '0px 10px';
            InsuppressiblesBarNews.style.position = 'relative';
            InsuppressiblesBarNews.appendChild(CallTrackerHelper.bar('News', [{id: InsuppressiblesBarNews.id + 'Bar'}], InsuppressiblesBarNews.id + 'Time'));
            InsuppressiblesBarNews.firstChild.firstChild.id = InsuppressiblesBarNews.id + 'Type';
            l('InsuppressiblesBar').appendChild(InsuppressiblesBarNews);
            
            InsuppressiblesBarNews.style.display = '';
            l(InsuppressiblesBarNews.id + 'Type').textContent ='News';
            var classColor = CallTrackerHelper.colorLookup['News'];
            l(InsuppressiblesBarNews.id + 'Bar').style.backgroundColor = classColor;
            l(InsuppressiblesBarNews.id + 'Bar').style.width = Math.round(Game.TickerAge * maxWidth / (10 * Game.fps)) + 'px';
            l(InsuppressiblesBarNews.id + 'Time').textContent = Math.ceil(Game.TickerAge / Game.fps);
            
            // Stocks
            var InsuppressiblesBarStocks = document.createElement('div');
            InsuppressiblesBarStocks.id = 'InsuppressiblesBarStocks';
            InsuppressiblesBarStocks.style.height = '12px';
            InsuppressiblesBarStocks.style.margin = '0px 10px';
            InsuppressiblesBarStocks.style.position = 'relative';
            InsuppressiblesBarStocks.appendChild(CallTrackerHelper.bar('Stocks', [{id: InsuppressiblesBarStocks.id + 'Bar'}], InsuppressiblesBarStocks.id + 'Time'));
            InsuppressiblesBarStocks.firstChild.firstChild.id = InsuppressiblesBarStocks.id + 'Type';
            l('InsuppressiblesBar').appendChild(InsuppressiblesBarStocks);
            
            InsuppressiblesBarStocks.style.display = '';
            l(InsuppressiblesBarStocks.id + 'Type').textContent ='Stocks';
            var classColor = CallTrackerHelper.colorLookup['Stocks'];
            l(InsuppressiblesBarStocks.id + 'Bar').style.backgroundColor = classColor;
            l(InsuppressiblesBarStocks.id + 'Bar').style.width = Math.round((Game.fps * 60 - Game.Objects['Bank'].minigame.tickT) * maxWidth / (60 * Game.fps)) + 'px';
            l(InsuppressiblesBarStocks.id + 'Time').textContent = Math.ceil((Game.fps * 60 - Game.Objects['Bank'].minigame.tickT) / Game.fps);

            // Redraw
            var InsuppressiblesBarRedraw = document.createElement('div');
            InsuppressiblesBarRedraw.id = 'InsuppressiblesBarRedraw';
            InsuppressiblesBarRedraw.style.height = '12px';
            InsuppressiblesBarRedraw.style.margin = '0px 10px';
            InsuppressiblesBarRedraw.style.position = 'relative';
            InsuppressiblesBarRedraw.appendChild(CallTrackerHelper.bar('Redraw', [{id: InsuppressiblesBarRedraw.id + 'Bar'}], InsuppressiblesBarRedraw.id + 'Time'));
            InsuppressiblesBarRedraw.firstChild.firstChild.id = InsuppressiblesBarRedraw.id + 'Type';
            l('InsuppressiblesBar').appendChild(InsuppressiblesBarRedraw);
            
            InsuppressiblesBarRedraw.style.display = '';
            l(InsuppressiblesBarRedraw.id + 'Type').textContent ='Redraw';
            var classColor = CallTrackerHelper.colorLookup['Redraw'];
            l(InsuppressiblesBarRedraw.id + 'Bar').style.backgroundColor = classColor;
            var redrawT = 30 - (Game.drawT % 30);
            l(InsuppressiblesBarRedraw.id + 'Bar').style.width = Math.round(redrawT * maxWidth / Game.fps) + 'px';
            l(InsuppressiblesBarRedraw.id + 'Time').textContent = Math.ceil(redrawT / Game.fps);

			// JPL
			var InsuppressiblesBarJPL = document.createElement('div');
			InsuppressiblesBarJPL.id = 'InsuppressiblesBarJPL';
			InsuppressiblesBarJPL.style.height = '12px';
			InsuppressiblesBarJPL.style.margin = '0px 10px';
			InsuppressiblesBarJPL.style.position = 'relative';
			InsuppressiblesBarJPL.appendChild(CallTrackerHelper.bar('JPL', [{id: InsuppressiblesBarJPL.id + 'Bar'}], InsuppressiblesBarJPL.id + 'Time'));
			InsuppressiblesBarJPL.firstChild.firstChild.id = InsuppressiblesBarJPL.id + 'Type';
			l('InsuppressiblesBar').appendChild(InsuppressiblesBarJPL);
			
			InsuppressiblesBarJPL.style.display = '';
			l(InsuppressiblesBarJPL.id + 'Type').textContent ='JPL';
			var classColor = CallTrackerHelper.colorLookup['JPL'];
			l(InsuppressiblesBarJPL.id + 'Bar').style.backgroundColor = classColor;
			var jplT = 30 - (Game.T % 30);
			l(InsuppressiblesBarJPL.id + 'Bar').style.width = Math.round(jplT * maxWidth / Game.fps) + 'px';
			l(InsuppressiblesBarJPL.id + 'Time').textContent = Math.ceil(jplT / Game.fps);
		}
	}
	
	if(CCSE.ConfirmGameVersion(CallTrackerHelper.name, CallTrackerHelper.version, CallTrackerHelper.GameVersion)) 
        Game.registerMod(CallTrackerHelper.name, CallTrackerHelper); //CallTrackerHelper.init();
}

if(!CallTrackerHelper.isLoaded){
	if(CCSE && CCSE.isLoaded){
		CallTrackerHelper.launch();
	}
	else{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(CallTrackerHelper.launch);
	}
}