import { htm } from "@zeit/integration-utils";

export default (metadata: GCPMetadata) => {
  let currentValue = metadata.GCE_SERVICE_ACCOUNT_FILE || "";

  return htm`
      <Box>
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
        <Button action="save-clouddns">Save</Button>
      </Box>
    `;
};
