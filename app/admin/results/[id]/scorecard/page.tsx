import ScorecardAdminClient from "./ScorecardAdminClient";

export default async function ScorecardAdminPage({ params }: any) {
  const { id } = await params; // NextJS 16 params is a Promise
  return <ScorecardAdminClient matchId={id} />;
}
