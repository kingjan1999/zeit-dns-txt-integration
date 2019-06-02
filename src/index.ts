import { htm, withUiHook } from "@zeit/integration-utils";
import merge from "deepmerge";

import providers from "./providers";
import views from "./views";

// import fakeDomains from "../test/fakeDomains.json";
import { fetchUnverifiedDomains, tryVerify } from "./domains";
import Errorscreen from "./views/errorscreen";
import Overview from "./views/overview";
import Verify from "./views/verify";

module.exports = withUiHook(async ({ payload, zeitClient }) => {
  console.log("Received Payload:");
  console.log(payload);

  // const domains = fakeDomains.domains.filter(x => !x.verified);
  const domains = await fetchUnverifiedDomains(payload.token);

  let successMessage = "";

  const defaultMetadata: ZEITMetadata = {
    providers: {
      clouddns: {
        GCE_PROJECT: "",
        GCE_SERVICE_ACCOUNT_FILE: "",
        GOOGLE_TOKEN: ""
      },
      digitalocean: { API_KEY: "" },
      godaddy: { API_KEY: "", API_SECRET: "" },
      route53: { AWS_SECRET_ACCESS_KEY: "", AWS_ACCESS_KEY_ID: "" }
    }
  };

  let metadata = (await zeitClient.getMetadata()) as ZEITMetadata;

  // copy default data
  metadata = merge(defaultMetadata, metadata);

  if (payload.query && payload.query.google_code) {
    // save result to metadata
    metadata.providers.clouddns.GOOGLE_TOKEN = payload.query
      .google_code as string;
    await zeitClient.setMetadata(metadata);
  }

  try {
    if (payload.action.startsWith("verify")) {
      // XXX: It's 0 + 7 = 7, isn't it?
      const domainId = payload.action.substr(
        payload.action.indexOf("verify-") + "verify-".length
      );
      const domain = domains.find((x: ZEITDomain) => x.id === domainId);
      if (!domain) {
        throw new Error("Could not find domain!");
      }

      const providerDescriptions = Object.entries(metadata.providers)
        .filter(([_, value]) => {
          return Object.values(value).some(y => !!y);
        })
        // @ts-ignore
        .map(([key, _]) => ({ key, name: providers[key].name }));

      return htm`
			<${Verify} domain=${domain} providerDescriptions=${providerDescriptions} />
		`;
    } else if (payload.action === "configure") {
      const provider: SupportedProvider = payload.clientState.dnsProvider;
      // we need the second parameter for cloud dns
      const providerView = views[provider](
        // @ts-ignore
        metadata.providers[provider],
        payload.installationUrl
      );
      return htm`
        <Page>
          ${providerView}
        </Page>
        `;
    } else if (payload.action.startsWith("save-")) {
      const provider = payload.action.substr(
        "save-".length
      ) as SupportedProvider;
      if (
        provider === "clouddns" &&
        payload.clientState.GCE_SERVICE_ACCOUNT_FILE
      ) {
        const fileContents = payload.clientState.GCE_SERVICE_ACCOUNT_FILE;
        try {
          const parsed = JSON.parse(fileContents);
          console.log(parsed);
          payload.clientState.GCE_SERVICE_ACCOUNT_FILE = JSON.stringify(parsed);
          payload.clientState.GCE_PROJECT = parsed.project_id;
        } catch (e) {
          throw new Error("The provided json file doesn't even look valid.");
        }
      }
      metadata.providers[provider] = payload.clientState;
      await zeitClient.setMetadata(metadata);
      successMessage = "Your configuration has been updated!";
    } else if (payload.action.startsWith("do-verify")) {
      const provider: SupportedProvider = payload.clientState.dnsProvider;
      const domainId = payload.action.substr(
        payload.action.indexOf("do-verify-") + "do-verify-".length
      );
      const domain = domains.find((x: ZEITDomain) => x.id === domainId);
      if (!domain) {
        console.log("error! domain not found " + domainId);
        throw new Error("Domain not found (anymore)!");
      }

      await providers[provider].provider.setVerifyAndAlias(
        domain.name,
        domain.verificationRecord,
        // @ts-ignore
        metadata.providers[provider],
        {
          aliasDomain: payload.clientState.subdomain,
          ttl: !isNaN(payload.clientState.TTL)
            ? parseInt(payload.clientState.TTL)
            : 3600
        }
      );

      successMessage = "Your domain was configured successfully!";

      // trigger verify
      if (await tryVerify(payload.token, domain.name)) {
        successMessage +=
          "\n Your domain has already been verified by zeit as well.";
      }
      // no else here: The records haven't propagated yet, just wait
      // We COULD queue it here, but Zeit will do it as well so need for this
    }
  } catch (e) {
    // FIXME: More specific error handling!
    console.log(e);
    return htm`<${Errorscreen} error=${e} />`;
  }

  const availableProviders = Object.entries(providers).map(([key, value]) => ({
    key,
    name: value.name
  }));

  return htm`
    <${Overview} successMessage=${successMessage} domains=${domains} availableProviders=${availableProviders} />
  `;
});
