function iframeSelect(name) {
    var iframe = document.getElementById("iframeArea");
    var welcomeMessage = document.getElementById("welcomeMessage");

    welcomeMessage.style.display = "none";
    iframe.style.display = "block";

    switch (name) {
        case 'chtidc':
            iframe.src = "chtidc.html";
            break;
        case 'parking':
            iframe.src = "parking.html";
            break;
        case 'tempaccess':
            iframe.src = "accessAgreement.html";
            break;
    }
}