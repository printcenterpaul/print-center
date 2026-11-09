/**
 * PRINT CENTER - Google Apps Script backend
 * 1) Creează un folder în Google Drive pentru comenzile primite.
 * 2) Publică scriptul ca Web App: Execute as Me, access Anyone.
 * 3) Copiază URL-ul Web App în câmpul din pagina comanda.html.
 *
 * Notă: formularul trimite fișierele ca base64. Recomandat max. 12 MB/fișier.
 */
const FOLDER_NAME = 'Print Center - Comenzi';

function doPost(e) {
  try {
    const payload = JSON.parse(e.parameter.payload || '{}');
    const folder = getOrCreateFolder_();
    const orderFolder = folder.createFolder(
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss') +
      ' - ' + sanitize_(payload.name || 'Client')
    );

    const saved = [];
    (payload.files || []).forEach(function(file) {
      const bytes = Utilities.base64Decode(file.data);
      const blob = Utilities.newBlob(bytes, file.type || 'application/octet-stream', sanitize_(file.name));
      const driveFile = orderFolder.createFile(blob);
      saved.push(driveFile.getUrl());
    });

    const summary = [
      'Comandă nouă Print Center',
      'Nume: ' + (payload.name || ''),
      'Telefon: ' + (payload.phone || ''),
      'Email: ' + (payload.email || ''),
      'Format: ' + (payload.format || ''),
      'Tip print: ' + (payload.color || ''),
      'Exemplare: ' + (payload.copies || ''),
      'Detalii: ' + (payload.notes || ''),
      'Fișiere: ' + saved.join('\n'),
      'Primită: ' + (payload.createdAt || '')
    ].join('\n');

    orderFolder.createFile('detalii-comanda.txt', summary, MimeType.PLAIN_TEXT);
    return ContentService.createTextOutput(JSON.stringify({ok:true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateFolder_() {
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  return folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER_NAME);
}
function sanitize_(name) {
  return String(name).replace(/[\\\\/:*?"<>|]/g, '-').substring(0, 90);
}
