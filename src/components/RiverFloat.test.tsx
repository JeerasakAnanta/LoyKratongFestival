import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RiverFloat from "./RiverFloat";

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe("RiverFloat", () => {
  it("ปุ่มลอยกระทงปิดอยู่จนกว่าจะพิมพ์คำอธิษฐาน", async () => {
    render(<RiverFloat />);
    const btn = screen.getByRole("button", { name: "ลอยกระทง" });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
    await userEvent.type(screen.getByLabelText("คำอธิษฐาน"), "ขอให้สบายดี");
    expect((btn as HTMLButtonElement).disabled).toBe(false);
  });

  it("ลอยกระทงแล้วเห็นกระทงในแม่น้ำ ล้างช่องข้อความ และมีปุ่มบันทึกภาพ", async () => {
    render(<RiverFloat />);
    const box = screen.getByLabelText("คำอธิษฐาน") as HTMLTextAreaElement;
    await userEvent.type(box, "ขอให้สบายดี");
    await userEvent.click(screen.getByRole("button", { name: "ลอยกระทง" }));
    expect(screen.getByLabelText(/คำอธิษฐาน: ขอให้สบายดี/)).toBeTruthy();
    expect(box.value).toBe("");
    expect(screen.getByRole("button", { name: /บันทึกคำอธิษฐานล่าสุด/ })).toBeTruthy();
  });

  it("รีเฟรชแล้วกระทงที่ยังลอยอยู่กลับมา", async () => {
    const first = render(<RiverFloat />);
    await userEvent.type(screen.getByLabelText("คำอธิษฐาน"), "ขอให้สบายดี");
    await userEvent.click(screen.getByRole("button", { name: "ลอยกระทง" }));
    first.unmount();

    render(<RiverFloat />);
    expect(await screen.findByLabelText(/คำอธิษฐาน: ขอให้สบายดี/)).toBeTruthy();
  });

  it("ไม่โหลดกระทงที่ลอยพ้นไปแล้ว", () => {
    window.localStorage.setItem(
      "kratong-river-v2",
      JSON.stringify([
        { id: 1, design: { base: "leaf", flowers: [], color: "gold", decor: [], candle: "single" }, wish: "หมดเวลา", top: 40, rest: 10, duration: 20, startedAt: Date.now() - 60_000 },
      ]),
    );
    render(<RiverFloat />);
    expect(screen.queryByLabelText(/หมดเวลา/)).toBeNull();
  });

  it("เริ่มที่ Lv.0 ชิ้นส่วนขั้นสูงล็อกอยู่", () => {
    render(<RiverFloat />);
    expect(screen.getByText("Lv.0")).toBeTruthy();
    const star = screen.getByRole("button", { name: /ดาวทอง/ }) as HTMLButtonElement;
    expect(star.disabled).toBe(true);
  });

  it("ลอยกระทงครั้งแรกได้แต้ม + ภารกิจ + ตรา และขึ้น Lv.1", async () => {
    render(<RiverFloat />);
    await userEvent.type(screen.getByLabelText("คำอธิษฐาน"), "ขอให้สบายดี");
    await userEvent.click(screen.getByRole("button", { name: "ลอยกระทง" }));
    expect(screen.getByText("Lv.1")).toBeTruthy();
    expect(screen.getAllByText(/ภารกิจสำเร็จ: ลอยกระทง 1 ใบ/).length).toBeGreaterThan(0);
    // ความคืบหน้าถูกเก็บไว้
    expect(window.localStorage.getItem("kratong-progress-v1")).toContain('"merit":30');
  });
});

describe("RiverFloat เกม", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("ขยะลอยมาและกดเก็บได้แต้ม", () => {
    render(<RiverFloat />);
    act(() => void vi.advanceTimersByTime(4600));
    const litter = screen.getByRole("button", { name: /ขยะในแม่น้ำ/ });
    fireEvent.click(litter);
    expect(screen.queryByRole("button", { name: /ขยะในแม่น้ำ/ })).toBeNull();
    expect(screen.getAllByText(/\+3 แต้มบุญ/).length).toBeGreaterThan(0);
  });

  it("กระทงของผู้อื่นอนุโมทนาได้ครั้งเดียว", () => {
    render(<RiverFloat />);
    act(() => void vi.advanceTimersByTime(1600));
    const other = screen.getByRole("button", { name: /กระทงของผู้อื่น.*กดเพื่ออนุโมทนา/ });
    fireEvent.click(other);
    expect(screen.getByRole("button", { name: /อนุโมทนาแล้ว/ })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: /อนุโมทนาแล้ว/ }));
    expect(window.localStorage.getItem("kratong-progress-v1")).toContain('"blessed":1');
  });
});
