import punycode from "punycode";

const doAsync = require("doasync");
const Route53 = require("nice-route53");

const getR53Instance = (metadata: AWSMetadata) => {
  return new Route53({
    accessKeyId: metadata.AWS_ACCESS_KEY_ID,
    secretAccessKey: metadata.AWS_SECRET_ACCESS_KEY
  });
};

const getZoneForDomain = async (r53: any, domain: string) => {
  const zones = await doAsync(r53.zones).call(r53);
  console.log(zones);
  const zone = zones.find(
    (x: any) => x.name === domain || x.name === punycode.toUnicode(domain)
  );
  if (!zone) {
    throw new Error(`No zone found for domain ${domain}`);
  }

  return zone;
};

export const setVerifyAndAlias = async (
  domain: string,
  token: string,
  metadata: AWSMetadata,
  options: RecordOptions
) => {
  const r53 = getR53Instance(metadata);

  const zone = await getZoneForDomain(r53, domain);
  console.log(zone);
  const resultVerify = await new Promise((resolve, reject) => {
    r53.setRecord(
      {
        name: `_now.${domain}.`,
        ttl: options.ttl,
        type: "TXT",
        values: [`"${token}"`],
        zoneId: zone.zoneId
      },
      (err: any, result: any) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });

  console.log(resultVerify);

  const resultAlias = await new Promise((resolve, reject) => {
    r53.setRecord(
      {
        name: `${options.aliasDomain}${
          options.aliasDomain ? "." : ""
        }${domain}.`, 
        ttl: options.ttl, 
        type: "CNAME",
        values: ["alias.zeit.co"],
        zoneId: zone.zoneId
      },
      (err: any, result: any) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });

  console.log(resultAlias);

  return [resultVerify, resultAlias];
};
