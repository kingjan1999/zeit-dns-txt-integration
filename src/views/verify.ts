import { htm } from "@zeit/integration-utils";
import { KeyName, providerOption } from "./util";

interface VerifyProps {
  domain: ZEITDomain;
  providerDescriptions: KeyName[];
}

export default ({ domain, providerDescriptions }: VerifyProps) => {
  const action = `do-verify-${domain.id}`;
  const providerOptions = providerDescriptions.map(providerOption);

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
};
