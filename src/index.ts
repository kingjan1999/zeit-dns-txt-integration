import {htm, withUiHook} from "@zeit/integration-utils";

import providers from "./providers";
import views from "./views";

import fakeDomains from "../test/fakeDomains.json";
import {fetchUnverifiedDomains} from "./domains";

const domainItem = (domain: ZEITDomain) => {
    const action = `verify-${domain.id}`
    return htm`
	  <Box display="flex" justifyContent="space-between">
	    ${domain.name}
	    <Button action="${action}">Verify Now</Button>
      </Box>
	`;
};

const providerOption = (provider: { key: string, name: string }) => {
    return htm`
      <Option value="${provider.key}" caption="${provider.name}" />
    `;
};

module.exports = withUiHook(async ({payload, zeitClient}) => {
    console.log("Received Payload:");
    console.log(payload);

    // const domains = fakeDomains.domains.filter(x => !x.verified);
    const domains = await fetchUnverifiedDomains(payload.token);
    const domainBoxes = domains.map(domainItem);

    let metadata = await zeitClient.getMetadata();
    console.log(metadata);
    metadata = {
        providers: {
            route53: {AWS_ACCESS_KEY_ID: 'abc', AWS_SECRET_ACCESS_KEY: 'cde'}
        }
    };

    if (payload.action.includes("verify")) {
        const domainId = payload.action.substr(payload.action.indexOf("verify-") + "verify-".length);
        const domain = domains.find((x: ZEITDomain) => x.id === domainId);
        if (!domain) {
            return; // TODO: error message
        }

        const configuredProviders = metadata.providers;
        console.log(Object.keys(configuredProviders));
        console.log(providers);
        // @ts-ignore
        const providerDescriptions = Object.keys(configuredProviders).map(key => ({key, name: providers[key].name}));
        const providerOptions = providerDescriptions.map(providerOption);
        const action = `do-verify-${domainId}`;
        return htm`
			<Page>
				<H1>Verify ${domain.name}</H1>
				<H2>Choose your DNS provider</H2>
			    <Box display="flex" justifyContent="space-between">	  
				  <Select name="dnsProvider" value="dnsProvider">
				    ${providerOptions}
                  </Select>
                  <Button action="${action}">Verify Now</Button>
                </Box>
			</Page>
		`;
    } else if (payload.action === "configure") {
        const provider: string = payload.clientState.dnsProvider;
        // @ts-ignore
        const providerView = views[provider](metadata.providers[provider]);
        return htm`
        <Page>
          ${providerView}
        </Page>
        `;
    } else {
        const availableProviders = Object.entries(providers).map(([key, value]) => ({key, name: value.name}));
        const providerOptions = availableProviders.map(providerOption);
        return htm`
		<Page>
			<H1>Verify Domains</H1>
			${domainBoxes}
			<H1>Configuration</H1>
			<H2>Choose DNS Provider to configure</H2>
            <Box display="flex" justifyContent="space-between">	  
			  <Select name="dnsProvider" value="route53">
			    ${providerOptions}
               </Select>
               <Button action="configure">Configure</Button>
             </Box>
		</Page>
	`;
    }
});
