// Copy Tracking Code to Clipboard
function copyTrackingNumber() {
    const trackingNum = "MAMA-58-BDAY-2026";
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = trackingNum;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);

    showModal(
        '<i class="fa-solid fa-copy" style="color: var(--post-dark);"></i>',
        'Nummer kopiert!',
        `Die Sendungsnummer <b>${trackingNum}</b> wurde in deine Zwischenablage kopiert.`
    );
}

// Save Options & Trigger Confetti
function saveDeliveryOptions(event) {
    event.preventDefault();

    // Trigger Confetti Explosion
    confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
    });

    showModal(
        '<i class="fa-solid fa-circle-check" style="color: #38a169;"></i>',
        'Zustellanweisungen gespeichert!',
        'Deine Wunsch-Optionen wurden Hannah übermittelt. Sie freut sich schon!'
    );
}

// Secret Code Checker Logic
function checkCustomCode() {
    const input = document.getElementById('trackingInput').value.trim().toUpperCase();

    if (!input) {
        showModal(
            '<i class="fa-solid fa-circle-exclamation" style="color: var(--post-yellow);"></i>',
            'Hinweis',
            'Bitte gib einen Code ein (z. B. MAMA oder GUTSCHEIN).'
        );
        return;
    }

    if (input === 'MAMA' || input === 'MAMA58') {
        confetti({ particleCount: 150, spread: 80 });
        showModal(
            '<i class="fa-solid fa-heart" style="color: var(--post-red);"></i>',
            'Alles Gute zum 58. Geburtstag!',
            'Danke, dass du die allerbeste Mama der Welt bist! Deine Postbotin hat heute nicht nur Pakete im Gepäck, sondern auch gute Laune und Glückwünsche!'
        );
    } else if (input === 'GUTSCHEIN' || input === 'GUTSCHEINE') {
        confetti({ particleCount: 100, spread: 60 });
        showModal(
            '<i class="fa-solid fa-ticket" style="color: var(--post-yellow);"></i>',
            'Gutschein-Code eingelöst!',
            `<div style="text-align: left; background: #fffdf0; padding: 12px; border-radius: 8px; border: 1px solid #fefcbf; font-size: 0.8rem; line-height: 1.8;">
                        <p><b>🎟️ Gutschein 1:</b> 1x Schwere-Pakete-Trageservice</p>
                        <p><b>🎟️ Gutschein 2:</b> Retouren-Sorglos-Service (Ich nehme deine Retouren direkt mit)</p>
                     </div>`
        );
    } else {
        showModal(
            '<i class="fa-solid fa-box-open" style="color: var(--text-muted);"></i>',
            'Code nicht gefunden',
            `Der Code <b>"${input}"</b> ist uns unbekannt. Probiere es mal mit den Geheim-Codes: <b>MAMA</b> oder <b>GUTSCHEIN</b>!`
        );
    }
}

// Modal Helpers
function showModal(iconHtml, title, bodyHtml) {
    document.getElementById('modalIcon').innerHTML = iconHtml;
    document.getElementById('modalTitle').innerHTML = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('customModal').classList.add('active');
}

function closeModal() {
    document.getElementById('customModal').classList.remove('active');
}

// Welcome Confetti Shower on Page Load
window.onload = function () {
    setTimeout(() => {
        confetti({
            particleCount: 40,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });
        confetti({
            particleCount: 40,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });
    }, 400);
};


// ------------ Karte ---------------

document.addEventListener('DOMContentLoaded', function () {
    // 1. Koordinaten festlegen [Breitengrad, Längengrad]
    const startKoordinaten = [48.39417, 9.99889]; // Startort (Ulm)
    const zielKoordinaten = [48.4538, 10.2774];  // Zielort (Günzburg)

    // 2. Karte zentrieren & erstellen
    const map = L.map('map').setView(startKoordinaten, 11);

    // 3. OpenStreetMap-Kacheln laden
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 4. Postauto-Icon
    const postIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2769/2769339.png',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // 5. Auto-Marker
    const autoMarker = L.marker(startKoordinaten, { icon: postIcon }).addTo(map);
    autoMarker.bindPopup("<b>Sonderzustellung ist unterwegs!</b>").openPopup();

    // 6. Routenlinie
    L.polyline([startKoordinaten, zielKoordinaten], {
        color: '#FFCC00',
        weight: 5,
        dashArray: '10, 10'
    }).addTo(map);

    // 7. Haus-Marker direkt auf die zielKoordinaten setzen!
    const zielMarker = L.marker(zielKoordinaten, {
        icon: L.divIcon({
            className: 'custom-house-marker',
            html: '<div class="house-icon" style="background: white; padding: 6px; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><i class="fa-solid fa-house-chimney" style="color: #e74c3c; font-size: 20px;"></i></div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        })
    }).addTo(map);

    zielMarker.bindPopup("<b>Mamas Zuhause (Günzburg) 🏡</b>");

    // Animation aufrufbar machen
    window.starteFahrt = function () {
        let fortschritt = 0;
        const intervall = setInterval(() => {
            fortschritt += 0.01;
            const lat = startKoordinaten[0] + (zielKoordinaten[0] - startKoordinaten[0]) * fortschritt;
            const lng = startKoordinaten[1] + (zielKoordinaten[1] - startKoordinaten[1]) * fortschritt;

            autoMarker.setLatLng([lat, lng]);

            if (fortschritt >= 1) {
                clearInterval(intervall);
                autoMarker.bindPopup("<b>Paket erfolgreich zugestellt! 🎁</b>").openPopup();
            }
        }, 100);
    };

    setTimeout(() => {
        map.invalidateSize();
    }, 200);

    function updatePageByTime() {
        const now = new Date();
        const currentHour = now.getHours(); // Stunde von 0 bis 23

        // Erstmal alle zeitgesteuerten Blöcke ausblenden
        document.getElementById('display-at-09:00').style.display = 'none';
        document.getElementById('display-at-11:00').style.display = 'none';
        document.getElementById('display-at-13:00').style.display = 'none';
        document.getElementById('display-at-17:00').style.display = 'none';

        // Je nach Uhrzeit Blöcke aktivieren
        if (currentHour >= 9) {
            document.getElementById('display-at-09:00').style.display = 'block';
        }
        if (currentHour >= 11) {
            document.getElementById('display-at-11:00').style.display = 'block';
        }
        if (currentHour >= 13) {
            document.getElementById('display-at-13:00').style.display = 'block';
        }

        if (currentHour >= 17) {
            document.getElementById('display-at-17:00').style.display = 'block';
        }
    }

    // beim Laden der Seite direkt ausführen
    updatePageByTime();

    // Alle 60 Sekunden prüfen, falls sie die Seite offen lässt
    setInterval(updatePageByTime, 60000);

});