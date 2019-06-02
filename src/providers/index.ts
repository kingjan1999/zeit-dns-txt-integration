import * as clouddns from "./clouddns";
import * as digitalocean from "./digitalocean";
import * as godaddy from "./godaddy";
import * as route53 from "./route53";

export default {
  clouddns: {
    name: "Google Cloud DNS",
    provider: clouddns,
  },
  digitalocean: {
    name: "DigitalOcean",
    provider: digitalocean,
  },
  godaddy: {
    name: "GoDaddy",
    provider: godaddy,
  },
  route53: {
    name: "Route 53",
    provider: route53,
  },
};
