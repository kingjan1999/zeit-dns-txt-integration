const util = require("util");

const Route53 = require("nice-route53");

const getR53Instance = (metadata: AWSMetadata) => {
    return new Route53({
        accessKeyId: metadata.AWS_ACCESS_KEY_ID,
        secretAccessKey: metadata.AWS_SECRET_ACCESS_KEY
    });
};

const getZoneForDomain = async (r53: any, domain: string) => {
    const zones = await util.promisify(r53.zones)();
    const zone = zones.find((x: any) => x.name === domain);
    if (!zone) {
        throw new Error(`No zone found for domain ${domain}`);
    }

    return zone;
};

export const setVerify = async (domain: string, token: string, metadata: AWSMetadata) => {
    const r53 = getR53Instance(metadata);

    const zone = await getZoneForDomain(r53, domain);

    const result = await util.promisify(r53.setRecord)({
        zoneId: zone.zoneId,
        name: `_now.${domain}`,
        type: "TXT",
        ttl: 3600, // TODO Configurable?
        values: [token]
    });

    console.log(result);

    return result;
};

export const setAlias = async (domain: string, metadata: AWSMetadata) => {
    const r53 = getR53Instance(metadata);

    const zone = await getZoneForDomain(r53, domain);

    const result = await util.promisify(r53.setRecord)({
        zoneId: zone.zoneId,
        name: 'now', // TODO Configurable?
        type: "CNAME",
        ttl: 3600, // TODO Configurable?
        values: ["alias.zeit.co"]
    });

    console.log(result);

    return result;
};