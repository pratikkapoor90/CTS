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