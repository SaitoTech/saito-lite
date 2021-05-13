module.exports = TeamTemplate = () => {
  const team = [
    {
      name: 'David Lancashire', 
      photoFile: 'David_Lancashire.jpeg', 
      desc: 'A tech entrepreneur who has been involved with the Chinese crypto space since 2012. He co-founded the Saito project and has presented on blockchain at Tsinghua, Deconomy, and at the Asia Blockchain Summit in Taipei. David did graduate work at the Berkeley and has a background in tech, political science and economics.', 
      linkedin: 'https://linkedin.com/in/david-lancashire'
    },
    {
      name: 'Richard Parris', 
      photoFile: 'richard-headshot-300x300.jpg', 
      desc: 'Has 15 years of experience leading technology projects and teams in Japan and China. After exiting his previous startup Richard helped design Saito Consensus and co-founded the project. He has degrees in Mathematics and Philosophy from Melbourne, and has lived in Beijing since 2007.', 
      linkedin: 'https://linkedin.com/in/richard-parris-02b5a39/'
    },
    {
      name: 'Clayton Rabenda', 
      photoFile: '', 
      desc: 'Studied Electronics and Electrical Engineering at LeHigh University and worked on the web technologies teams at Viacom and Amplify Inc. before joining Google as a Software Engineer focused on fraud protection in the company’s advertising platforms.', 
      linkedin: 'https://linkedin.com/in/clayton-rabenda-6ab9b39'
    }
  ];

  let html = "";
  team.forEach( member => {
    html += `
    <div class="team-member">
      <div class="team-photo"><img src="/subpagestyle/team/${member.photoFile}" /></div>
      <div class="team-details">
        <h3 class="team-name">${member.name}</h3>
        <p class="team-desc">${member.desc}</p>
        <div class="team-links">
          <a href="${member.linkedin}" class="button">Linked In Profile</a></div>
      </div>
    </div>
    `;
  });

    return `
    <div class="team-page">
      <h1 class="page-title">Our Team</h1>
      <p class="desc">Our team is based in Chaoyang District, Beijing. For more information or to speak to a member of the team please contact our address for general email inquiries: info@saito.tech.</p>
      
      <div class="team-container">${html}</div>

      <p class="team-footer">We are also proud to be running a distributed team of marketing staff, network debuggers and testers, application developers and community managers. Approximately half of our staff are based in Asia, with the remainder distributed through Spain, South Africa and South America.</p>
    </div>`;
  }
  