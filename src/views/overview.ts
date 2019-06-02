import { htm } from "@zeit/integration-utils";
import { providerOption, KeyName } from "./util";

const domainItem = (domain: ZEITDomain) => {
  const action = `verify-${domain.id}`;
  return htm`
        <Box display="flex" justifyContent="space-between" margin="10px">
          ${domain.name}
          <Button action="${action}">Verify Now</Button>
        </Box>
      `;
};

interface OverviewProps {
  successMessage: string;
  domains: ZEITDomain[];
  availableProviders: KeyName[];
}

export default ({
  successMessage,
  domains,
  availableProviders
}: OverviewProps) => {
  let successBox = "";
  if (successMessage) {
    successBox = htm`
          <Box><Notice type="success">${successMessage}</Notice></Box>
        `;
  }

  const providerOptions = availableProviders.map(providerOption);
  const domainBoxes = domains.map(domainItem);

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
};
