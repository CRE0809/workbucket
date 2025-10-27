const startModel = new bootstrap.Modal('#exampleModal');
const finishModel = new bootstrap.Modal('#finishModal');

document.addEventListener("DOMContentLoaded", () => {
    startModel.show();
});

document.getElementById("formFile").addEventListener("change", (event) => {
    startModel.hide();
    finishModel.show();
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
        const text2 = csvJSON(text);
        var str = [];
        var dateStart, dateEnd;
        for(var i in text2) {
            if(text2[i].DC == "TPE60" && text2[i]["Type of delivery"] == "RACK") {
                str.push({"name": text2[i]["Name in local language(if applicable)"] , "phone" : text2[i]["Contact number"]});
                str = str.filter(function (el) {
                    return el != null;
                });
                dateStart = text2[i]["Delivery Date"].replaceAll("-","/");
                dateEnd = text2[i]["Delivery Date"].replaceAll("-","/");
            }
        }
        copyPages(dateStart, dateEnd, str);
    };
    reader.onerror = () => { console.log("Error reading the file. Please try again.", "error"); };
    reader.readAsText(file);
});

async function copyPages(dateStart,dateEnd,people) {
    const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
    const { ontkit } = fontkit;

    const fonturl = 'https://workbucket.cretw.com/amazon/aws/tpe60/files/NotoSansTC-Regular.ttf';
    const fontBytes = await fetch(fonturl).then(res => res.arrayBuffer())

    const url1 = 'https://workbucket.cretw.com/amazon/aws/tpe60/files/raw.pdf';

    const firstDonorPdfBytes = await fetch(url1).then(res => res.arrayBuffer())

    const firstDonorPdfDoc = await PDFDocument.load(firstDonorPdfBytes);
    const firstDonorPageCount = await firstDonorPdfDoc.getPages();

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const customFont = await pdfDoc.embedFont(fontBytes);

    // 第一頁
    var [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [0])
    pdfDoc.addPage(firstDonorPage);
    firstDonorPage.drawText(`${String(new Date().getDate()).padStart(2, '0')}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${new Date().getFullYear()}`, { x: 375, y: 726, size: 10, font: customFont, color: rgb(0,0,0)});
    firstDonorPage.drawText(`${dateStart} ~ ${dateEnd}`, { x: 152, y: 595, size: 10, font: customFont, color: rgb(0,0,0)});

    // 第二頁
    var [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [1])
    pdfDoc.addPage(firstDonorPage);
    firstDonorPage.drawText(`${dateStart} 08 時 起`, { x: 153, y: 710, size: 12, font: customFont, color: rgb(0,0,0)});
    firstDonorPage.drawText(`${dateEnd} 19 時 止`, { x: 153, y: 690, size: 12, font: customFont, color: rgb(0,0,0)});

    var yyy = 385;
    for(var i in people) {
        if(i % 2 == 0) {
            firstDonorPage.drawText(`${people[i].name}`, { x: 110, y: yyy, size: 12, font: customFont, color: rgb(0,0,0)});
            firstDonorPage.drawText(`${people[i].phone}`, { x: 200, y: yyy, size: 12, font: customFont, color: rgb(0,0,0)});
        }
        else {
            firstDonorPage.drawText(`${people[i].name}`, { x: 385, y: yyy, size: 12, font: customFont, color: rgb(0,0,0)});
            firstDonorPage.drawText(`${people[i].phone}`, { x: 475, y: yyy, size: 12, font: customFont, color: rgb(0,0,0)});
            yyy -= 27;
        }
    }

    // 第三頁
    var [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [2])
    pdfDoc.addPage(firstDonorPage);
    firstDonorPage.drawText(`${dateStart} 08 時 起`, { x: 150, y: 680, size: 12, font: customFont, color: rgb(0,0,0)});
    firstDonorPage.drawText(`${dateEnd} 19 時 止`, { x: 150, y: 660, size: 12, font: customFont, color: rgb(0,0,0)});

    var yyy = 395;
    for(var i in people) {
        if(i % 2 == 0) {
            firstDonorPage.drawText(`${people[i].name}`, { x: 110, y: yyy, size: 12, font: customFont, color: rgb(0,0,0)});
            firstDonorPage.drawText(`${people[i].phone}`, { x: 200, y: yyy, size: 12, font: customFont, color: rgb(0,0,0)});
        }
        else {
            firstDonorPage.drawText(`${people[i].name}`, { x: 385, y: yyy, size: 12, font: customFont, color: rgb(0,0,0)});
            firstDonorPage.drawText(`${people[i].phone}`, { x: 475, y: yyy, size: 12, font: customFont, color: rgb(0,0,0)});
            yyy -= 27;
        }
    }

    // 第四頁
    var [firstDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [3])
    pdfDoc.addPage(firstDonorPage);
    firstDonorPage.drawText(`${dateStart} ~ ${dateEnd}`, { x: 148, y: 673, size: 10, font: customFont, color: rgb(0,0,0)});
    firstDonorPage.drawText(`${dateStart}`, { x: 347, y: 645, size: 9, font: customFont, color: rgb(0,0,0)});
    for(var i in people) firstDonorPage.drawText(`${people[i].name}`, { x: 75, y: 570 - i*35, size: 12, font: customFont, color: rgb(0,0,0)});

    for(var i = 4; i < firstDonorPageCount.length; i++) {
        var [elseDonorPage] = await pdfDoc.copyPages(firstDonorPdfDoc, [i])
        pdfDoc.addPage(elseDonorPage);
    }
    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, "cht-idc.pdf", "application/pdf");
    document.getElementById("finishBody").innerHTML = "The file will download soon!<br>Experiencing issues? Please send a message to cretw@.";
    document.getElementById("finishFooter").style.display = "block";
}

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