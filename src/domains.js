const axios = require("axios");

const zeitApiInstance = axios.create({
    baseURL: "https://api.zeit.co"
});

export const fetchUnverifiedDomains = async (zeitToken) => {
    const result = await zeitApiInstance.get("/v4/domains", {
        headers: {
            Authorization: `Bearer ${zeitToken}`
        }
    });
    const domains = result.data.domains;
    return domains.filter(x => !x.verified);
};