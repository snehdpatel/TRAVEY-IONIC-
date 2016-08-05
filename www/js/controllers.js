angular.module('starter.controllers', ['Kp.Factory'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('ProfileCtrl', function($state, $scope,KpFactory,$ionicLoading,$localStorage) {
    debugger;

    $scope.profile = {};
    $scope.profile.user_name = $localStorage.profile.user_name;
    $scope.profile.phone_number = $localStorage.profile.phone_number;
    $scope.profile.email = $localStorage.profile.email;
    $scope.profile.checked = $localStorage.profile.shared_location;
    
    $scope.savefunction = function(){
        debugger;
        $ionicLoading.show({
            template: 'Loading.. Please Wait <br/><ion-spinner></ion-spinner>'
        });

        var email = $scope.profile.email;
        var user_name = $scope.profile.user_name;

        if($scope.profile.uname!==undefined && $scope.profile.user_name !== $scope.profile.uname){
            user_name = $scope.profile.uname;
        }

        if($scope.profile.email_id!==undefined && $scope.profile.email !== $scope.profile.email_id){
            email = $scope.profile.email_id;
        }

        var UpdateArray = {
            "phone_number": $scope.profile.phone_number,
            "shared_location" : $scope.profile.checked ,
            "email" : email,
            "user_name": user_name          
        };
        KpFactory.Update(UpdateArray).then(function (response) {
            debugger;
            $ionicLoading.hide();
            if(response.data.response === null){
                alert(response.data.name);
            }else{
                if (response.data.response === true) {
                    alert("success!");
                    $localStorage.profile.user_name = user_name;
                    $localStorage.profile.email = email;
                    $localStorage.profile.shared_location = $scope.profile.checked;
                } else if (response.data.response === false){
                    alert("not done !");
                }
            }
        });

        
        $state.go('app.map');
    };  

})

.controller('GeoCtrl', function( $scope,KpFactory, $cordovaGeolocation,$ionicLoading,$cordovaDialogs , $ionicModal, $localStorage) {
        debugger;

        //function initialize() {

        $localStorage.myLatlng = {};
        $localStorage.Latlng;
        $localStorage.seLatlng = {};
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });
        
        var posOptions = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }; 

        function reStore() {
            debugger;
            var infowindow = new google.maps.InfoWindow();
            var marker;
            //getting data about all reports
            KpFactory.getReports().then(function (response) {


                debugger;
                if(response.data.response == null){
                    alert(response.data.name);
                }else{
                    if (response.data.response === true) {
                        debugger;
                        
                        var length = response.data.res.length;

                        for (var i = 0; i < length; i++) { 
                            marker = new google.maps.Marker({
                                position: new google.maps.LatLng(response.data.res[i].lat,response.data.res[i].lng),
                                map: $scope.map,
                                icon: "img/red-dot.png",
                                animation: google.maps.Animation.DROP,
                                title: response.data.res[i].tag
                            });

                            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                                return function() {
                                infowindow.setContent(response.data.res[i].detail);
                                infowindow.open($scope.map, marker);
                                }
                            })(marker, i));
                        }
                        // for(var i=0; i<response.data.res.length; i++){
                        //     myLocation[i] = new google.maps.Marker({
                        //         position: new google.maps.LatLng(response.data.res[i].lat,response.data.res[i].lng),
                        //         map: map,
                        //         animation: google.maps.Animation.DROP,
                        //         title: response.data.res[i].tag
                        //     });
                        //     infoWindow[i] = new google.maps.InfoWindow({
                        //         content: response.data.res[i].detail
                        //     });

                        //     debugger;
                        //     google.maps.event.addListener(myLocation[i], 'click', function () {
                        //         infoWindow[i].open($scope.map, myLocation[i]);
                        //     });
                        // }

                    } else {
                        alert(response.data.res);
                    }
                }
            });
        }  

        function mahLoc(){
            debugger;
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
            
                $localStorage.Latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
                $localStorage.myLatlng.lat = position.coords.latitude;
                $localStorage.myLatlng.lng = position.coords.longitude;               
                $ionicLoading.hide();         
                
            }, function(err) {
                $ionicLoading.hide();
                console.log(err);
            });

            var mapOptions = {
                center: $localStorage.Latlng,
                zoom: 13,
                scrollwheel: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };   

            var map = new google.maps.Map(document.getElementById("map"), mapOptions);
            $scope.map = map;      

            debugger;   

            var mahLocation = new google.maps.Marker({
                position: $localStorage.Latlng,
                map: map,
                icon: "img/blue-dot.png",
                animation: google.maps.Animation.DROP,
                title: "My Location"
            });
            var inWindow = new google.maps.InfoWindow({
                content: "Here I am!"
            });

            google.maps.event.addListener(mahLocation, 'click', function () {
                inWindow.open($scope.map, mahLocation);
            });

            reStore();
        }
        
        mahLoc();       

        
        
        debugger;
        var input = /** @type {HTMLInputElement} */ (
            document.getElementById('pac-input'));

        // Create the autocomplete helper, and associate it with
        // an HTML text input box.
        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', $scope.map);

        //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        var iwindow = new google.maps.InfoWindow();
        var smarker = new google.maps.Marker({
            map: map,
            icon: "img/green-dot.png",
        });
        google.maps.event.addListener(smarker, 'click', function() {
            infowindow.open(map, smarker);
        });

        // Get the full place details when the user selects a place from the
        // list of suggestions.
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            debugger;
            iwindow.close();
            var place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }

            $localStorage.seLatlng.lng = (place.geometry.viewport.b.b + place.geometry.viewport.b.f)/2;
            $localStorage.seLatlng.lat = (place.geometry.viewport.f.b + place.geometry.viewport.f.f)/2;

            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17);
            }

            // Set the position of the marker using the place ID and location.
            smarker.setPlace( /** @type {!google.maps.Place} */ ({
                placeId: place.place_id,
                location: place.geometry.location
            }));
            marker.setVisible(true);

            iwindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.formatted_address + '</div>');
            iwindow.open(map, smarker);
        });
        //}

        // // Run the initialize function when the window has finished loading.
        // google.maps.event.addDomListener(window, 'load', initialize);

        
        $ionicModal.fromTemplateUrl('templates/dialog.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.addReport = function() {
            alert("Report added");
            debugger;
            var start_time = new Date();
            var hours;
            var minutes;
            if($scope.report.hours === undefined)
                hours = 0;
            else
                hours = $scope.report.hours;
            if($scope.report.minutes === undefined)
                minutes = 0;
            else 
                minutes = $scope.report.minutes;
            var end_time = new Date(start_time.getTime() + 1000 * 60 * 60 * hours + 1000 * 60 * minutes);
            var lat;
            var lng;
            if($scope.report.location === "My Location" || $localStorage.seLatlng.lat === undefined){
                lat = $localStorage.myLatlng.lat;
                lng = $localStorage.myLatlng.lng;
            }
            else{
                lat = $localStorage.seLatlng.lat;
                lng = $localStorage.seLatlng.lng;
            }

            var ReportArray = {
                "phone_number": $localStorage.profile.phone_number,
                "tag" : $scope.report.tag,
                "detail" : $scope.report.detail,
                "start_time": start_time.getHours()+":"+start_time.getMinutes()+":"+start_time.getSeconds(),
                "end_time" : end_time.getHours()+":"+end_time.getMinutes()+":"+end_time.getSeconds(),
                "lat" : lat,
                "lng" : lng
            };
            KpFactory.reportAdd(ReportArray).then(function (response) {

                $ionicLoading.hide();
                if(response.data.response === null){
                    alert(response.data.name);
                }else{
                    if (response.data.response === true) {
                        alert("success!");
                        //google.maps.event.addDomListener(window, 'load', initialize);
                        reStore();
                        
                    } else if (response.data.response === false){
                        alert("not done !");
                    }
                }
            });

            $scope.modal.hide();
        };

        // Triggered in the login modal to close it
        $scope.closeReport = function() {
            $scope.modal.hide();
        };

        $scope.addEvent = function(){
            $scope.report = {};
            $scope.modal.show();
        };     

        $scope.disableTap = function() {
            var container = document.getElementsByClassName('pac-container');
            angular.element(container).attr('data-tap-disabled', 'true');
            var backdrop = document.getElementsByClassName('backdrop');
            angular.element(backdrop).attr('data-tap-disabled', 'true');
            angular.element(container).on("click", function() {
                document.getElementById('pac-input').blur();
            });
        };   
    
        $scope.locateMe = function(){

            mahLoc();

            var LocateArray = {
                "phone_number": $localStorage.profile.phone_number,
                "lat" :  $localStorage.myLatlng.lat,
                "lng" :  $localStorage.myLatlng.lng
                
            };
            KpFactory.locateMe(LocateArray).then(function (response) {
                debugger;  
                if(response.data.response === null){
                    alert(response.data.name);
                }else{
                    if (response.data.response === true) {
                        alert("success!");
                    } else if (response.data.response === false){
                        alert("not done !");
                    }
                }
            });
        };

})

