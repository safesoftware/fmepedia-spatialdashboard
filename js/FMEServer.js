
var FMEServer = {

	svrHost : '',
	token : '',

	connectToServer : function(svrHost, token){
		FMEServer.svrHost = svrHost;
		FMEServer.token = token;
	},

	getParams : function(repository, wrkspName){
		var url = FMEServer.svrHost + '/fmerest/repositories/' + repository + '/' + wrkspName + '/parameters.json?token=' + FMEServer.token;
		var params = null;

		$.ajax({
			url: url, 
			async: false, 
			dataType: 'json',
			success: function(json){
				params = json;
			}
		})
		return params;
	},

	//gets the current session id from FME Server
	//can use this to get the path to any files added through
	//the file upload service	
	getSessionID : function (wrkspPath){
		//returns null if there is an error
		var url = FMEServer.svrHost + '/fmedataupload/' + wrkspPath + '?opt_extractarchive=false&opt_pathlevel=3&opt_fullpath=true';
		var sessionID = null;
		
		$.ajax({
			url: url, 
			async: false, 
			dataType: 'json', 
			success: function(json){
				sessionID = json.serviceResponse.session;
			}
		});

		return sessionID;
	}

}