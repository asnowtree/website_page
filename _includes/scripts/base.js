/*(function () {

})();*/

var userLogin = 0;

function register() {
    var username = document.getElementById("username").value;
    var passoword = document.getElementById("password").value;
    $.ajax(
        {
            type: "POST",
            url:  window.location.origin +  "/user/register",
            dataType: "json",
            data: JSON.stringify({ "username": username, "password": passoword, "registerType": "0" }),
            contentType: "application/json",
            success: function (result) {

                if (result && result.success) {
                    var loginTable = document.getElementById("loginTable")
                    loginTable.style.zIndex = -1;
                    loginTable.style.display = 'none';
                    getUserInfo();
                }else{
                    window.alert(result.msg);
                }


            }
        });
}
function siginTop() {
    if (userLogin == 0) {
        var loginTable = document.getElementById("loginTable")
        var disinfo = loginTable.style.display;
        if (disinfo == "inherit") {
            loginTable.style.display = "none";
        } else {
            loginTable.style.zIndex = 10000001;
            loginTable.style.display = "inherit";
        }
        // login();
    } else {

        logout();
    }
};

function logout() {
    $.ajax(
        {
            type: "POST",
            url:  window.location.origin +  "/user/logout",
            success: function (result) {
                userLogin = 0;
                // document.querySelectorAll
                
                document.getElementById("li_sign").style.display = 'block';
                document.getElementById("siginButton").innerHTML = "";
                document.getElementById("loginUserInfo").innerHTML = "";
                var avatarImage = document.getElementById("avatarImage");
                avatarImage.style.display = "none";
            }
        });
}


function login() {
    var username = document.getElementById("username").value;
    var passoword = document.getElementById("password").value;
    $.ajax(
        {
            type: "POST",
            url:  window.location.origin +  "/user/login",
            // dataType: "json",
            data: { "username": username, "password": passoword },
            success: function (result) {
                var loginTable = document.getElementById("loginTable")
                loginTable.style.zIndex = -1;
                loginTable.style.display = 'none';
                if (result && result.success) {
                    getUserInfo();
                }else{
                    window.alert(result.msg);
                }
            }
        });
};



function getUserInfo() {
    $.ajax(
        {
            type: "GET",
            url:  window.location.origin +  "/user/user/userinfo",
            success: function (result) {
                if (result && result.status == 200) {
                    userLogin = 1;
                    if (result.data.avatar) {
                        var avatarImage = document.getElementById("avatarImage");
                        avatarImage.src = result.data.avatar;
                        avatarImage.style.display = "inline";
                    }
                    var username = result.data.username || result.data.name;
                    var ei = username.indexOf("@");
                    if(ei  > 0){
                        var first = username.substring(0,ei);
                        var last = username.substring(ei,username.length);
                        if(first.length > 3){
                            if(first.length > 6){
                                first = first.substring(0,4) + "**";
                            }else{
                                first = first.substring(0,3) + "***";
                            }
                        }
                        username = first + last;
                    }
                    document.getElementById("loginUserInfo").innerHTML = username;
                    document.getElementById("loginTable").style.display = "none";
                    var asiginButton = document.getElementById("siginButton");
                    asiginButton.innerHTML = "登出";
                    document.getElementById("li_sign").style.display = 'none';
                } else {
                    userLogin = 0;
                }
                console.log(result);

            },
            error: function (result) {
              if(result){
                
              }
              userLogin = 0;

          },
        });
}

getUserInfo();