.controller('SignupCtrl', function ($scope,$state, KpFactory,  $ionicLoading,$localStorage) {
    debugger;
    $scope.signup = {};
    $localStorage.profile = {};
    $scope.signupfunction = function () {
        debugger;
        if ($scope.signup.uname === null || $scope.signup.phonenumber === null || $scope.signup.email === null || $scope.signup.conpassword === null || $scope.signup.conpassword === null) {
          alert("Fill all details !");
        } else if ($scope.signup.phonenumber.toString().length !== 10 ) {
            alert("Please Enter a valid phone number");
        } else if (!($scope.signup.email.indexOf("@") < 1 || $scope.signup.email.lastIndexOf(".") < $scope.signup.email.indexOf("@") + 2 || $scope.signup.email.lastIndexOf(".") + 2 >= $scope.signup.email.length())) {
            alert("Please Enter a valid Email id");
        } else if ($scope.signup.password.toString().length < 6) {
            alert("password length should equal or greater then 6");                                       
        } else if($scope.signup.password !== $scope.signup.conpassword){
            alert("Password does not match !");
        }
        else{
            $ionicLoading.show({
                template: 'Loading.. Please Wait <br/><ion-spinner></ion-spinner>'
            });
            var SignupArray = {
                "user_name": $scope.signup.uname,
                "phone_number": $scope.signup.phonenumber,
                "email": $scope.signup.email,
                "password": $scope.signup.password
                
            };
            KpFactory.getSignup(SignupArray).then(function (response) {

                $ionicLoading.hide();
                if(response.data.response == null){
                    alert(response.data.name);
                }else{
                    if (response.data.response === true) {
                        alert("success!");
                        $localStorage.profile.user_name = $scope.signup.uname;
                        $localStorage.profile.phone_number = $scope.signup.phonenumber;
                        $localStorage.profile.email = $scope.signup.email;
                        $localStorage.profile.shared_location = true;
                        $state.go('app.map');
                    } else if (response.data.response === false){
                        alert(response.data.res);
                    }
                }
            });
            
        }
    };
})

