


function generaOutput() {
    const rows = document.querySelectorAll("#form .row");
    let rowNumber = 1;
    let partitaIvaValida = false;

    const result = Array.from(rows).map(row => {
        const select = row.querySelector("select").value;
        const input = row.querySelector("input").value;
        // Controlla se il campo è "P.iva" e contiene "P.IVA"
        if (select === "P.iva" && input.includes("P.IVA")) {
            partitaIvaValida = true;
        }
        const formattedRow = formatXMLRow(rowNumber, select, input);
        rowNumber++;
        return formattedRow;

    }).join('\n');

    if (partitaIvaValida) {
        document.getElementById("outputBox").value = `<printerCommands>\n${result}\n</printerCommands>`;
    } else {
        console.warn(`Deve essere presente almeno un campo "P.iva" con il testo "P.IVA`);
        Swal.fire({
            icon: 'warning',
            title: 'Errore',
            text: 'Deve essere presente almeno un campo "P.iva" con il testo "P.IVA',
            showConfirmButton: true,
        });
    }
}

function formatXMLRow(rowNumber, select, input) {
    let centeredText = centerHeader(input);
    let formattedRow = "";

    switch (select) {
        case "Ragione Sociale":
            formattedRow += `<directIO command="3016" data="${rowNumber.toString().padStart(2, '0')}${centeredText}" />\n`;
            formattedRow += `<directIO command="4016" data="${rowNumber.toString().padStart(2, '0')}4" />`;
            break;
        case "Indirizzo Locale":
            formattedRow += `<directIO command="3016" data="${rowNumber.toString().padStart(2, '0')}${centeredText}" />\n`;
            formattedRow += `<directIO command="4016" data="${rowNumber.toString().padStart(2, '0')}1" />`;
            break;
        case "P.iva":
            formattedRow += `<directIO command="3016" data="${rowNumber.toString().padStart(2, '0')}${centeredText}" />\n`;
            formattedRow += `<directIO command="4016" data="${rowNumber.toString().padStart(2, '0')}2" />`;
            break;
        default:
            formattedRow += `<directIO command="3016" data="${rowNumber.toString().padStart(2, '0')}${centeredText}" />\n`;
            formattedRow += `<directIO command="4016" data="${rowNumber.toString().padStart(2, '0')}1" />`;
    }
    return formattedRow;
}


function centerHeader(text) {
    // Calcola la lunghezza del testo
    const textLength = text.length;

    // Se la lunghezza del testo è maggiore o uguale alla larghezza totale, non aggiunge spazi
    if (textLength >= 42) {
        return text;
    }

    // Calcolo degli spazi su ciascun lato per centrare il testo
    const padding = Math.floor((42 - textLength) / 2);

    // Costruzione della stringa centrata
    const paddedText = " ".repeat(padding) + text + " ".repeat(42 - textLength - padding);

    return paddedText;
}

function copyToClipboard() {
    const outputBox = document.getElementById("outputBox");
    navigator.clipboard.writeText(outputBox.value).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Contenuto copiato!',
            showConfirmButton: false,
            timer: 1000
        });
    }).catch(err => {
        console.error("Errore nella copia del testo: ", err);
        Swal.fire({
            icon: 'error',
            title: 'Errore nella copia',
            text: 'Si è verificato un problema nel copiare il testo.',
            showConfirmButton: true,
        });
    });
}

function pulisciForm() {
    // Svuota tutti i campi input di testo
    document.querySelectorAll("#form input[type='text']").forEach(input => input.value = "");

    // Resetta ogni select alla sua opzione di default
    const selects = document.querySelectorAll("#form .form-select");
    selects.forEach((select, index) => {
        switch (index) {
            case 0:
            case 1:
                select.selectedIndex = 0; // "Ragione Sociale"
                break;
            case 2:
            case 3:
                select.selectedIndex = 1; // "Indirizzo Locale"
                break;
            case 4:
                select.selectedIndex = 2; // "P.iva"
                break;
            case 5:
                select.selectedIndex = 3; // "Generico"
                break;
            default:
                select.selectedIndex = 0;
        }
    });

    // Svuota la textarea di output
    document.getElementById("outputBox").value = "";
}