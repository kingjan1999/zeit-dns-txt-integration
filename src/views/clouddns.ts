import { htm } from "@zeit/integration-utils";

const {ROOT_URL} = process.env;

export default (metadata: GCPMetadata, installationUrl: string) => {
  const currentValue = metadata.GCE_SERVICE_ACCOUNT_FILE || "";
  const connectUrl = `${ROOT_URL}/connect-with-google?next=${encodeURIComponent(installationUrl)}`;

  // TODO: integrate oauth:
  // This is already prepared, the app just needs to be submitted
  // <Link href=${connectUrl}>Connect With Google</Link>

  return htm`
      <Box>
        <P>
          <Link target="_blank" href="https://console.cloud.google.com/apis/credentials/serviceaccountkey">
            Create a service account key
          </Link>
          on Google Cloud Platform and paste the key JSON below.
          Make sure the service account has the rights to update dns records.
        </P>
        <Fieldset>
          <FsContent>
            <FsTitle>Key File Contents</FsTitle>
            <Textarea placeholder=${`{
                ”type”: ”service_account”,
                ...
              }`}
             width="320px" name="GCE_SERVICE_ACCOUNT_FILE" value=${currentValue} />
          </FsContent>
        </Fieldset>
        <Box display="flex" justifyContent="space-around">
          <Button action="save-clouddns">Save</Button>
          <Button action="view">Go back</Button>
        </Box>
      </Box>
    `;
};
