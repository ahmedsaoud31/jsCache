/**
 * @author		Ahmed Aboelsaoud Ahmed <ahmedsaoud31@gmail.com>
 * @viber		+201148024524
 * @whatsup		+201148024524
 * @github		https://github.com/ahmedsaoud31
 * @site		http://goo2pro.com
 */
var Cache = (function(){
	// @var to save instance of this class
	var thisCache = {};
	// @var to save start variables names
	var saveName = 'Cache_';
	// @var to save settings name variable
	var settingName = 'CacheSettings';
	// @var to save settings
	var CacheSettings = {};
	// @var to save now time in minutes 
	var time = 0;
	
	/* 
	*  @function to set chaced data
	*  @return none
	*/
	thisCache.set = function(name, value, time){
		if (typeof(time)==='undefined'){
			time = false;
		}else{
			time = getTime()+time;
		}
		loadSettings();
		CacheSettings[name] = {"time":time};
		saveSettings();
		localStorage.setItem(saveName+name, JSON.stringify(value));
	}
	
	/* 
	*  @function to get chased data
	*  @return cached value by name, array of some cached data or array of all chased data
	*/
	thisCache.get = function(name){
		if(typeof(name)==='undefined'){
			return getAll();
		}else if(typeof name === 'string' && thisCache.has(name)){
			return JSON.parse(localStorage.getItem(saveName+name));
		}else if(typeof name === 'object'){
			return getItems(name);
		}else{
			return null;
		}
	}
	
	/* 
	*  @function to check in cached data is set
	*  @return true if exists
	*  @return false if not exists
	*/
	thisCache.has = function(name){
		if(isSet(saveName+name)){
			loadSettings();
			if(CacheSettings[name].time === false || CacheSettings[name].time > getTime()){
				return true;
			}else{
				thisCache.delete();
				return false;
			}
			
		}else{
			return false;
		}
	}
	
	/* 
	*  @function to delete cached data
	*  @return none
	*/
	thisCache.delete = function(name){
		if(typeof(name)==='undefined'){
			deleteAll();
		}else if(typeof name === 'string'){
			loadSettings();
			delete CacheSettings[name];
			localStorage.removeItem(saveName+name);
			saveSettings();
		}else{
			deleteItems(name);
		}
	}
	
	/* 
	*  @function to check browser local storage support or no
	*  @return true or false
	*/
	thisCache.support = function(){
		try {
			localStorage.setItem('test', 'test');
			localStorage.removeItem('test');
			return true;
		} catch(e) {
			return false;
		}
	}
	function isSet(name){
		if (localStorage.getItem(name) === null) {
			return false;
		}else{
			return true;
		}
	}
	
	/* 
	*  @function to now time in minutes
	*  @return now time
	*/
	function getTime(){
		return parseInt((new Date().getTime())/(100*60));
	}
	
	/* 
	*  @function to load cache settings
	*  @return setting data
	*/
	function loadSettings(){
		if(isSet(settingName)){
			CacheSettings = JSON.parse(localStorage.getItem(settingName));
		}else{
			CacheSettings = {};
		}
	}
	
	/* 
	*  @function to save cache settings
	*  @return none
	*/
	function saveSettings(){
		localStorage.setItem(settingName, JSON.stringify(CacheSettings));
	}
	
	/* 
	*  @function take array on items name to delete this items form cached data
	*  @return none
	*/
	function deleteItems(arr){
		loadSettings();
		for(var i=0;i<arr.length; ++i){
			delete CacheSettings[arr[i]];
			localStorage.removeItem(saveName+arr[i]);
		}
		saveSettings();
	}
	
	/* 
	*  @function to delete all cached data
	*  @return none
	*/
	function deleteAll(){
		loadSettings();
		for (var name in CacheSettings){
			if (CacheSettings.hasOwnProperty(name)) {
				delete CacheSettings[name];
				localStorage.removeItem(saveName+name);
			}
		}
		saveSettings();
	}
	
	/* 
	*  @function take array on items name to get this items form cached data
	*  @return some cached data
	*/
	function getItems(arr){
		var out = {};
		loadSettings();
		for(var i=0;i<arr.length;++i){
			if(thisCache.has(arr[i])){
				out[arr[i]] = thisCache.get(arr[i]);
			}
		}
		return out;
	}
	
	/* 
	*  @function to get all cached data
	*  @return all cached data
	*/
	function getAll(){
		var out = {};
		for (var name in CacheSettings){
			if (CacheSettings.hasOwnProperty(name)) {
				if(thisCache.has(name)){
					out[name] = thisCache.get(name);
				}
			}
		}
		return out;
	}
	return thisCache;
})();
