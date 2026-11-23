import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RiverFloat from "./RiverFloat";

const REMOTE = {
  id: "33333333-3333-4333-8333-333333333333",
  createdAt: "2026-11-24T10:00:00Z",
  design: { base: "lotus", flowers: ["rose"], color: "pink", decor: [], candle: "single" },
  wish: "ขอให้ทุกคนมีความสุข",
  blessings: 2,
};

interface Call {
  url: string;
  method: string;
  body?: unknown;
}

let calls: Call[];
let postReply: () => Response;

function setupFetch() {
  calls = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      calls.push({ url, method, body: init?.body ? JSON.parse(String(init.body)) : undefined });
      if (url === "/api/kratong" && method === "GET") {
        return new Response(JSON.stringify({ enabled: true, items: [REMOTE] }));
      }
      if (url === "/api/kratong" && method === "POST") return postReply();
      return new Response("{}", { status: 200 });
    }),
  );
}

beforeEach(() => {
  window.localStorage.clear();
  postReply = () =>
    new Response(JSON.stringify({ item: { ...REMOTE, id: "44444444-4444-4444-8444-444444444444", wish: "ใบของฉัน" } }), { status: 201 });
  setupFetch();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function typeWish(text: string) {
  await userEvent.type(screen.getByLabelText("คำอธิษฐาน"), text);
}

describe("RiverFloat แม่น้ำกลาง", () => {
  it("ต่อแม่น้ำกลางได้: แสดงกระทงของคนอื่น คำเตือนความเป็นส่วนตัว และไม่ใช้ข้อความสมมติ", async () => {
    render(<RiverFloat />);
    expect(await screen.findByRole("button", { name: /ขอให้ทุกคนมีความสุข/ })).toBeTruthy();
    expect(screen.getByText(/แสดงให้ผู้เล่นคนอื่นเห็นในแม่น้ำกลาง/)).toBeTruthy();
    expect(screen.queryByText(/ข้อความสมมติ/)).toBeNull();
  });

  it("ลอยกระทง: ส่งดีไซน์กับ anonId ขึ้นเซิร์ฟเวอร์ แล้วเห็นกระทงของเรา", async () => {
    render(<RiverFloat />);
    await screen.findByRole("button", { name: /ขอให้ทุกคนมีความสุข/ });
    await typeWish("ใบของฉัน");
    await userEvent.click(screen.getByRole("button", { name: "ลอยกระทง" }));
    expect(await screen.findByLabelText(/กระทง คำอธิษฐาน: ใบของฉัน/)).toBeTruthy();
    const post = calls.find((c) => c.method === "POST" && c.url === "/api/kratong");
    expect(post?.body).toMatchObject({ wish: "ใบของฉัน", design: { base: "leaf" } });
    expect((post?.body as { anonId: string }).anonId).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("เซิร์ฟเวอร์ปฏิเสธคำหยาบ: แสดงข้อความ ไม่ลอย ไม่ให้แต้ม", async () => {
    postReply = () => new Response(JSON.stringify({ error: "profanity" }), { status: 422 });
    render(<RiverFloat />);
    await screen.findByRole("button", { name: /ขอให้ทุกคนมีความสุข/ });
    await typeWish("ข้อความไม่ดี");
    await userEvent.click(screen.getByRole("button", { name: "ลอยกระทง" }));
    expect((await screen.findByRole("alert")).textContent).toMatch(/ไม่เหมาะสม/);
    expect(screen.queryByLabelText(/กระทง คำอธิษฐาน: ข้อความไม่ดี/)).toBeNull();
    expect(screen.getByText("Lv.0")).toBeTruthy();
  });

  it("ต่อเซิร์ฟเวอร์ล้มเหลว: แจ้งเตือนแต่ยังลอยในเครื่องได้", async () => {
    postReply = () => {
      throw new Error("network");
    };
    render(<RiverFloat />);
    await screen.findByRole("button", { name: /ขอให้ทุกคนมีความสุข/ });
    await typeWish("ลอยในเครื่อง");
    await userEvent.click(screen.getByRole("button", { name: "ลอยกระทง" }));
    expect(await screen.findByLabelText(/กระทง คำอธิษฐาน: ลอยในเครื่อง/)).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toMatch(/เฉพาะในเครื่อง/);
  });

  it("อนุโมทนากระทงของคนอื่นแล้วเรียก API", async () => {
    render(<RiverFloat />);
    fireEvent.click(await screen.findByRole("button", { name: /ขอให้ทุกคนมีความสุข/ }));
    await waitFor(() =>
      expect(calls.some((c) => c.url === `/api/kratong/${REMOTE.id}/bless`)).toBe(true),
    );
  });

  it("รายงาน: ซ่อนกระทงทันทีและเรียก API", async () => {
    render(<RiverFloat />);
    const other = await screen.findByRole("button", { name: /ขอให้ทุกคนมีความสุข/ });
    fireEvent.focus(other);
    fireEvent.click(await screen.findByRole("button", { name: /รายงานกระทง/ }));
    await waitFor(() =>
      expect(calls.some((c) => c.url === `/api/kratong/${REMOTE.id}/report`)).toBe(true),
    );
    expect(screen.queryByRole("button", { name: /ขอให้ทุกคนมีความสุข/ })).toBeNull();
  });
});
