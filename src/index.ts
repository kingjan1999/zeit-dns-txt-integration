import { htm, withUiHook } from "@zeit/integration-utils";
import merge from "deepmerge";

import providers from "./providers";
import views from "./views";

import fakeDomains from "../test/fakeDomains.json";
import { fetchUnverifiedDomains } from "./domains";
import errorscreen from "./views/errorscreen";

const domainItem = (domain: ZEITDomain) => {
  const action = `verify-${domain.id}`;
  return htm`
	  <Box display="flex" justifyContent="space-between" margin="10px">
	    ${domain.name}
	    <Button action="${action}">Verify Now</Button>
      </Box>
	`;
};

const providerOption = (provider: { key: string; name: string }) => {
  return htm`
      <Option value="${provider.key}" caption="${provider.name}" />
    `;
};

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  console.log("Received Payload:");
  console.log(payload);

  // const domains = fakeDomains.domains.filter(x => !x.verified);
  const domains = await fetchUnverifiedDomains(payload.token);
  const domainBoxes = domains.map(domainItem);

  let successMessage = "";

  const defaultMetadata = {
    providers: {
      route53: { AWS_SECRET_ACCESS_KEY: "", AWS_ACCESS_KEY_ID: "" },
      clouddns: { GCE_PROJECT: "", GCE_SERVICE_ACCOUNT_FILE: "" },
      godaddy: {}
    }
  };

  let metadata = await zeitClient.getMetadata();
  console.log(metadata);

  // copy default data
  metadata = merge(defaultMetadata, metadata);

  try {
    if (payload.action.startsWith("verify")) {
      // XXX: It's 0 + 7 = 7, isn't it?
      const domainId = payload.action.substr(
        payload.action.indexOf("verify-") + "verify-".length
      );
      const domain = domains.find((x: ZEITDomain) => x.id === domainId);
      if (!domain) {
        return; // TODO: error message
      }

      const configuredProviders = metadata.providers;
      console.log(Object.keys(configuredProviders));
      console.log(providers);
      const providerDescriptions = Object.keys(configuredProviders).map(
        // @ts-ignore
        (key: SupportedProviders) => ({
          key,
          name: providers[key].name
        })
      );
      const providerOptions = providerDescriptions.map(providerOption);
      const action = `do-verify-${domainId}`;
      return htm`
			<Page>
				<H1>Verify ${domain.name}</H1>
				<H2>Choose your DNS provider</H2>
			  <Box display="flex" justifyContent="space-between">	  
				  <Select name="dnsProvider" value="route53">
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
    } else if (payload.action.startsWith("save-")) {
      const provider = payload.action.substr("save-".length);
      if(provider === 'clouddns' && payload.clientState.GCE_SERVICE_ACCOUNT_FILE) {
          const fileContents = payload.clientState.GCE_SERVICE_ACCOUNT_FILE;
          try {
              const parsed = JSON.parse(fileContents);
              console.log(parsed);
              payload.clientState.GCE_SERVICE_ACCOUNT_FILE = JSON.stringify(parsed);
              payload.clientState.GCE_PROJECT = parsed.project_id;
          }
          catch(e) {
              throw new Error("The provided json file doesn't even look valid.");
          }
      }
      metadata.providers[provider] = payload.clientState;
      await zeitClient.setMetadata(metadata);
      successMessage = "Your configuration has been updated!";
    } else if (payload.action.startsWith("do-verify")) {
      const provider: SupportedProviders = payload.clientState.dnsProvider;
      const domainId = payload.action.substr(
        payload.action.indexOf("do-verify-") + "do-verify-".length
      );
      const domain = domains.find((x: ZEITDomain) => x.id === domainId);
      if (!domain) {
        console.log("error! domain not found " + domainId);
        return; // TODO: error message
      }

      await providers[provider].provider.setVerifyAndAlias(
        domain.name,
        domain.verificationRecord,
        metadata.providers[provider]
      );

      // TODO: Try verify via zeit

      successMessage = 'Your domain was configured successfully!';
    }
  } catch (e) {
    // FIXME: More specific error handling!
    console.log(e);
    return errorscreen(e);
  }

  const availableProviders = Object.entries(providers).map(([key, value]) => ({
    key,
    name: value.name
  }));
  const providerOptions = availableProviders.map(providerOption);
  let successBox = "";
  if (successMessage) {
    successBox = htm`
        <Box><Notice type="success">${successMessage}</Notice></Box>
      `;
  }
  return htm`
    <Page>
        ${successBox}
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
});
