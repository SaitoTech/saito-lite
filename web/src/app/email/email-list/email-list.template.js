export const EmailListTemplate = () => {
    return `
        <div class="email-container">
            <div class="email-message">
               <div class="email-message-content"">
                    <h3>New Email Message!</h3>
                    <p class="emai-message-messge">this is the new message inside this shit</p>
               </div>
               <p class="email-message-timestamp">12:43pm</p>
            </div>
            <button id="email" class="create-button"><i class="fas fa-plus"></i></button>
        </div>
    `;
}
