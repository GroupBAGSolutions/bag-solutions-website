import { LegalPage, legalMetadata } from "@/components/LegalPage";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return legalMetadata("privacy", (await params).lang);
}

export default async function PrivacyPage({ params }: Props) {
  return <LegalPage k="privacy" lang={(await params).lang} />;
}
