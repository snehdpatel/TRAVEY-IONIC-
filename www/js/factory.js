angular.module('Kp.Factory', [])
        .factory('KpFactory', function ( $http, $q, $timeout) {
  
            returnData = {};
            returnData.API_URL = function () {
               return "http://localhost:8080";
               // return "http://192.168.1.107:8080";
            };

            returnData.getLogin = function (LoginArray) {
                debugger;
                var URL = this.API_URL() + "/login";
                var FetchedData = $http.post(URL, LoginArray).then(function (result) {
                    return result;
                }, function (err) {
                    alert("hi");
                    return err;                    
                });
                return $q.when(FetchedData);
            };

            returnData.getSignup = function (SignupArray) {
                debugger;
                var URL = this.API_URL() + "/register";
                var FetchedData = $http.post(URL, SignupArray).then(function (result) {
                    return result;
                }, function (err) {
                    return err;               
                });
                return $q.when(FetchedData);
            };

            returnData.getDetails = function (DetailArray) {
                debugger;
                var URL = this.API_URL() + "/editProfile/getDetails";
                var FetchedData = $http.post(URL, DetailArray).then(function (result) {
                    return result;
                }, function (err) {
                    return err;               
                });
                return $q.when(FetchedData);
            };

            returnData.Update = function (UpdateArray) {
                debugger;
                var URL = this.API_URL() + "/update";
                var FetchedData = $http.post(URL, UpdateArray).then(function (result) {
                    //alert(result.message);
                    return result;
                }, function (err) {
                    return err;               
                });
                return $q.when(FetchedData);
            };

            returnData.reportAdd = function (ReportArray) {
                debugger;
                var URL = this.API_URL() + "/reportAdd";
                var FetchedData = $http.post(URL, ReportArray).then(function (result) {
                    //alert(result.message);
                    return result;
                }, function (err) {
                    return err;               
                });
                return $q.when(FetchedData);
            };

            
            returnData.getReports = function () {
                debugger;
                var URL = this.API_URL() + "/getReports";
                var FetchedData = $http.post(URL).then(function (result) {
                    //alert(result.message);
                    return result;
                }, function (err) {
                    return err;               
                });
                return $q.when(FetchedData);
            };


            returnData.locateMe = function (LocateArray) {
                debugger;
                var URL = this.API_URL() + "/locateMe";
                var FetchedData = $http.post(URL, LocateArray).then(function (result) {
                    //alert(result.message);
                    return result;
                }, function (err) {
                    return err;               
                });
                return $q.when(FetchedData);
            };


            return returnData;

        })
      



