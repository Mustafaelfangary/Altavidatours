"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type WCItem = {
  key: string;
  title: string;
  content: string | null;
  contentType?: string | null;
  page?: string | null;
  section?: string | null;
  order?: number | null;
  isActive?: boolean | null;
};

async function fetchContent(page?: string, section?: string): Promise<WCItem[]> {
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (section) params.set("section", section);
  const res = await fetch(`/api/website-content?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

async function saveContent(item: Partial<WCItem> & { key: string; page: string; section: string }) {
  const res = await fetch("/api/website-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: item.key,
      title: item.title ?? item.key,
      content: item.content ?? "",
      contentType: item.contentType ?? "TEXT",
      page: item.page,
      section: item.section,
      order: item.order ?? 0,
    }),
  });
  if (!res.ok) throw new Error("Failed to save");
  return res.json();
}

function groupByPrefix(items: WCItem[], prefix: string) {
  const map: Record<string, WCItem[]> = {};
  items.forEach((it) => {
    if (!it.key.startsWith(prefix)) return;
    // entity id is part between prefix and next underscore
    // e.g., homepage_destination_<id>_title
    const rest = it.key.slice(prefix.length);
    const id = rest.split("_")[0];
    if (!map[id]) map[id] = [];
    map[id].push(it);
  });
  return map;
}

export default function MicrocopyManagerPage() {
  const [destItems, setDestItems] = useState<WCItem[]>([]);
  const [svcItems, setSvcItems] = useState<WCItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [dest, svc] = await Promise.all([
        fetchContent("homepage", "destinations"),
        fetchContent("homepage", "services"),
      ]);
      setDestItems(dest);
      setSvcItems(svc);
      setLoading(false);
    })();
  }, []);

  const destGroups = useMemo(() => groupByPrefix(destItems, "homepage_destination_"), [destItems]);
  const svcGroups = useMemo(() => groupByPrefix(svcItems, "homepage_service_"), [svcItems]);

  const handleChange = (
    setList: React.Dispatch<React.SetStateAction<WCItem[]>>,
    key: string,
    field: "content" | "title",
    value: string,
  ) => {
    setList((prev) => prev.map((it) => (it.key === key ? { ...it, [field]: value } : it)));
  };

  const handleSave = async (
    list: WCItem[],
    setList: React.Dispatch<React.SetStateAction<WCItem[]>>,
    key: string,
    page: string,
    section: string,
  ) => {
    try {
      const item = list.find((i) => i.key === key);
      if (!item) return;
      setSavingKey(key);
      await saveContent({ key, title: item.title, content: item.content ?? "", page, section });
    } catch (e) {
      console.error(e);
      alert("Failed to save. See console for details.");
    } finally {
      setSavingKey(null);
    }
  };

  const renderEditor = (list: WCItem[], setList: React.Dispatch<React.SetStateAction<WCItem[]>>, groupTitle: string, groups: Record<string, WCItem[]>, page: string, section: string) => (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{groupTitle}</h2>
        <Link href="/admin/website" className="text-blue-600 hover:underline text-sm">Back to Website Content</Link>
      </div>
      <div className="space-y-6">
        {Object.keys(groups).length === 0 && (
          <div className="text-gray-500">No items found.</div>
        )}
        {Object.entries(groups).map(([entityId, items]) => (
          <div key={entityId} className="border rounded-lg p-4">
            <div className="font-semibold mb-2">{groupTitle.includes("Destination") ? `Destination: ${entityId}` : `Service: ${entityId}`}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {items
                .sort((a, b) => a.key.localeCompare(b.key))
                .map((it) => (
                  <div key={it.key} className="flex flex-col">
                    <label className="text-xs text-gray-600 mb-1">{it.key}</label>
                    {it.key.endsWith("_image") ? (
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        value={it.content ?? ""}
                        onChange={(e) => handleChange(setList, it.key, "content", e.target.value)}
                        placeholder="/images/... or https://..."
                      />
                    ) : (
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        value={it.content ?? ""}
                        onChange={(e) => handleChange(setList, it.key, "content", e.target.value)}
                      />
                    )}
                    <div className="flex justify-end mt-1">
                      <button
                        onClick={() => handleSave(list, setList, it.key, page, section)}
                        className="text-white bg-blue-600 hover:bg-blue-700 rounded px-3 py-1 text-xs"
                        disabled={savingKey === it.key}
                      >
                        {savingKey === it.key ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Homepage Microcopy Manager</h1>
      {loading ? (
        <div>Loading content...</div>
      ) : (
        <>
          {renderEditor(destItems, setDestItems, "Destinations Microcopy", destGroups, "homepage", "destinations")}
          {renderEditor(svcItems, setSvcItems, "Services Microcopy", svcGroups, "homepage", "services")}
        </>
      )}
    </div>
  );
}
