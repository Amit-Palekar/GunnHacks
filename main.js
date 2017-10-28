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

function initAutocomplete() {
  var input = document.getElementById('pac-input');
  console.log(input);
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    var icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));
    });
    map.fitBounds(bounds);
  });
  //var pois = getPOIs();
}

function addDestination() {
  var ref = firebase.db().ref('unassigned');
  //ref.push()
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 2
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

  var request = {
    location: location,
    radius: '500', // radius of 500 meters
     type: ['restaurant']
  };

  var service = new google.maps.places.PlacesService(map);
  var places = service.nearbySearch(request, callback);

  return places;
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}
