import { htm } from "@zeit/integration-utils";

export default (metadata: AWSMetadata) => {
  return htm`
      <Box>
        <P>Please
        <Link href="https://console.aws.amazon.com/iam/home" target="_blank">
          create a new IAM user
        </Link>
        with the rights to manage Route 53
        zones and paste the Access Key and Secret Key below.</P>
        <Fieldset>
          <FsContent>
            <FsTitle>AWS Access Key</FsTitle>
            <Input width="100%" name="AWS_ACCESS_KEY_ID" value=${metadata.AWS_ACCESS_KEY_ID ||
              ""} />
          </FsContent>
        </Fieldset>
        <Fieldset>
          <FsContent>
            <FsTitle>AWS Secret Key</FsTitle>
            <Input width="100%" type="password" name="AWS_SECRET_ACCESS_KEY" value=${metadata.AWS_SECRET_ACCESS_KEY ||
              ""} />
          </FsContent>
        </Fieldset>
        <Box display="flex" justifyContent="space-around">
          <Button action="save-route53">Save</Button>
          <Button action="view">Go back</Button>
        </Box>
      </Box>
    `;
};
