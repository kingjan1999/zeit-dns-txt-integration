import { htm } from "@zeit/integration-utils";
import { IKeyName, providerOption } from "./util";

interface IVerifyProps {
  domain: ZEITDomain;
  providerDescriptions: IKeyName[];
}

export default ({ domain, providerDescriptions }: IVerifyProps) => {
  const action = `do-verify-${domain.id}`;
  const providerOptions = providerDescriptions.map(providerOption);

  return htm`
    <Page>
        <H1>Verify ${domain.name}</H1>
        <H2>Choose your DNS provider</H2>
        <Box display="flex" justifyContent="space-between" marginBottom="20px">
          <Select name="dnsProvider" value="route53">
            ${providerOptions}
          </Select>
          <Button action="${action}">Verify Now</Button>
        </Box>
        <H2>Optional settings</H2>
        <Box display="flex" marginTop="20px" justifyContent="space-between" marginTop="">
          <Input type="number" label="TTL of the records" value="3600" name="TTL"  />
          <Input type="text" label="(Sub)domain to alias" value="now"  name="subdomain" /> 
        </Box>
    </Page>
`;
};
