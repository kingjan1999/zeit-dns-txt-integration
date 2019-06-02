import { htm } from "@zeit/integration-utils";

export interface IKeyName {
    key: string;
    name: string;
}

export const providerOption = (provider: IKeyName) => {
  return htm`
        <Option value="${provider.key}" caption="${provider.name}" />
      `;
};
