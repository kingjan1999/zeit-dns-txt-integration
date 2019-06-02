import { htm } from "@zeit/integration-utils";

interface ErrorscreenProps {
  error: Error;
}

export default ({error}: ErrorscreenProps) => {
  return htm`
  <Page>
    <Box>
      <Notice type="error">Error: ${JSON.stringify(error.message || error)}</Notice>
      <Button action="view">Go Back</Button>
    </Box>
  </Page>  
    `;
};
