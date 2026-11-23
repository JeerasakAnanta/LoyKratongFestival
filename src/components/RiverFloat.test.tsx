import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
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
      "kratong-river-v1",
      JSON.stringify([
        { id: 1, emoji: "🪷", wish: "หมดเวลา", top: 40, rest: 10, duration: 20, startedAt: Date.now() - 60_000 },
      ]),
    );
    render(<RiverFloat />);
    expect(screen.queryByLabelText(/หมดเวลา/)).toBeNull();
  });
});
