import { ActionBar } from "@/components/public/ActionBar";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/sections";
import { Tracker } from "@/components/public/Tracker";
import { getSiteData } from "@/lib/db/queries";

// 정적 생성. 어드민 저장 시 revalidatePath("/", "layout")로 다시 생성된다 (A8).
export const dynamic = "force-static";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const { store } = await getSiteData();
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer store={store} />
      <ActionBar store={store} />
      <Tracker />
    </>
  );
}
