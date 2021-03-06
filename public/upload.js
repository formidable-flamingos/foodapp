angular.module('FileUpload', ['ngFileUpload','ngAutocomplete'])
.controller('UploadCtrl', ['$scope', 'Upload', 'Pictures', '$timeout', function($scope, Upload, Pictures, $timeout) {

  // Start with no result and no error from the upload
  $scope.result = false;
  $scope.error = false;
  
  // Fired upon ng-click of button in upload.html view
  $scope.uploadPic = function(file, details) {

    // Start with no result and no error from the upload
    $scope.result = false;
    $scope.error = false;

  // Creates data structure that is sent to the server
    var picture = {
      filename: file.name,
      name: details.name,
      address: details.formatted_address,
      id: details.place_id
    }

  // Using the Upload service from ng-file-upload directive to call the imgur API
    file.upload = Upload.upload({
      headers: {'Authorization':'Client-ID 2f42bf48eb1d7bd'},
      url:'https://api.imgur.com/3/image',
      data: {'image': file}
    })
    // Once the Imgur API call is successful, get the resulting imgur link and save it and our data structure object to the database
    .then(function(resp){
      // Displays success message if upload is successful
      $scope.result = true;
      // Adds the link to the picture object
      picture.url = resp.data.data.link;
      // Clears the picture and location from the form
      $scope.picFile = null;
      $scope.autocomplete = '';
      // Sends a post request to the server to add picture reference to the database
      Pictures.addOne(picture);
    })
    .catch(function(error) {
      // Displays error message if trouble uploading
      $scope.errorMsg = "Error";
      $scope.error = true;
    });

  }

}]);
