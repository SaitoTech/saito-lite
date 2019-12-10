module.exports = AracadeGameCarouselLeafTemplate = (mod, gameobj) => {
  return `
         <div class="leaf" style="background: url(${gameobj.background});background-size:cover">
           <div class="big">${gameobj.title}</div>
         </div>
  `;
}
