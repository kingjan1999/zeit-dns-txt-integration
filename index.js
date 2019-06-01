const {withUiHook, htm} = require("@zeit/integration-utils");

const providers = require("./src/providers");
const fakeDomains = require("./test/fakeDomains.json");

const domainItem = (domain) => {
    return htm`
	  <Box display="flex" justifyContent="space-between">
	    ${domain.name}
	    <Button action="verify-${domain.id}">Verify Now</Button>
      </Box>
	`;
};

const providerOption = (provider) => {
    console.log(provider);
    return htm`
      <Option value="${provider.key}" caption="${provider.name}" />
    `;
};

module.exports = withUiHook(async ({payload, zeitClient}) => {
    console.log("Received Payload:");
    console.log(payload);

    const domains = fakeDomains.domains.filter(x => !x.verified);
    const domainBoxes = domains.map(domainItem);

    // const metadata = await zeitClient.getMetadata();
    const metadata = {
        providers: {
            route53: {AWS_ACCESS_KEY_ID: 'abc', AWS_SECRET_ACCESS_KEY: 'cde'}
        }
    };

    if (payload.action.includes("verify")) {
        const domainId = payload.action.substr(payload.action.indexOf("verify-") + "verify-".length);
        const domain = domains.find(x => x.id === domainId);

        const configuredProviders = metadata.providers;
        console.log(Object.keys(configuredProviders));
        console.log(providers);
        const providerDescriptions = Object.keys(configuredProviders).map(key => ({key, name: providers[key].name}));
        const providerOptions = providerDescriptions.map(providerOption);
        htm`
			<Page>
				<H1>Verify ${domain.name}</H1>
				<H3>Choose your DNS provider</H3>
				<Select name="DNS Provider" value="dnsProvider">
                  ${providerOptions}
                </Select>
			</Page>
		`;
    } else {
        return htm`
		<Page>
			<H1>Verify Domains</H1>
			${domainBoxes}
		</Page>
	`;
    }
});
