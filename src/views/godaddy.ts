import { htm } from "@zeit/integration-utils";

export default (metadata: GoDaddyMetadata) => {
    return htm`
      <Box>
        <Fieldset>
          <FsContent>
            <FsTitle>GoDaddy API Key</FsTitle>
            <Input name="API_KEY" value=${metadata.API_KEY || ""} />
          </FsContent>
        </Fieldset>
        <Fieldset>
          <FsContent>
            <FsTitle>GoDaddy API Secret</FsTitle>
            <Input name="API_SECRET" value=${metadata.API_SECRET || ""} />
          </FsContent>
        </Fieldset>
        <Button action="save-godaddy">Save</Button>
      </Box>
    `
}
