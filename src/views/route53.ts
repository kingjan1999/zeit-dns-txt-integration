import { htm } from "@zeit/integration-utils";

export default (metadata: AWSMetadata) => {
  return htm`
      <Box>
        <Fieldset>
          <FsContent>
            <FsTitle>AWS Access Key</FsTitle>
            <Input name="AWS_ACCESS_KEY_ID" value=${metadata.AWS_ACCESS_KEY_ID || ""} />
          </FsContent>
        </Fieldset>
        <Fieldset>
          <FsContent>
            <FsTitle>AWS Secret Key</FsTitle>
            <Input name="AWS_SECRET_ACCESS_KEY" value=${metadata.AWS_SECRET_ACCESS_KEY || ""} />
          </FsContent>
        </Fieldset>
        <Button action="save-route53">Save</Button>
      </Box>
    `;
};
