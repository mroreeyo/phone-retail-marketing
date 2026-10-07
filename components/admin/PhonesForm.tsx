"use client";

import { ArrowDownIcon, ArrowUpIcon, CameraIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { compressImage } from "@/lib/compress-image";
import { savePhones, type PhoneInput } from "@/lib/db/mutations";
import type { Phone, PriceMode } from "@/lib/db/types";
import { phoneImageUrl } from "@/lib/links";
import { createClient } from "@/lib/supabase/browser";
import { SaveBar } from "./SaveBar";
import { cardCls, helpCls, inputCls, labelCls, smallBtn } from "./styles";
import { useDraft } from "./useDraft";

type Item = PhoneInput & { _key: string };
type Draft = { priceMode: PriceMode; items: Item[]; deleted: { id: string; image_path: string | null }[] };

const toItem = ({ id, category, name, summary, price_text, image_path, hidden }: Phone): Item => ({
  _key: id,
  id,
  category,
  name,
  summary,
  price_text,
  image_path,
  hidden,
});

export function PhonesForm({ phones, priceMode }: { phones: Phone[]; priceMode: PriceMode }) {
  const { draft, setDraft, dirty, commit } = useDraft<Draft>({ priceMode, items: phones.map(toItem), deleted: [] });
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const update = (key: string, patch: Partial<Item>) =>
    setDraft((d) => ({ ...d, items: d.items.map((it) => (it._key === key ? { ...it, ...patch } : it)) }));

  const move = (i: number, dir: -1 | 1) =>
    setDraft((d) => {
      const items = [...d.items];
      [items[i], items[i + dir]] = [items[i + dir], items[i]];
      return { ...d, items };
    });

  const remove = (it: Item) => {
    if (!confirm(`"${it.name || "새 추천폰"}"을(를) 삭제할까요? 저장하면 되돌릴 수 없습니다.`)) return;
    setDraft((d) => ({
      ...d,
      items: d.items.filter((x) => x._key !== it._key),
      deleted: it.id ? [...d.deleted, { id: it.id, image_path: it.image_path }] : d.deleted,
    }));
  };

  const add = () =>
    setDraft((d) => ({
      ...d,
      items: [
        ...d.items,
        { _key: crypto.randomUUID(), category: "", name: "", summary: "", price_text: "", image_path: null, hidden: false },
      ],
    }));

  async function upload(key: string, file: File) {
    setUploading(key);
    setUploadError(null);
    try {
      const blob = await compressImage(file);
      const path = `${crypto.randomUUID()}.webp`;
      const { error } = await createClient().storage.from("phones").upload(path, blob, { contentType: "image/webp" });
      if (error) throw error;
      // ponytail: 교체 전 사진은 저장소에 남는다. 용량이 문제 되면 저장 시 정리 목록에 추가.
      update(key, { image_path: path });
    } catch {
      setUploadError("사진을 올리지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setUploading(null);
    }
  }

  return (
    <main className="mx-auto grid max-w-2xl gap-6 px-4 pt-6 pb-48">
      <section className={`${cardCls} grid gap-3`}>
        <h2 className="text-xl font-bold">가격 표시 방식</h2>
        <p className={helpCls}>고객 화면의 [이번 주 추천폰]에서 가격을 어떻게 보여 줄지 정합니다.</p>
        {(
          [
            ["consult", "상담 유도형", "가격 대신 [오늘 가격 DM으로 받기] 버튼을 보여 줍니다."],
            ["public", "가격 공개형", "추천폰마다 입력한 가격을 보여 줍니다."],
          ] as const
        ).map(([value, label, desc]) => (
          <label key={value} className="flex min-h-12 items-start gap-3 rounded-2xl border-2 border-brown/20 p-3 has-checked:border-brown has-checked:bg-cream">
            <input
              type="radio"
              name="price_mode"
              checked={draft.priceMode === value}
              onChange={() => setDraft((d) => ({ ...d, priceMode: value }))}
              className="mt-1 size-6 accent-brown"
            />
            <span>
              <span className="block font-bold">{label}</span>
              <span className={helpCls}>{desc}</span>
            </span>
          </label>
        ))}
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-bold">추천폰 목록</h2>
        <p className={helpCls}>위에서부터 순서대로 고객 화면에 표시됩니다. 숨긴 추천폰은 고객에게 보이지 않습니다.</p>
        {uploadError && (
          <p role="alert" className="font-bold text-hot">
            {uploadError}
          </p>
        )}

        {draft.items.length === 0 && (
          <p className={`${cardCls} text-sub`}>
            아직 추천폰이 없습니다. 추천폰이 없으면 고객 화면에서 [이번 주 추천폰] 영역이 숨겨집니다.
          </p>
        )}

        {draft.items.map((it, i) => (
          <article key={it._key} className={`${cardCls} grid gap-4 ${it.hidden ? "opacity-70" : ""}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-auto font-bold">
                {i + 1}번째{it.hidden && " · 숨김"}
              </span>
              <button type="button" aria-label="위로" disabled={i === 0} onClick={() => move(i, -1)} className={smallBtn}>
                <ArrowUpIcon size="1.2em" weight="bold" aria-hidden />위로
              </button>
              <button
                type="button"
                aria-label="아래로"
                disabled={i === draft.items.length - 1}
                onClick={() => move(i, 1)}
                className={smallBtn}
              >
                <ArrowDownIcon size="1.2em" weight="bold" aria-hidden />아래로
              </button>
            </div>

            <div className="grid grid-cols-[6rem_1fr] gap-4">
              <label className="grid cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-brown/40 bg-paper aspect-[3/4]">
                {it.image_path ? (
                  <img src={phoneImageUrl(it.image_path)} alt={`${it.name} 사진`} className="size-full object-contain" />
                ) : (
                  <span className="grid place-items-center gap-1 text-sub">
                    <CameraIcon size="1.8em" aria-hidden />
                    {uploading === it._key ? "올리는 중" : "사진"}
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploading !== null}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(it._key, f);
                    e.target.value = "";
                  }}
                />
              </label>
              <div className="grid gap-3">
                <label className="grid gap-1">
                  <span className={labelCls}>분류</span>
                  <input
                    value={it.category}
                    placeholder="예: 학생 추천"
                    onChange={(e) => update(it._key, { category: e.target.value })}
                    className={inputCls}
                  />
                </label>
                <label className="grid gap-1">
                  <span className={labelCls}>기종명 (필수)</span>
                  <input
                    value={it.name}
                    required
                    onChange={(e) => update(it._key, { name: e.target.value })}
                    className={inputCls}
                  />
                </label>
              </div>
            </div>

            <label className="grid gap-1">
              <span className={labelCls}>한 줄 설명</span>
              <input value={it.summary} onChange={(e) => update(it._key, { summary: e.target.value })} className={inputCls} />
            </label>

            {draft.priceMode === "public" && (
              <label className="grid gap-1">
                <span className={labelCls}>표시 가격</span>
                <input
                  value={it.price_text}
                  placeholder="예: 기기값 0원 (조건 상담)"
                  onChange={(e) => update(it._key, { price_text: e.target.value })}
                  className={inputCls}
                />
                <span className={helpCls}>입력한 글자 그대로 빨간색으로 표시됩니다.</span>
              </label>
            )}

            <div className="flex flex-wrap gap-2">
              <label className="flex min-h-12 items-center gap-2 rounded-2xl border-2 border-brown/20 px-3">
                <input
                  type="checkbox"
                  checked={it.hidden}
                  onChange={(e) => update(it._key, { hidden: e.target.checked })}
                  className="size-6 accent-brown"
                />
                사이트에서 잠시 숨기기
              </label>
              {it.image_path && (
                <button type="button" onClick={() => update(it._key, { image_path: null })} className={smallBtn}>
                  사진 빼기
                </button>
              )}
              <button type="button" onClick={() => remove(it)} className={`${smallBtn} ml-auto border-hot text-hot`}>
                <TrashIcon size="1.2em" weight="bold" aria-hidden />
                삭제
              </button>
            </div>
          </article>
        ))}

        <button type="button" onClick={add} className={`${smallBtn} min-h-14 border-dashed bg-cream text-lg`}>
          <PlusIcon size="1.2em" weight="bold" aria-hidden />
          추천폰 추가
        </button>
      </section>

      <SaveBar
        dirty={dirty}
        onSave={() =>
          commit(async (v) => {
            const r = await savePhones(
              v.priceMode,
              v.items.map(({ _key, ...p }) => p),
              v.deleted,
            );
            return r.ok && r.phones ? { ...r, next: { priceMode: v.priceMode, items: r.phones.map(toItem), deleted: [] } } : r;
          })
        }
      />
    </main>
  );
}
