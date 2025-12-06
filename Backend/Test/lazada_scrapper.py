from playwright.async_api import async_playwright
import asyncio
from bs4 import BeautifulSoup
import time
import random

class LazadaScraper:
    def __init__(self, url):
        self.url = url
        self.results = []

    async def scrape(self):
        """
        Scrapes Lazada using Playwright for robust and stealthy scraping.
        """

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            try:
                print(f"Navigating to: {self.url}")
                await page.goto(self.url, wait_until="domcontentloaded", timeout=45000)

                # Human Interaction Simulation (The "Wait and Scroll")
                print("Page loaded. Starting human-like scroll...")
                for _ in range(5):
                    await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
                    await page.wait_for_timeout(2000)

                print("Scrolling complete. Extracting data...")

                # Extract HTML
                page_source = await page.content()
                soup = BeautifulSoup(page_source, "html.parser")

                # Parsing
                products = soup.find_all('div', class_='Bm3ON')
                print(f"Found {len(products)} products. Extracting data...\n")

                for product in products:
                    item = {}

                    # --- NAME & LINK ---
                    title_container = product.select_one('.RfADt a')
                    if title_container:
                        item['name'] = title_container.get('title')
                        link = title_container.get('href')
                        item['link'] = f"https:{link}" if link.startswith("//") else link
                    else:
                        item['name'] = "N/A"
                        item['link'] = "N/A"

                    # --- PRICE ---
                    price_tag = product.select_one('.ooOxS')
                    item['price'] = price_tag.text if price_tag else "N/A"

                    # --- SALES ---
                    sales_tag = product.select_one('._1cEkb')
                    item['sales'] = sales_tag.text if sales_tag else "N/A"

                    # --- LOCATION ---
                    loc_tag = product.select_one('.oa6ri')
                    item['location'] = loc_tag.text if loc_tag else "N/A"

                    # --- RATINGS ---
                    ratings_tag = product.select_one('._1w3ZZ')
                    item['ratings'] = ratings_tag.text if ratings_tag else "N/A"

                    # --- REVIEWS ---
                    reviews_tag = product.select_one('._2j8fN')
                    item['reviews'] = reviews_tag.text if reviews_tag else "N/A"

                    # --- DISCOUNTS ---
                    discount_tag = product.select_one('._3LRxk')
                    item['discount'] = discount_tag.text if discount_tag else "N/A"

                    self.results.append(item)

                print("Data extraction complete.")

            except Exception as e:
                print(f"An error occurred: {e}")

            finally:
                await browser.close()

        return self.results

# Example usage
if __name__ == "__main__":
    url = "https://www.lazada.com.my/tag/rtx4090/?q=rtx4090"
    scraper = LazadaScraper(url)
    results = asyncio.run(scraper.scrape())

    # Print as a neat table
    print("{:<30} {:<10} {:<10} {:<10} {:<10} {:<10} {:<10}".format(
        "Product Name", "Price", "Sales", "Location", "Ratings", "Reviews", "Discount"
    ))
    print("-" * 90)
    for item in results:
        print("{:<30} {:<10} {:<10} {:<10} {:<10} {:<10} {:<10}".format(
            item['name'][:30], item['price'], item['sales'], item['location'],
            item['ratings'], item['reviews'], item['discount']
        ))