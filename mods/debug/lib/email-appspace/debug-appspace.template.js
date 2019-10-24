module.exports = DebugAppspaceTemplate = () => {
  return `

      <pre id="email-appspace-debug" class="email-appspace-debug">
      </pre>
      <style type="text/css">
	.email-appspace-debug {
    font-size: 1.2em;
    overflow: auto;
    height: 81vh;
    width: 65vw;
	}
      </style>
  `;
}
