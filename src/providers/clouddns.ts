import { DNS, Zone } from "@google-cloud/dns";

const {google} = require('googleapis');
var dns = google.dns('v1');

const getDNSInstance = (metadata: GCPMetadata) => {
  const parsedKeyFile = JSON.parse(metadata.GCE_SERVICE_ACCOUNT_FILE);
  
  const dns = new DNS({
    credentials: {
      client_email: parsedKeyFile.client_email,
      private_key: parsedKeyFile.private_key
    },
    projectId: metadata.GCE_PROJECT
  });
  return dns;
};

const getZoneForDomain = async (dns: DNS, domain: string): Promise<Zone> => {
  const zones = await dns.getZones();
  dns.getZones({})
  const zone = zones.find((x: any) => x.name === domain);
  console.log("found: ");
  console.log(zones);
  if (!zone) {
    throw new Error(`No zone found for domain ${domain}`);
  }

  return zone;
};

export const setVerifyAndAlias = async (
  domain: string,
  token: string,
  metadata: GCPMetadata
) => {
  const dns = getDNSInstance(metadata);
  const zone = await getZoneForDomain(dns, domain);

  const result = await zone.addRecords([
    zone.record("TXT", {
      name: `_now.${domain}.`,
      data: [token],
      ttl: 3600 // TODO Configurable?
    }),
    zone.record("TXT", {
      name: `now.${domain}.`,
      data: ["alias.zeit.co"],
      ttl: 3600 // TODO Configurable?
    })
  ]);
  console.log(result);

  return result;
};
