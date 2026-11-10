import { LegalPage, legalMetadata } from "@/components/LegalPage";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return legalMetadata("terms", (await params).lang);
}

export default async function TermsPage({ params }: Props) {
  return <LegalPage k="terms" lang={(await params).lang} />;
}
