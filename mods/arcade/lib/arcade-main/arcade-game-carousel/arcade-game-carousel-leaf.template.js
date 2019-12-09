module.exports = AracadeGameCarouselLeafTemplate = (mod, gameobj) => {
  return `
         <div class="leaf" style="background: url(${gameobj.background});background-size:cover">
           <div class="big">${gameobj.title}</div>
           <img class="HIS" src="./img/HIS.png" />
           <img class="CD" src="./img/CD.png" />
           <img class="RLIRS" src="./img/RLIRS.png" />
         </div>
  `;
}
