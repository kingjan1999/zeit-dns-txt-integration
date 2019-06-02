import axios from "axios";
import util from "util";

const zeitApiInstance = axios.create({
  baseURL: "https://api.zeit.co"
});

export const fetchUnverifiedDomains = async (
  zeitToken: string
): Promise<ZEITDomain[]> => {
  const result = await zeitApiInstance.get("/v4/domains", {
    headers: {
      Authorization: `Bearer ${zeitToken}`
    }
  });
  const domains = result.data.domains;
  return domains.filter((x: ZEITDomain) => !x.verified);
};

export const tryVerify = async (zeitToken: string, domain: string) => {
  try {
    const result = await zeitApiInstance.post(
      `/v4/domains/${domain}/verify`,
      {},
      {
        headers: {
          Authorization: `Bearer ${zeitToken}`
        }
      }
    );
  } catch (e) {
    // This means that the domain could not be verified yet
    // This can happen as the dns records can take some time to propagate
    // We will just let the user handle the verification then
    return false;
  }
  return true;
};
