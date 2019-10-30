module.exports = DebugAppspaceTemplate = () => {
  return `

      <pre id="email-appspace-debug" class="email-appspace-debug">
      </pre>
      <style type="text/css">
	.email-appspace-debug {
    font-size: 1.2em;
    overflow: auto;
    height: 83vh;
    width: calc(100vw - 15em);
	}
      </style>
  `;
}
