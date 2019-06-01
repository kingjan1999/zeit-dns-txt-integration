const { withUiHook, htm } = require("@zeit/integration-utils");

const fakeDomains = require('./test/fakeDomains.json');

module.exports = withUiHook(async ({ payload, zeitClient }) => {
	console.log("Received Payload:")
	console.log(payload)

	const domains = fakeDomains;
	if (payload.action === "alternateView") {
		return htm`
			<Page>
				<H1>Payload.action was 'alternateView'</H1>
			</Page>
		`;
	} else {
		return htm`
		<Page>
			<H1>Verify Domains</H1>

		</Page>
	`;
	}
});
