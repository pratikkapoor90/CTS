var modRegistration = {};

modRegistration.registerUser = function() {
  console.log("modRegistration.registerUser");

  var userName = $('#userName').val();
  var userPassword = $('#userPassword').val();
  var firstName = $('#firstName').val();
  var lastName = $('#lastName').val();
  var email = $('#email').val();
  var phoneNumber = $('#phoneNumber').val();
  var confirmPassword = $('#confirmPassword').val();

  if (userPassword != confirmPassword) {
    alert("password and confirm password do not match");
  } else {
    $.ajax({
      type: "POST",
      dataType: 'json',
      url: constants.service_url + "users/userRegistration/",
      data: {
        "userName": userName,
        "userPassword": userPassword,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "phoneNumber": phoneNumber
      },
      success: function(response) {
        if (response.status == 200 && response.error == null && response.response == "success") {
          window.location.href = "login.html";
        } else {
          alert("Cannot perform operation. Please try again Reason:" + response.response);
        }
      },
      error: function(request, status, error) {
        alert("Cannot perform operation. Please try again Reason:" + error);
      }
    });
    modRegistration.clearRegistrationForm();
  }
};

modRegistration.clearRegistrationForm = function() {
  $('#userName').val('');
  $('#userPassword').val('');
  $('#firstName').val('');
  $('#lastName').val('');
  $('#email').val('');
  $('#phoneNumber').val('');
  $('#confirmPassword').val('');
};