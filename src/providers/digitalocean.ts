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
  metadata: DigitalOceanMetadata
) => {
  const axiosInstance = getAxiosInstance(metadata.API_KEY);

  // verify record
  const verifyRecord = {
    data: token,
    name: "_now",
    ttl: 3600,
    type: "TXT"
  };

  const verifyResult = await axiosInstance.post(
    `/domains/${domain}/records`,
    verifyRecord
  );

  // alias record
  const aliasRecord = {
    data: "alias.zeit.co.",
    name: "now",
    ttl: 3600,
    type: "CNAME"
  };

  const aliasResult = await axiosInstance.post(
    `/domains/${domain}/records`,
    aliasRecord
  );

  return [verifyResult, aliasResult];
};
