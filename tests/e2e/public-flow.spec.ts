import { test, expect } from "@playwright/test";

test("fluxo público home -> catálogo -> sacola", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Navegação Rápida" })).toBeVisible();

  await page.getByRole("link", { name: "Catálogo" }).first().click();
  await expect(page.getByRole("heading", { name: "Catálogo" })).toBeVisible();

  const addButton = page.getByRole("button", { name: "Adicionar à Sacola" }).first();
  await addButton.click();

  await page.getByRole("link", { name: "Sacola 1" }).click();
  await expect(page.getByRole("heading", { name: "Sua Sacola" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Finalizar no WhatsApp/i })).toBeEnabled();
});
