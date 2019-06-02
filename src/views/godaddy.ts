import { htm } from "@zeit/integration-utils";

export default (metadata: GoDaddyMetadata) => {
  return htm`
      <Box>
        <P>
          You can create a new key / secret pair
          <Link href="https://developer.godaddy.com/keys" target="_blank">here</Link>.
          Please make sure to select the production environment.
        </P>
        <Fieldset>
          <FsContent>
            <FsTitle>GoDaddy API Key</FsTitle>
            <Input width="100%" name="API_KEY" value=${metadata.API_KEY || ""} />
          </FsContent>
        </Fieldset>
        <Fieldset>
          <FsContent>
            <FsTitle>GoDaddy API Secret</FsTitle>
            <Input width="100%" type="password" name="API_SECRET" value=${metadata.API_SECRET ||
              ""} />
          </FsContent>
        </Fieldset>
        <Box display="flex" justifyContent="space-around">
          <Button action="save-godaddy">Save</Button>
          <Button action="view">Go back</Button>
        </Box>
      </Box>
    `;
};
