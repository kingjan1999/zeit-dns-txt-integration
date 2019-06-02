import { htm } from "@zeit/integration-utils";

interface IErrorscreenProps {
  error: Error;
}

export default ({error}: IErrorscreenProps) => {
  return htm`
  <Page>
    <Box>
      <Notice type="error">Error: ${JSON.stringify(error.message || error)}</Notice>
      <Button action="view">Go Back</Button>
    </Box>
  </Page>
    `;
};
