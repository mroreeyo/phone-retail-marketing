"use client";

import { useActionState } from "react";
import { inputCls, labelCls } from "@/components/admin/styles";
import { signIn } from "@/lib/db/mutations";

export default function LoginPage() {
  const [error, action, pending] = useActionState(signIn, null);

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-3xl">두꺼비통신 관리</h1>
      <p className="mt-2 text-sub">초대받은 운영자 계정으로 로그인하세요.</p>
      <form action={action} className="mt-8 grid gap-5">
        <label className="grid gap-2">
          <span className={labelCls}>이메일</span>
          <input name="email" type="email" autoComplete="email" required className={inputCls} />
        </label>
        <label className="grid gap-2">
          <span className={labelCls}>비밀번호</span>
          <input name="password" type="password" autoComplete="current-password" required className={inputCls} />
        </label>
        {error && (
          <p role="alert" className="font-bold text-hot">
            {error}
          </p>
        )}
        <button
          disabled={pending}
          className="min-h-14 rounded-2xl bg-brown text-lg font-bold text-paper active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </main>
  );
}
