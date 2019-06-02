import axios from "axios";

const getAxiosInstance = (token: string) => {
  return axios.create({
    baseURL: "https://api.digitalocean.com/v2/",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const setVerifyAndAlias = async (
  domain: string,
  token: string,
  metadata: DigitalOceanMetadata,
  options: RecordOptions
) => {
  const axiosInstance = getAxiosInstance(metadata.API_KEY);

  // verify record
  const verifyRecord = {
    data: token,
    name: "_now",
    ttl: options.ttl,
    type: "TXT"
  };

  const verifyResult = await axiosInstance.post(
    `/domains/${domain}/records`,
    verifyRecord
  );

  // alias record
  const aliasRecord = {
    data: "alias.zeit.co.",
    name: options.aliasDomain,
    ttl: options.ttl,
    type: "CNAME"
  };

  const aliasResult = await axiosInstance.post(
    `/domains/${domain}/records`,
    aliasRecord
  );

  return [verifyResult, aliasResult];
};
