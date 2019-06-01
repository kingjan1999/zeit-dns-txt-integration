import { google, dns_v2beta1, dns_v1 } from "googleapis";

const getDNSInstance = (metadata: GCPMetadata) => {
  const parsedKeyFile = JSON.parse(metadata.GCE_SERVICE_ACCOUNT_FILE);
  const auth = new google.auth.JWT(
    parsedKeyFile.client_email,
    undefined,
    parsedKeyFile.private_key,
    ["https://www.googleapis.com/auth/cloud-platform"]
  );

  const dns = google.dns({
    version: "v1",
    auth
  });
  return dns;
};

const getZoneForDomain = async (dns: dns_v1.Dns, domain: string) => {
  const zones = await dns.managedZones.list();

  const zone = (zones.data.managedZones || []).find(
    (x: any) => x.name === domain
  );
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

  const result = await dns.changes.create({
    managedZone: zone.id,
    requestBody: {
      kind: "dns#change",
      additions: [
        {
          name: `_now.${domain}.`,
          ttl: 3600,
          rrdatas: [`"${token}"`],
          type: "TXT"
        },
        {
          name: `now.${domain}.`,
          ttl: 3600,
          rrdatas: ["alias.zeit.co"],
          type: "CNAME"
        }
      ]
    }
  });

  console.log(result);

  return result;
};
