import { LegalPage, legalMetadata } from "@/components/LegalPage";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props) {
  return legalMetadata("cookies", (await params).lang);
}

export default async function CookiesPage({ params }: Props) {
  return <LegalPage k="cookies" lang={(await params).lang} />;
}
