import axios from "axios";

const zeitApiInstance = axios.create({
    baseURL: "https://api.zeit.co"
});

export const fetchUnverifiedDomains = async (zeitToken: string): Promise<ZEITDomain[]> => {
    const result = await zeitApiInstance.get("/v4/domains", {
        headers: {
            Authorization: `Bearer ${zeitToken}`
        }
    });
    const domains = result.data.domains;
    return domains.filter((x: ZEITDomain) => !x.verified);
};
