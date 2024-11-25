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

        let formattedRow = "";
        // Controlla se il campo è "P.iva" e contiene "P.IVA"
        if (select === "P.iva" && input.includes("P.IVA")) {
            partitaIvaValida = true;
        }
        if (input.length > 0) {
            formattedRow = formatXMLRow(rowNumber, select, input);
            rowNumber++;
        }
        
        return formattedRow;

    }).filter(formattedRow => formattedRow !== "") // Filtra le righe vuote
    .join('\n');

    if (partitaIvaValida) {
        document.getElementById("outputIntestazioneBox").value = `<printerCommands>\n${xmlCommands}\n</printerCommands>`;
    } else {
        console.warn(`Deve essere presente almeno un campo "P.iva" con il testo "P.IVA`);
        Swal.fire({
            icon: 'warning',
            title: 'Attenzione',
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
            formattedRow += `<directIO command="4016" data="${rowNumber}4" />`;
            break;
        case "Indirizzo Locale":
            formattedRow += `<directIO command="3016" data="${rowNumber.toString().padStart(2, '0')}${centeredText}" />\n`;
            formattedRow += `<directIO command="4016" data="${rowNumber}1" />`;
            break;
        case "P.iva":
            formattedRow += `<directIO command="3016" data="${rowNumber.toString().padStart(2, '0')}${centeredText}" />\n`;
            formattedRow += `<directIO command="4016" data="${rowNumber}2" />`;
            break;
        default:
            formattedRow += `<directIO command="3016" data="${rowNumber.toString().padStart(2, '0')}${centeredText}" />\n`;
            formattedRow += `<directIO command="4016" data="${rowNumber}1" />`;
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
    const outputIntestazioneBox = document.getElementById("outputIntestazioneBox");
    navigator.clipboard.writeText(outputIntestazioneBox.value).then(() => {
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
    document.getElementById("outputIntestazioneBox").value = "";
}


/** MENU LOGO **/
// Validatore immagine bmp
function validateImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const buffer = event.target.result;
            const dataView = new DataView(buffer);

            // Verifica che l'immagine sia BMP
            const isBmp = dataView.getUint16(0) === 0x424D;
            if (!isBmp) {
                Swal.fire({
                    icon: 'error',
                    title: 'Errore',
                    text: 'L\'immagine deve essere in formato BMP.',
                    showConfirmButton: true
                });
                return reject();
            }

            // Verifica dimensioni dell'immagine
            const width = dataView.getUint32(18, true);
            const height = Math.abs(dataView.getUint32(22, true)); // BMP usa segno per altezza

            if (width > 576 || height > 400) {
                Swal.fire({
                    icon: 'error',
                    title: 'Errore',
                    text: 'L\'immagine deve avere larghezza ≤ 576 px e altezza ≤ 400 px.',
                    showConfirmButton: true
                });
                return reject();
            }

            // Funzione per calcolare la saturazione di un pixel
            function calculateSaturation(r, g, b) {
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                return max === 0 ? 0 : (max - min) / max;
            }

            // Impostazioni per il controllo dei bordi
            const rowSize = Math.ceil((width * 24) / 8); // Calcola la larghezza della riga in byte (24 bit per pixel)
            const pixelArrayOffset = dataView.getUint32(10, true); // Offset di inizio dell'array di pixel
            const whitePixelValue = 255; // Valore per un pixel completamente bianco

            let leftHasContent = false;
            let rightHasContent = false;

            // Controllo del bordo sinistro e destro per pixel diversi dal bianco
            for (let y = 0; y < height; y++) {
                // Bordo sinistro
                const leftIndex = pixelArrayOffset + y * rowSize;
                const rLeft = dataView.getUint8(leftIndex + 2);
                const gLeft = dataView.getUint8(leftIndex + 1);
                const bLeft = dataView.getUint8(leftIndex);

                if (!(rLeft === whitePixelValue && gLeft === whitePixelValue && bLeft === whitePixelValue)) {
                    leftHasContent = true;
                }

                // Bordo destro
                const rightIndex = pixelArrayOffset + y * rowSize + (rowSize - 3);
                const rRight = dataView.getUint8(rightIndex + 2);
                const gRight = dataView.getUint8(rightIndex + 1);
                const bRight = dataView.getUint8(rightIndex);

                if (!(rRight === whitePixelValue && gRight === whitePixelValue && bRight === whitePixelValue)) {
                    rightHasContent = true;
                }

                // Se entrambi i lati hanno contenuto, interrompe il ciclo
                if (leftHasContent && rightHasContent) {
                    break;
                }
            }

            if (!leftHasContent || !rightHasContent) {
                Swal.fire({
                    icon: 'error',
                    title: 'Errore',
                    text: 'L\'immagine deve avere almeno un pixel non bianco a sinistra e a destra.',
                    showConfirmButton: true
                });
                return reject();
            }

            resolve();
        };

        reader.onerror = function () {
            Swal.fire({
                icon: 'error',
                title: 'Errore',
                text: 'Errore durante la lettura del file.',
                showConfirmButton: true
            });
            reject();
        };

        // Legge il file come array buffer per analizzarlo
        reader.readAsArrayBuffer(file);
    });
}



// Funzione per generare il base64
function generateBase64() {
    const fileInput = document.getElementById("logoInput");
    const base64Output = document.getElementById("base64Output");

    const file = fileInput.files[0];
    if (!file) {
        Swal.fire({
            icon: 'warning',
            title: 'Attenzione',
            text: 'Seleziona un\'immagine per poter generare il base64.',
            confirmButtonText: 'OK'
        });
        return;
    }

    // Verifica se l'immagine rispetta i requisiti prima di generare il Base64
    validateImage(file).then(() => {
        const reader = new FileReader();
        reader.onload = function (event) {
            base64Output.value = 
            `<printerNonFiscal>
                <beginNonFiscal />
                    <setLogo operator="" location="0" index="1" option="0" graphicFormat="B">${event.target.result}</setLogo>
                <endNonFiscal />
            </printerNonFiscal>
            `;
        };
        reader.readAsDataURL(file);
    }).catch(() => {
        // Reimposta il campo di input e l'output se la validazione fallisce
        fileInput.value = "";
        base64Output.value = "";
    });
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