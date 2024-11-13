/** TOGGLE MENU**/
document.addEventListener("DOMContentLoaded", function () {
    // Seleziona gli elementi della pagina
    const radioIntestazione = document.getElementById("btnradio1");
    const radioLogo = document.getElementById("btnradio2");
    const menuIntestazione = document.getElementById("menu-intestazione");
    const menuLogo = document.getElementById("menu-logo");

    // Funzione per gestire la visibilità delle sezioni
    function updateVisibility() {
        if (radioIntestazione.checked) {
            menuIntestazione.style.display = "block";
            menuLogo.style.display = "none";
        } else if (radioLogo.checked) {
            menuIntestazione.style.display = "none";
            menuLogo.style.display = "block";
        }
    }

    // Aggiungi event listener per rilevare i cambiamenti
    radioIntestazione.addEventListener("change", updateVisibility);
    radioLogo.addEventListener("change", updateVisibility);

    // Esegui una volta all'inizio per impostare lo stato iniziale
    updateVisibility();
});

/** MENU INTESTAZIONE SCONTRINO **/
function generaOutput() {
    const rows = document.querySelectorAll("#form .row");
    let rowNumber = 1;
    let partitaIvaValida = false;

    const xmlCommands = Array.from(rows).map(row => {
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
        document.getElementById("outputBox").value = `<printerCommands>\n${xmlCommands}\n</printerCommands>`;
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

// Funzione per generare il codice XML
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

// Funzione per centrare la descrizione
function centerHeader(text) {
    // Calcola la lunghezza del testo
    const textLength = text.length;

    // Se la lunghezza del testo è maggiore o uguale alla larghezza totale, non aggiunge spazi
    if (textLength >= 40) {
        return text;
    }

    // Calcolo degli spazi su ciascun lato per centrare il testo
    const padding = Math.floor((40 - textLength) / 2);

    // Costruzione della stringa centrata
    const paddedText = " ".repeat(padding) + text + " ".repeat(42 - textLength - padding);

    return paddedText;
}

// Funzione per copiare il contenuto della textarea
function copyIntestazioneToClipboard() {
    const outputBox = document.getElementById("outputIntestazioneBox");
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

// Funzione per svuotare i campi
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


/** MENU LOGO **/
// Funzione per generare il base64
function generateBase64() {
    const fileInput = document.getElementById("logoInput");
    const base64Output = document.getElementById("base64Output");

    // Controllo: verificare che sia stato selezionato un file
    if (fileInput.files.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Errore',
            text: 'Per favore, seleziona un\'immagine prima di generare il base64.',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Legge il file come base64
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        base64Output.value = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Funzione per copiare il contenuto della textarea
function copyLogoToClipboard() {
    const base64Output = document.getElementById("base64Output");
    navigator.clipboard.writeText(base64Output.value).then(() => {
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

// Funzione per svuotare tutti i campi
function clearFields() {
    document.getElementById("logoInput").value = "";
    document.getElementById("base64Output").value = "";
}