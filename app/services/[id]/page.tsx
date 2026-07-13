import ServiceDetail from "@/components/service-detail-page"

const SERVICE_IDS = [
  "life-insurance",
  "pension-fund-individuals",
  "pension-fund-groups",
  "medical-aid",
  "short-term-insurance",
  "retirement-annuity",
  "savings-investment",
  "wills-estates",
]

export function generateStaticParams() {
  return SERVICE_IDS.map((id) => ({ id }))
}

export default function ServicePage({ params }: { params: { id: string } }) {
  return <ServiceDetail id={params.id} />
}
