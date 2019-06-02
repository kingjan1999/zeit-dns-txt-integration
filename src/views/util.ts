import { htm } from "@zeit/integration-utils";

export interface KeyName {
    key: string;
    name: string;
}

export const providerOption = (provider: KeyName) => {
  return htm`
        <Option value="${provider.key}" caption="${provider.name}" />
      `;
};