.controller('LoginCtrl', function ($scope,$state, KpFactory,  $ionicLoading,$localStorage) {
    debugger;
    $scope.login = {};
    $localStorage.profile = {};
    $scope.loginfunction = function () {
        debugger;
        if ($scope.login.phonenumber === null || $scope.login.password === null) {
          alert("Fill all details !");
        } else if ($scope.login.phonenumber.toString().length !== 10 ) {
            alert("Please Enter a valid phone number");
        } else if ($scope.login.phonenumber.toString().length < 6) {
            alert("password length should equal or greater then 6");                                       
        } else{
            $ionicLoading.show({
                template: 'Loading.. Please Wait <br/><ion-spinner></ion-spinner>'
            });
            var LoginArray = {
                "phone_number": $scope.login.phonenumber,
                "password": $scope.login.password
                
            };
            KpFactory.getLogin(LoginArray).then(function (response) {

                $ionicLoading.hide();
                debugger;
                if(response.data.response == undefined){
                    alert(response.config.url);
                    
                }else{
                    if (response.data.response === true) {
                        

                        $localStorage.profile.user_name = response.data.record.user_name;
                        $localStorage.profile.phone_number = $scope.login.phonenumber;
                        $localStorage.profile.email = response.data.record.email_id;
                        $localStorage.profile.shared_location = response.data.record.shared_location;

                        $state.go('app.map');
                    } else {
                        alert(response.data.res);
                    }
                }

            });
            
        }
    };
})

.controller('FNMCtrl', function ($scope,$state, KpFactory,  $ionicLoading,$localStorage) {
    debugger;
    $scope.login = {};
    $localStorage.profile = {};
    $scope.loginfunction = function () {
        debugger;
        if ($scope.login.phonenumber === null || $scope.login.password === null) {
          alert("Fill all details !");
        } else if ($scope.login.phonenumber.toString().length !== 10 ) {
            alert("Please Enter a valid phone number");
        } else if ($scope.login.phonenumber.toString().length < 6) {
            alert("password length should equal or greater then 6");                                       
        } else{
            $ionicLoading.show({
                template: 'Loading.. Please Wait <br/><ion-spinner></ion-spinner>'
            });
            var LoginArray = {
                "phone_number": $scope.login.phonenumber,
                "password": $scope.login.password
                
            };
            KpFactory.getLogin(LoginArray).then(function (response) {

                $ionicLoading.hide();
                debugger;
                if(response.data.response == null){
                    alert(response.data.name);
                }else{
                    if (response.data.response === true) {
                        

                        $localStorage.profile.user_name = response.data.record.user_name;
                        $localStorage.profile.phone_number = $scope.login.phonenumber;
                        $localStorage.profile.email = response.data.record.email_id;
                        $localStorage.profile.shared_location = response.data.record.shared_location;

                        $state.go('app.map');
                    } else {
                        alert(response.data.res);
                    }
                }

            });
            
        }
    };
});