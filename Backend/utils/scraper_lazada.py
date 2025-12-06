from playwright.async_api import async_playwright
import asyncio
from bs4 import BeautifulSoup
import logging
from typing import List, Dict

class Scraper:
    def __init__(self, url: str):
        self.url = url
        self.results: List[Dict] = []

    async def scrape(self) -> List[Dict]:
        """
        Scrapes the given URL using Playwright and BeautifulSoup.
        """
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            try:
                logging.info(f"Navigating to: {self.url}")
                await page.goto(self.url, wait_until="domcontentloaded", timeout=45000)

                # Simulate human-like scrolling
                await self._simulate_scrolling(page)

                # Extract and parse HTML content
                page_source = await page.content()
                self.results = self._parse_html(page_source)

            except Exception as e:
                logging.error(f"An error occurred: {e}")

            finally:
                await browser.close()

        return self.results

    async def _simulate_scrolling(self, page):
        """
        Simulates human-like scrolling on the page.
        """
        logging.info("Starting human-like scrolling...")
        for _ in range(5):
            await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
            await page.wait_for_timeout(2000)
        logging.info("Scrolling complete.")

    def _parse_html(self, html: str) -> List[Dict]:
        """
        Parses the HTML content and extracts product data, including image URLs.
        """
        soup = BeautifulSoup(html, "html.parser")
        products = soup.find_all('div', class_='Bm3ON')
        logging.info(f"Found {len(products)} products. Extracting data...")

        results = []
        for product in products:
            item = {}

            # Extract product details
            item['name'] = self._get_text(product, '.RfADt a', attr="title")
            item['link'] = self._get_link(product, '.RfADt a')
            item['price'] = self._get_text(product, '.ooOxS')
            item['sales'] = self._get_text(product, '._1cEkb')
            item['location'] = self._get_text(product, '.oa6ri')
            item['ratings'] = self._get_text(product, '._1w3ZZ')
            item['reviews'] = self._get_text(product, '._2j8fN')
            item['discount'] = self._get_text(product, '._3LRxk')

            # Extract image URL
            item['image_url'] = self._get_image_url(product, 'img')

            results.append(item)

        logging.info("Data extraction complete.")
        return results

    def _get_text(self, element, selector: str, attr: str = None) -> str:
        """
        Extracts text or attribute value from an element.
        """
        tag = element.select_one(selector)
        if tag:
            return tag.get(attr) if attr else tag.text.strip()
        return "N/A"

    def _get_link(self, element, selector: str) -> str:
        """
        Extracts and formats a link from an element.
        """
        tag = element.select_one(selector)
        if tag:
            link = tag.get('href')
            return f"https:{link}" if link and link.startswith("//") else link
        return "N/A"

    def _get_image_url(self, element, selector: str) -> str:
        """
        Extracts the image URL from an element and logs the HTML for debugging.
        """
        tag = element.select_one(selector)
        if tag:
            logging.debug(f"Extracted image tag HTML: {tag}")
            return tag.get('src', 'N/A')
        logging.warning(f"Image tag not found with selector: {selector}")
        return "N/A"