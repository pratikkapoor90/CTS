var modSettings = {};

modSettings.changePassword = function() {
  console.log("modSettings.changePassword");

  var userPassword = $('#Password').val();
  var confirmPassword = $('#confirmPassword').val();
  console.log(userPassword, confirmPassword);

  if (userPassword == confirmPassword) {
    $.ajax({
      type: "POST",
      dataType: 'json',
      url: constants.service_url + "users/changeUserPassword",
      data: {
        "userPassword": userPassword
      },
      success: function(response) {
        if (response.status == 200 && response.error == null && response.response == "success") {
          alert("Password changed successfully");
          $('#Password').val("");
          $('#confirmPassword').val("");
        } else {
          alert("Cannot perform operation. Please try again Reason:" + response.response);
        }
      },
      error: function(request, status, error) {
        alert("Cannot perform operation. Please try again Reason:" + error);
      }
    });
  } else {
    alert("Password and Confirm Password must be the same");
  }

};


modSettings.addAPersonalId = function() {
  console.log("modSettings.addAPersonalId");
  $.ajax({
    type: "POST",
    url: constants.service_url + "users/addAPersonalId",
    contentType: false,
    cache: false,
    processData: false,
    data: new FormData($('#addPersonalIdForm')[0]),
    success: function(response) {
      console.log(response);
      // response = JSON.parse(response);
      if (response.status == 200 && response.error == null && response.response == "success") {
        // window.location.href = "index.html";
        alert("Identity Proof successfully added to profile");
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });

  modSettings.clearPersonalIdForm();

}


modSettings.clearPersonalIdForm = function() {
  // TODO: clear fields
  // TODO: Loader
};


modSettings.listAllPersonalIDs = function() {
  console.log("modSettings.listAllPersonalIDs");

  $.ajax({
    type: "GET",
    url: constants.service_url + "users/listPersonalIds",
    success: function(response) {
      console.log(response);
      // response = JSON.parse(response);
      if (response.status == 200 && response.error == null) {
        // TODO: format data
        $('#listAllPersonalIDs').append("<pre>" + response.response + "</pre>")
      } else {
        alert("Cannot perform operation. Please try again Reason:" + response.response);
      }
    },
    error: function(request, status, error) {
      alert("Cannot perform operation. Please try again Reason:" + error);
    }
  });
}