// If pluralization/variables become big issues, checkout polyglot.js

// Load the translation .json file
var il8n_file = null;

const il8n = (targetLang) => {
    // Replace all text with "il8n" class to locale
    document.querySelectorAll("[data-il8n]").forEach(el => {
        const selector = el.getAttribute("data-il8n");
        
        if (il8n_file.hasOwnProperty(selector) && il8n_file[selector].hasOwnProperty(targetLang) && (il8n_file[selector][targetLang] != ""))
            el.textContent = il8n_file[selector][targetLang];
    });
};

const toggleBtn = (targetLang = null) => {
    const currentLang = document.querySelector("html").getAttribute("lang");
    if (targetLang == null) {
        targetLang = (currentLang == "en") ? "zh" : "en";
    }
    if (currentLang == targetLang) return targetLang;

    document.querySelector("html").setAttribute("lang", targetLang);

    // change text to targetLang
    document.querySelectorAll(".translate-toggle").forEach(el=> {
        const from = el.getAttribute("data-il8n-from");
        if (targetLang == from) {
            const toText = el.getAttribute("data-il8n-to-text");
            el.textContent = toText;
        } else {
            const fromText = el.getAttribute("data-il8n-from-text");
            el.textContent = fromText;
        }
    });

    return targetLang;
}

document.onreadystatechange = async function () {
    if (document.readyState === "interactive") {
        il8n_file = await fetch(`/website/il8n/homepage.json`)
        .then(data => data.json())
        .catch(err => {});

        if (document.location.host.includes("cn.saito.io"))
            il8n("zh");
        else
            il8n("en");
        document.querySelectorAll(".translate-toggle").forEach(el=> {
            el.addEventListener("click", e => {
                e.preventDefault();
                const targetLang = toggleBtn();
                il8n(targetLang);
            });
        });
    }
};