var modAddVehicle = {};

modAddVehicle.addAVehicle = function() {
  console.log("modAddVehicle.addAVehicle");

  $.ajax({
    type: "POST",
    url: constants.service_url + "vehicleRequests/vehicles/1",
    contentType: false,
    cache: false,
    processData: false,
    data: new FormData($('#addVehicleForm')[0]),
    success: function(response) {
      console.log(response);
      // response = JSON.parse(response);
      if (response.status == 200 && response.error == null && response.response == "success") {
        window.location.href = "index.html";
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });

  modAddVehicle.clearAddVehicleForm();
};

modAddVehicle.clearAddVehicleForm = function() {
  // TODO: clear fields
};

modAddVehicle.getAllVehicles = function() {
  console.log("modAddVehicle.getAllVehicles");

  $.ajax({
    type: "GET",
    url: constants.service_url + "vehicleRequests/getAllVehicles",
    success: function(response) {
      console.log(response);
      // response = JSON.parse(response);
      if (response.status == 200 && response.error == null) {
        // TODO: format data
        $('#listAllVehicles').append("<pre>" + response.response + "</pre>")
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });
}