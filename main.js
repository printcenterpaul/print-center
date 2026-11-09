/* Print Center - frontend */
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzb5IXQE7xakz4ylE56ZXPMzrimNDvldtA9Wd5l4ID6GVWqeO7C6YwsvZip84pPP4uYaw/exec';

// Meniu mobil
const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.navlinks');
if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

// Anul curent în footer
document.querySelectorAll('[data-year]').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Listă fișiere selectate
const fileInput = document.querySelector('#files');
const fileList = document.querySelector('#file-list');
if (fileInput && fileList) {
  fileInput.addEventListener('change', () => {
    fileList.innerHTML = '';
    [...fileInput.files].forEach(file => {
      const item = document.createElement('li');
      item.textContent = `${file.name} — ${(file.size / 1024 / 1024).toFixed(2)} MB`;
      fileList.appendChild(item);
    });
  });
}

// Formular comandă
const orderForm = document.querySelector('#order-form');
if (orderForm) {
  orderForm.addEventListener('submit', async event => {
    event.preventDefault();

    const status = document.querySelector('#form-success');
    const files = [...(document.querySelector('#files')?.files || [])];
    const button = orderForm.querySelector('button[type="submit"]');

    if (!files.length) {
      alert('Te rugăm să atașezi cel puțin un fișier.');
      return;
    }

    const maxFileSize = 12 * 1024 * 1024;
    if (files.some(file => file.size > maxFileSize)) {
      alert('Fiecare fișier trebuie să aibă maximum 12 MB.');
      return;
    }

    if (button) {
      button.disabled = true;
      button.textContent = 'Se trimite comanda...';
    }
    if (status) {
      status.style.display = 'block';
      status.textContent = 'Se încarcă fișierele. Te rugăm să nu închizi pagina.';
    }

    try {
      const encodedFiles = [];
      for (const file of files) {
        encodedFiles.push({
          name: file.name,
          type: file.type || 'application/octet-stream',
          data: await toBase64(file)
        });
      }

      const data = {
        name: orderForm.elements.namedItem('name').value.trim(),
        email: orderForm.elements.namedItem('email').value.trim(),
        phone: orderForm.elements.namedItem('phone').value.trim(),
        format: orderForm.elements.namedItem('format').value,
        color: orderForm.elements.namedItem('color').value,
        copies: orderForm.elements.namedItem('copies').value,
        notes: orderForm.elements.namedItem('notes').value.trim(),
        files: encodedFiles,
        createdAt: new Date().toISOString()
      };

      // Google Apps Script primește câmpul POST "payload".
      // no-cors nu permite citirea răspunsului serverului în browser.
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: new URLSearchParams({ payload: JSON.stringify(data) })
      });

      if (status) {
        status.style.display = 'block';
        status.textContent = 'Comanda a fost trimisă! Îți mulțumim. Vom verifica documentele și te vom contacta pentru confirmarea prețului și a termenului.';
      }
      orderForm.reset();
      if (fileList) fileList.innerHTML = '';

    } catch (error) {
      console.error('Eroare la trimiterea comenzii:', error);
      if (status) {
        status.style.display = 'block';
        status.textContent = 'Nu am putut transmite comanda. Te rugăm să încerci din nou sau să ne contactezi pe WhatsApp la 0749 542 172.';
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Trimite comanda';
      }
    }
  });
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(reader.error || new Error('Fișierul nu a putut fi citit.'));
    reader.readAsDataURL(file);
  });
}
