var map;
window.onload = function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDJfecggDCSSnp1SS265blDqR182s2ZywE",
    authDomain: "gunnhacks-1509167013046.firebaseapp.com",
    databaseURL: "https://gunnhacks-1509167013046.firebaseio.com",
    projectId: "gunnhacks-1509167013046",
    storageBucket: "gunnhacks-1509167013046.appspot.com",
    messagingSenderId: "7288610574"
  };
  firebase.initializeApp(config);


};

function main()
{
  initMap();
  initAutocomplete();
}

function initAutocomplete() {
  var input = document.getElementById('autocomplete');
  var searchBox = new google.maps.places.Autocomplete(input);
  google.maps.event.addListener(searchBox, 'place_changed', function(){
    var place = searchBox.getPlace();
    addDestination(place.formatted_address);
  });
  var pois = getPOIs();
  console.log(pois);
}

function addDestination(dest) {
  var ref = firebase.database().ref('unassigned/');
  getLocation().then(function(loc) {
    console.log(loc)
    var geocoder = new google.maps.Geocoder;
    var latlng = new google.maps.LatLng({lat: loc.lat, lng: loc.lng});
    geocoder.geocode({'location': latlng}, function(results, status) {
      var person = {current: results[0].formatted_address, dest: dest};
      ref.push(person);
    });
  });
}

function initMap() {

  var pyrmont = {lat: -33.867, lng: 151.195};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });

  var location = getLocation()
    .then(function(loc) {
      map.setCenter(loc);
      var marker = new google.maps.Marker({
              position: loc,
              map: map
      });
    });

}

function getLocation() {
  var pos;
  var promise = new Promise(function(resolve, reject) {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
         pos = { lat: position.coords.latitude,
                 lng: position.coords.longitude
               };
          resolve(pos);
      });
    }
  });

  return promise;
}

function getPOIs() {

  var location = getLocation()
    .then(function(loc) {
      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      var places = service.nearbySearch({
        location: loc,
        radius: 1000,
        //type: ['store']
      }, callback);
      return places;
    });
}

var map;
var infowindow;

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

class POI {
  constructor(people, departTime) {
    this.people = people;
    this.departTime = departTime
  }
  /*
  function addPerson() {
    people++;
  }
  function removePerson(){
    people--;
  }
  function setPeople(p) {
    people = p;
  }
  function getPeople() {
    return people;
  }
  function setDepartTime(t){
    departTime = t;
  }
  function getDepartTime(){
    return departTime;
  }
  */


}
