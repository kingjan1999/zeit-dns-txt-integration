const route53 = require("./route53");
const clouddns = require("./clouddns");

export default {
    route53: {
        name: "Route 53",
        provider: route53
    },
    clouddns: {
        name: "Google Cloud DNS",
        provider: clouddns
    }
};
