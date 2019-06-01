// domain type form zeit api
declare interface ZEITDomain {
    id: string;
    name: string;
    serviceType: string;
    nsVerifiedAt?: Number | null;
    txtVerifiedAt?: Number | null;
    cdnEnabled: Boolean;
    createdAt: Number;
    expiresAt: Number | null;
    boughtAt: Number | null;
    verificationRecord: string;
    verified: Boolean;
    nameservers: string[];
    intendedNameservers: string[];
    creator: {
        id: string;
        username: string;
        email: string;
    }
}


declare interface AWSMetadata {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
}
