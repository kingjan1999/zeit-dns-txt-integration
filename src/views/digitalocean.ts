import { htm } from "@zeit/integration-utils";

export default (metadata: DigitalOceanMetadata) => {
  return htm`
      <Box>
        <Fieldset>
          <FsContent>
            <FsTitle>Personal access token</FsTitle>
            <Input width="100%" name="API_KEY" value=${metadata.API_KEY || ""} />
          </FsContent>
          <FsFooter>
            <P>You can get it
              <Link href="https://cloud.digitalocean.com/account/api/tokens" target="_blank">here</Link></P>
          </FsFooter>
        </Fieldset>

        <Box display="flex" justifyContent="space-around">
          <Button action="save-digitalocean">Save</Button>
          <Button action="view">Go back</Button>
        </Box>
      </Box>
    `;
};
