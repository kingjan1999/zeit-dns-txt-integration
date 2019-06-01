import { htm } from "@zeit/integration-utils";

export default (errorMessage: string) => {
  return htm`
  <Page>
    <Box>
      <Notice type="error">Error: ${JSON.stringify(errorMessage)}</Notice>
      <Button action="view">Try again</Button>
    </Box>
  </Page>  
    `;
};
