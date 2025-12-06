from playwright.async_api import async_playwright
import asyncio
from bs4 import BeautifulSoup
import logging
from typing import List, Dict

class Scraper:
    def __init__(self, url: str):
        self.url = url
        self.results: List[Dict] = []
        self._image_stats = {
            'valid': 0,
            'invalid': 0
        }

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
        Simulates human-like scrolling on the page and waits for lazy-loaded images.
        """
        logging.info("Starting human-like scrolling...")
        
        # Scroll down the page multiple times to trigger lazy loading
        for i in range(5):
            await page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
            await page.wait_for_timeout(2000)
        
        # Scroll back to top to ensure all images in view are loaded
        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(1500)
        
        # Scroll down again slowly to trigger any remaining lazy loads
        for i in range(3):
            await page.evaluate("window.scrollBy(0, window.innerHeight)")
            await page.wait_for_timeout(1200)
        
        logging.info("Scrolling complete. Waiting for images to load...")
        
        # Wait for product images to load (src changes from data: to http)
        try:
            await page.wait_for_function("""
                () => {
                    const imgs = document.querySelectorAll('img[type="product"]');
                    if (imgs.length === 0) return true;  // No product images found, continue
                    const loadedCount = Array.from(imgs).filter(img =>
                        img.src && img.src.startsWith('http')
                    ).length;
                    return loadedCount >= (imgs.length * 0.8);  // At least 80% loaded
                }
            """, timeout=20000)
            logging.info("Images loaded successfully (80%+ threshold reached).")
        except Exception as e:
            logging.warning(f"Image loading wait timed out, proceeding anyway: {e}")
            
            # Try alternative approach: scroll each product into view
            try:
                await page.evaluate("""
                    () => {
                        const imgs = document.querySelectorAll('img[type="product"]');
                        imgs.forEach((img, index) => {
                            setTimeout(() => {
                                img.scrollIntoView({ behavior: 'instant', block: 'center' });
                            }, index * 100);
                        });
                    }
                """)
                await page.wait_for_timeout(5000)
                logging.info("Alternative scroll-into-view approach completed.")
            except Exception as e2:
                logging.warning(f"Alternative image loading approach failed: {e2}")

    def _parse_html(self, html: str) -> List[Dict]:
        """
        Parses the HTML content and extracts product data, including image URLs.
        """
        soup = BeautifulSoup(html, "html.parser")
        products = soup.find_all('div', class_='Bm3ON')
        logging.info(f"Found {len(products)} products. Extracting data...")

        # Reset counters for each parse
        self._image_stats = {
            'valid': 0,
            'invalid': 0
        }

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

        # Log image extraction summary
        total_products = self._image_stats['valid'] + self._image_stats['invalid']
        logging.info(f"Image extraction summary: {self._image_stats['valid']}/{total_products} valid URLs, {self._image_stats['invalid']}/{total_products} invalid/missing")
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
        Extracts the image URL from an element, handling lazy-loaded images.
        Checks multiple attributes in priority order to find valid image URLs.
        """
        tag = element.select_one(selector)
        
        if not tag:
            self._image_stats['invalid'] += 1
            return "N/A"
        
        # Priority order for lazy-loaded images
        attrs_to_check = ['data-src', 'data-lazy-src', 'data-original', 'src']
        
        for attr in attrs_to_check:
            url = tag.get(attr, '')
            if url and self._is_valid_image_url(url):
                self._image_stats['valid'] += 1
                return url
        
        self._image_stats['invalid'] += 1
        return "N/A"

    def _is_valid_image_url(self, url: str) -> bool:
        """
        Validates if a URL is a valid image URL.
        Filters out data URIs, empty strings, and placeholder images.
        """
        if not url:
            return False
        
        # Skip data URIs (base64 encoded images or placeholders)
        if url.startswith('data:'):
            return False
        
        # Skip empty or N/A values
        if url in ('', 'N/A', 'null', 'undefined'):
            return False
        
        # Skip common placeholder patterns
        placeholder_patterns = [
            'placeholder',
            'loading',
            'blank.gif',
            'empty.png',
            '1x1.gif',
            'pixel.gif'
        ]
        url_lower = url.lower()
        for pattern in placeholder_patterns:
            if pattern in url_lower:
                return False
        
        return True