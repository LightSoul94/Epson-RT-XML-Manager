# Epson RT XML Manager

![Epson RT XML Manager Logo](icon.ico)

**Epson RT XML Manager** è uno strumento versatile per gestire e configurare in modo efficiente le intestazioni e altre impostazioni su registratori telematici Epson RT tramite comandi XML. Facilita l'amministrazione delle impostazioni fiscali e ottimizza i processi di configurazione per gli utenti.

---

## Sommario

- [Caratteristiche](#caratteristiche)
- [Requisiti di Sistema](#requisiti-di-sistema)
- [Installazione](#installazione)
- [Configurazione](#configurazione)
- [Utilizzo](#utilizzo)
- [Contributi](#contributi)
- [Licenza](#licenza)

---

## Caratteristiche

- **Gestione Intestazioni**: Configura le intestazioni fiscali con facilità.
- **Interfaccia XML**: Usa comandi XML per interagire con i dispositivi Epson RT.
- **Controlli di Validazione**: Verifica che i campi obbligatori, come la Partita IVA, siano impostati correttamente.
- **Funzionalità di Copia negli Appunti**: Copia facilmente le configurazioni generate.
- **Supporto Multi-Dispositivo**: Compatibile con una gamma di registratori telematici Epson.

## Requisiti di Sistema

- **Git** per il controllo di versione
- **Registratore Telematico Epson RT** compatibile con comandi XML
- Browser moderno per l’interfaccia utente

## Installazione

1. Clona il repository:
   ```bash
   git clone https://github.com/tuo-utente/Epson-RT-XML-Manager.git
   ```
2. Accedi alla cartella del progetto:
   ```bash
   cd Epson-RT-XML-Manager
   ```

## Configurazione

Prima di iniziare, assicurati che le impostazioni del dispositivo Epson RT siano configurate correttamente per ricevere i comandi XML. Consulta il manuale del dispositivo per le informazioni sulla configurazione della rete e degli endpoint XML.

Nel progetto, puoi configurare le impostazioni nel file `.env`:
```plaintext
DEVICE_IP=[l'indirizzo IP del tuo RT]
DEVICE_PORT=80
```

## Utilizzo

1. **Avvia l'applicazione**:
   ```bash
   npm start
   ```
2. **Genera e Configura**:
   - Inserisci i dati nei campi del form e genera i comandi XML personalizzati per la tua intestazione.
   - Assicurati che la Partita IVA e altri campi obbligatori siano correttamente impostati.
3. **Invia al Dispositivo**:
   - Utilizza l’interfaccia per inviare i comandi XML generati al registratore Epson RT.
4. **Copia le Configurazioni**:
   - Usa il pulsante di copia per trasferire facilmente i dati negli appunti.

## Contributi

I contributi sono benvenuti! Se hai idee, suggerimenti o desideri correggere eventuali bug, apri una pull request o segnala un problema.

1. **Fork del progetto** e crea il tuo branch.
2. Effettua le modifiche e descrivile nel commit.
3. Invia una pull request descrivendo il contributo.

## Licenza

Questo progetto è distribuito sotto la licenza MIT. Per maggiori dettagli, consulta il file [LICENSE](LICENSE).

---

Grazie per aver scelto **Epson RT XML Manager**! Semplifichiamo la gestione fiscale insieme.
