const util = require("util");

const Route53 = require("nice-route53");

export default async (domain, token, metadata) => {
    const r53 = new Route53({
        accessKeyId: metadata.AWS_ACCESS_KEY_ID,
        secretAccessKey: metadata.AWS_SECRET_ACCESS_KEY
    });

    const zones = await util.promisify(r53.zones)();
    const zone = zones.find(x => x.name === domain);
    if(!zone) {
        throw new Error(`No zone found for domain ${domain}`);
    }

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