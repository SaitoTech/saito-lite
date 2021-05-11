// If pluralization/variables become big issues, checkout polyglot.js

// Load the translation .json file
var il8n_file = null;

const il8n = (targetLang) => {
    document.querySelector("html").setAttribute("lang", targetLang);
    // Replace all text with "il8n" class to locale
    document.querySelectorAll("[data-il8n]").forEach(el => {
        const selector = el.getAttribute("data-il8n");
        
        if (il8n_file.hasOwnProperty(selector) && il8n_file[selector].hasOwnProperty(targetLang))
            el.textContent = il8n_file[selector][targetLang];
    });
    
    // Change the text to translate to English
    // document.querySelectorAll(".translate-cn").forEach(el => {
    //     el.classList.remove("translate-cn");
    //     el.classList.add("translate-en");

    // });
};

document.onreadystatechange = async function () {
    if (document.readyState === "interactive") {
        il8n_file = await fetch(`/website/il8n/homepage.json`)
        .then(data => data.json())
        .then(data => data)
        .catch(err => {});

        il8n("en");

        document.querySelectorAll(".translate-cn").forEach(el=> {
            el.addEventListener("click", e => {
                e.preventDefault();
                il8n("cn");
            });
        });
    }
};