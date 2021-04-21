let communityAddresses = [  
  "0x50a0f8ddc966afa76d39a8c346a2d3ad9e591d1d",
  "0xee22ee448a3a2b6b8f01a45da1476e2d01e24f3a",
  "0xb4b04564f56f4795ea4e14d566af78da54a99980",
  "0x36dad151ae73852c3714d9345e33f4e4759c5e0b",
  "0xb46dd1a2aee6d757498ec1a31934e48acc0aa24b",
  "0xc0f7192815c6f81ac9c155bf1f56c89de8f44cf6",
  "0x986d905b4182f78ebdb9504783d9c2d7fe7f4067",
  "0xa28e586e24e6d78d05e822188ddc118ac2fb034b",
  "0xe7379bb9430343bdcbb1d240293ea57f980068aa",
  "0x89c223afb27cb8b2c13b72dcf3bfd519063fe5c1",
];
let polsAddresses = [
  "0x50a0f8ddc966afa76d39a8c346a2d3ad9e591d1d",
  "0xee22ee448a3a2b6b8f01a45da1476e2d01e24f3a",
  "0xb4b04564f56f4795ea4e14d566af78da54a99980",
  "0x36dad151ae73852c3714d9345e33f4e4759c5e0b",
  "0xb46dd1a2aee6d757498ec1a31934e48acc0aa24b",
  "0xc0f7192815c6f81ac9c155bf1f56c89de8f44cf6",
  "0x986d905b4182f78ebdb9504783d9c2d7fe7f4067",
  "0xa28e586e24e6d78d05e822188ddc118ac2fb034b",
  "0xe7379bb9430343bdcbb1d240293ea57f980068aa",
  "0x89c223afb27cb8b2c13b72dcf3bfd519063fe5c1",
]
let communityHTML = "";
let polsHTML = "";
communityAddresses.forEach((item, i) => {
  communityHTML += `<div class="address">${item}</div>`
});
polsAddresses.forEach((item, i) => {
  polsHTML += `<div class="address">${item}</div>`
});

module.exports = WhitelistTemplate = () => {
  return `
  <div class="whitelistSection">
    <div class="communityAddresses">
      <div class="whitelistTitle">Community</div>
      ${communityHTML}
    </div>
    <div class="polsAddresses">
      <div class="whitelistTitle">POLS Holders</div>
      ${polsHTML}
    </div>
  </div>`;
}
