const startModel = new bootstrap.Modal('#exampleModal');

document.addEventListener("DOMContentLoaded", () => {
    startModel.show();
});

document.getElementById("printBtn").addEventListener("click", () => {
    startModel.hide();
    setTimeout(() => { print(); }, "1000");
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
        document.getElementById("dateToday").textContent = `${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`;
        const text = reader.result;
        const text2 = csvJSON(text);
        var str = [];
        for(var i in text2) {
            const type = text2[i]["Type of delivery"].trim().toLowerCase().split(',');
            console.log(type);
            if(text2[i].DC == "TPE60") {
                switch(document.getElementById("reasonSelect").value) {
                    case "Rack Delivery":
                        if(type.includes("rack")) {
                            str.push({"name": text2[i]["Name in local language(if applicable)"] , "id" : text2[i]["Government ID"]});
                            document.getElementById("dateFrom").textContent = formatSimpleFullYearDate(text2[i]["Delivery Date"]);
                            document.getElementById("dateEnd").textContent = formatSimpleFullYearDate(text2[i]["Delivery Date"]);
                        }
                        break;
                    case "Receiving Cargo":
                        if(type.includes("lg") || type.includes("others")) {
                            str.push({"name": text2[i]["Name in local language(if applicable)"] , "id" : text2[i]["Government ID"]});
                            document.getElementById("dateFrom").textContent = formatSimpleFullYearDate(text2[i]["Delivery Date"]);
                            document.getElementById("dateEnd").textContent = formatSimpleFullYearDate(text2[i]["Delivery Date"]);
                        }
                        break;
                }
            }

        }
        for(var i in str) {
            document.getElementById(`field-${parseInt(i) + 1}-1`).textContent = str[i].name;
            document.getElementById(`field-${parseInt(i) + 1}-1`).classList.remove('text-white');
            const id = str[i].id.split("");
            for (var j = 0 ; j < 5 ; j++) {
                document.getElementById(`field-${parseInt(i) + 1}-${2+j}`).textContent = id[j];
                document.getElementById(`field-${parseInt(i) + 1}-${2+j}`).classList.remove('text-white');
            }
        }
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

function formatSimpleFullYearDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}-${month}-${year}`;
}