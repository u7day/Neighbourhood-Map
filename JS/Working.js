// Array of Places on the Map
var places = [
{
	loc: 'Chandra Taal',
	lat: 32.4824,
	lng: 77.6157,
	imagelink: 'chandratal.jpg'
}, 
{
	loc: 'Solang Valley',
	lat: 32.316,
	lng: 77.157,
	imagelink: 'Solang_Valley.jpg'
}, 
{
	loc: 'Prashar Lake',
	lat: 31.7544,
	lng: 77.1011,
	imagelink: 'prashar_lake.jpg'
}, 
{
	loc: 'Kasol',
	lat: 32.0100,
	lng: 77.3150,
	imagelink: 'kasol.jpg'
}, 
{
	loc: 'Key Monastery',
	lat: 32.2978,
	lng: 78.0119,
	imagelink: 'Key_Monastery.jpg'
	}
];
var placeList = [];
//Function to Apply Knockout Bindings
var ViewModel = function() {
	var self = this;
	var markerinfo = new google.maps.InfoWindow({maxWidth: 280,});
	this.searchRes = ko.observable('');
	for (var i = 0; i < places.length; i++) {
		var placeMark = new google.maps.Marker({
			map: map,
			position: { lat: places[i].lat, lng: places[i].lng },
			loc: places[i].loc,
			sel: ko.observable(false),
			displayed: ko.observable(true),
			animation: google.maps.Animation.DROP,
			mapTypeId: google.maps.MapTypeId.TERRAIN,
			imagelink: places[i].imagelink,
		});
		placeList.push(placeMark);
		placeMark.addListener('click', function() {
			openMarkerInfo(this, markerinfo);
			toggleAnimate(this);
		});
	}
	
	placeList.forEach(function(placeMark) {
    $.ajax({
      type: "GET",
      url: 'https://en.wikipedia.org/w/api.php' +
      '?action=opensearch' +
      '&search=' + placeMark.loc +          //The Search Query
      '&limit=1' +          // It Returns only the First WikipediaResult
      '&namespace=0' +         // Search only for Articles, Ignoring Talk, Mediawiki, etc.
      '&format=json',
      dataType: "jsonp",
      success: function (data) {    //This Function works when the above Connection is Successfull.
        var wikipediaResult = data[2][0];
		wikipediaResult?placeMark.wDesc = wikipediaResult:placeMark.wDesc = "Rating Not Found";
      },
      error: function (e) {      //This Function works when the above Connection Fails.
        alert("Error loading wikipedia");
      }
    });
  });
	
	function openMarkerInfo(placeMark, markerinfo) {
		// Make sure whether the markerinfo is not already opened in the following marker
		markerinfo.placeMark = placeMark;
		var im= '<img src="'+placeMark.imagelink+'" style="height:150px;width:250 px;" alt="image"/>'
		markerinfo.setContent('<div class="insimg"><h3><center><b>' + placeMark.loc + '</b></center></h3>'+ im+'<br><br>'+ placeMark.wDesc +'</div>');
			
			markerinfo.open(map, placeMark);
			
		//markerinfo.maxWidth:250;
		// Marker property must be cleared if the markerinfo is closed
		markerinfo.addListener('closeclick', function() {
			markerinfo.placeMark = null;
		});
	}
	this.displayMarker = function(placeMark) {
		toggleAnimate(this);
		placeMark.displayed(true);
		placeMark.setVisible(true);
	};
	
	function toggleAnimate(placeMark) {
		placeMark.setVisible(true);
		if (placeMark.getAnimation() != null) {		
			placeMark.setAnimation(null);		
		}else{
			placeMark.setAnimation(google.maps.Animation.BOUNCE);
			}
		openMarkerInfo(placeMark, markerinfo);	
	}
	
	//This Function is for Search Bar
	this.findPlace = function() {
		var res = this.searchRes();
		markerinfo.close();
		//Closes all the Window
		if (res.length === 0) {
			this.displayeach();
		} else {
			for (var j = 0; j < placeList.length; j++) {
				// Searches from the list of Places included
				var nameloc=placeList[j].loc.toLowerCase();
				if (nameloc.indexOf(res.toLowerCase()) >= 0) {
					placeList[j].displayed(true);
					placeList[j].setVisible(true);
				} else {
					placeList[j].displayed(false);
					placeList[j].setVisible(false);
					placeList[j].setAnimation(null);
				}
			}
		}
		markerinfo.close();
	};
	// Display the list of all Places
	this.displayeach = function() {
		for (var j = 0; j < placeList.length; j++) {
			placeList[j].displayed(true);
			placeList[j].setVisible(true);
		}
	};
};
var map;
function Begin() {
    map = new google.maps.Map(document.getElementById('map'), {
            center: {  lat: 31.992354,lng: 77.481766},
            zoom:8
        });
        ko.applyBindings(new ViewModel());
}
//Error is displayed when Map is not Loaded
function naksha(){
  document.getElementById('map').innerHTML="Map Not Found";
}
