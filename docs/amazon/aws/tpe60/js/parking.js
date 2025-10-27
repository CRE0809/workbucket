const startModel = new bootstrap.Modal('#exampleModal');

document.addEventListener("DOMContentLoaded", () => {
    startModel.show();
    document.getElementById('reasonSelect').addEventListener('change', function() {
        document.getElementById("reason").textContent = document.getElementById("reasonSelect").value;
    });
});

document.getElementById('loginInput').addEventListener('input', (event) => { document.getElementById('login').textContent = `　　　${document.getElementById('loginInput').value}　　　`});

document.getElementById("printBtn").addEventListener("click", () => {
    startModel.hide();
    setTimeout(() => {
        print();
    }, "1000");
});

document.getElementById("formFile").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) {
        console.log("No file selected. Please choose a file.", "error");
        return;
    }
    if(!file.type == "text/csv" || !file.type == "application/vnd.ms-excel") {
        console.log("Unsupported file type. Please select a text file.", "error");
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        const text = reader.result;
        document.getElementById("appDate").textContent = `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`;
        const text2 = csvJSON(text);
        var str = [];
        for(var i in text2) {
            const type = text2[i]["Type of delivery"].trim().toLowerCase().split(',');
            if(text2[i].DC == "TPE60") {
                switch(document.getElementById("reasonSelect").value) {
                    case "Rack Delivery":
                        if(type.includes("rack")) {
                            str.push(text2[i]["Vehicle registration number"]);
                            str = str.filter(function (el) { return el != null; });
                            document.getElementById("dateFrom").textContent = text2[i]["Delivery Date"].replaceAll("-","/");
                            document.getElementById("dateEnd").textContent = text2[i]["Delivery Date"].replaceAll("-","/");
                        }
                        break;
                    case "Receiving Cargo":
                        if(type.includes("lg") || type.includes("others")) {
                            str.push(text2[i]["Vehicle registration number"]);
                            str = str.filter(function (el) { return el != null; });
                            document.getElementById("dateFrom").textContent = text2[i]["Delivery Date"].replaceAll("-","/");
                            document.getElementById("dateEnd").textContent = text2[i]["Delivery Date"].replaceAll("-","/");
                        }
                        break;
                }
            }
        }
        str = str.filter(item => item !== "" && item !== null && item !== undefined);
        document.getElementById("carList").textContent = str.join("、");
    };
    reader.onerror = () => { console.log("Error reading the file. Please try again.", "error"); };
    reader.readAsText(file);
});

function csvJSON(csv){
    var lines=csv.split("\n");
    var result = [];    
    var commaRegex = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g    
    var quotesRegex = /^"(.*)"$/g
    var headers = lines[0].split(commaRegex).map(h => h.replace(quotesRegex, "$1"));
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(commaRegex);
        for(var j=0;j<headers.length;j++) obj[headers[j]] = currentline[j].replace(quotesRegex, "$1");
        result.push(obj);
    }
    return result;
}