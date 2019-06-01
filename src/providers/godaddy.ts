import axios from "axios";

export const setVerifyAndAlias = async (
    domain: string,
    token: string,
    metadata: GoDaddyMetadata
) => {
    const records = [
        {
            data: `"${token}"`,
            name: `_now.${domain}`,
            ttl: 3600,
            type: 'TXT'
        }, {
            data: 'alias.zeit.co',
            name: `_now.${domain}`,
            ttl: 3600,
            type: 'CNAME'
        }
    ];
    const result = await axios.patch(`https://api.godaddy.com/v1/domains/${domain}/records`, records, {
        headers: {
            Authorization: `sso-key ${metadata.API_KEY}:${metadata.API_SECRET}`
        }
    });
    return result;
};