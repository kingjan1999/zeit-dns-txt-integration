import { htm } from "@zeit/integration-utils";

export default (metadata: DigitalOceanMetadata) => {
    return htm`
      <Box>
        <Fieldset>
          <FsContent>
            <FsTitle>DigitalOcean API Key</FsTitle>
            <Input name="API_KEY" value=${metadata.API_KEY || ""} />
          </FsContent>
        </Fieldset>
        <Button action="save-digitalocean">Save</Button>
      </Box>
    `;
};
