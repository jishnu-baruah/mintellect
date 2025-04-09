export const ocidConfig = {
  opts: {
    redirectUri: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.mintellect.xyz'}/redirect`,
    referralCode: "PARTNER6",
    clientId: process.env.NEXT_PUBLIC_OCID_CLIENT_ID,
    domain: process.env.NEXT_PUBLIC_OCID_DOMAIN || 'opencampus',
  }
}
