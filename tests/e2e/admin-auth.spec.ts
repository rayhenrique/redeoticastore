import { test, expect } from "@playwright/test";

test("página de login admin disponível", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Login Administrativo" })).toBeVisible();
});
