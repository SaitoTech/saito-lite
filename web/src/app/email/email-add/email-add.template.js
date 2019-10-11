export const EmailAddTemplate = () => {
    return `
        <div class="email-content">
            <input class="email-title" type="text" placeholder="Title"/>
            <input class="email-address" type="text" placeholder="Address"/>
            <textarea class="email-text" placeholde="Message"></textarea>
            <button class="email-submit">SUBMIT</button>
        </div>
    `;
}
