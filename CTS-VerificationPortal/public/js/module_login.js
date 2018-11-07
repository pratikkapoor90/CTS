var modLogin = {};

modLogin.clearUserLoginForm = function() {
  $('#Username').val('');
  $('#Password').val('');
};


modLogin.authenticateUser = function() {
  console.log("modLogin.authenticateUser");

  var userName = $('#Username').val();
  var userPassword = $('#Password').val();
  console.log(userName, userPassword);

  $.ajax({
    type: "POST",
    dataType: 'json',
    url: constants.service_url + "users/userAuthenticate/",
    data: {
      "userName": userName,
      "userPassword": userPassword
    },
    success: function(response) {
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

  modLogin.clearUserLoginForm();

};