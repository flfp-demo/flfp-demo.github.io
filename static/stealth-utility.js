// toggle stealth by storing a cookie

function toggleStealth() {
    var stealth = getCookie("stealth");
    if (stealth == "true") {
        setCookie("stealth", "false", 365);
    } else {
        setCookie("stealth", "true", 365);
    }
    document.body.classList.toggle("stealthy");
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function initStealth() {
    var stealth = getCookie("stealth");
    if (stealth == "true") {
        document.body.classList.toggle("stealthy");
    }
}

initStealth();