import axios from "axios";
import punycode from "punycode";

export const setVerifyAndAlias = async (
    domain: string,
    token: string,
    metadata: GoDaddyMetadata,
    options: RecordOptions
) => {
    const encodedDomain = encodeURIComponent(punycode.toUnicode(domain));
    const records = [
        {
            data: token,
            name: "_now",
            ttl: options.ttl,
            type: "TXT",
        }, {
            data: "alias.zeit.co",
            name: options.aliasDomain,
            ttl: options.ttl,
            type: "CNAME",
        },
    ];
    const result = await axios.patch(`https://api.godaddy.com/v1/domains/${encodedDomain}/records`, records, {
        headers: {
            "Authorization": `sso-key ${metadata.API_KEY}:${metadata.API_SECRET}`,
            "Content-Type": "application/json",
        },
    });
    return result;
};
