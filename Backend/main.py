import asyncio
import json
import logging
import os
import re
from typing import List, Optional

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from utils.scraper_lazada import Scraper

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables for external services (Apify token, cookies, etc.)
load_dotenv()

# Default Shopee cookies fallback (mirrors CLI helper) to satisfy Apify actor input.
DEFAULT_SHOPEE_COOKIES = [
    {"name": "_ga", "value": "GA1.1.132238722.1741167614", "domain": ".shopee.com.my", "path": "/"},
    {"name": "_ga_NEYMG30JL4", "value": "GS1.1.1743420689.2.0.1743420689.60.0.0", "domain": ".shopee.com.my", "path": "/"},
    {"name": "csrftoken", "value": "BDmu5UNFTfPyNGwOyK5K2UdfQ5uAfJ5g", "domain": ".shopee.com.my", "path": "/"},
    {"name": "language", "value": "en", "domain": ".shopee.com.my", "path": "/"},
    {"name": "REC_T_ID", "value": "b58b2b3e-f9a5-11ef-85f9-de0c26825f81", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_CDS_CHAT", "value": "b9be6c59-273e-43c3-a40c-ec565258fe90", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_CLIENTID", "value": "Iuw5QiAt3RaQ7aXahmyyquxuzsmwumyv", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_EC", "value": ".UjNtZlVibDR3MWNJMmtXTsYcPjkbjEiHgeDJ4E26pE/9CofHQXpqKLeflW8X7MG2987iKyzjm3qgU+vlpZvgpw8JitVITH0S9tN6VPQkges9Tlw54ITiBdvXbQJzEKQaQ1zqk/fPGTKQq4yyyuQ/NzCPSS+px0Zf/RO8/iuDhPuvfLDSrHmB8riHvuRCpggsLRNQOD/TDLpVFU2PejCgR1Uhcy/ChoGDL/jwf2NvKS2/TsmceYVKxB2uUaUkiYrVmJuZeSULbiODChRNVVJ49A==", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_F", "value": "Iuw5QiAt3RaQ7aXaBCuaQ3mlDm5GaqpT", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_R_T_ID", "value": "B2aIB+FEMeLRzSjy+Ehx870vIlbuPt3/hPOinL8E2UR9QDbQef3H3VF+5B7z47WUctqJrbSuwc5GkE7X3d29MmwiWXW9tMs8zo7kVZo7E3dlffDMe2IKwhN9ncr2wV6wCaIyTb+w2KsQ4+G3Klk1xOPCDDFigyb+HeVljx3BZko=", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_R_T_IV", "value": "dkgzaXZCeXZSNzhwaEplcQ==", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_SI", "value": "zXwdaQAAAABkVFlhZTdLSUaU/AIAAAAAR0d4Z29Ma1E=", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_ST", "value": ".M2hwQmE2aDU5bzZBU3ZjSpEg+/v4UBJTQfV58UQMmNyWi2zXK72dzP5lOZFB0nxCeNdjrEEHyQSRYvTctYLHK/BNvKX3ViHq1A954McVz51AoEW0diOnprv6Fu61pATc+ClmtDep6/X5pe7HwA/+/eDPIO0rdImLINIlk29geLvwbt2ojMmSn6JieYh27ACp51VYJS0n2+UZ06YOXk+mIB0BkFHZRkN4yGltDgXQc0UwHGPwGPh9pnss98KIPaLj5qS40+5XhPK5O8IikeD4GA==", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_T_ID", "value": "B2aIB+FEMeLRzSjy+Ehx870vIlbuPt3/hPOinL8E2UR9QDbQef3H3VF+5B7z47WUctqJrbSuwc5GkE7X3d29MmwiWXW9tMs8zo7kVZo7E3dlffDMe2IKwhN9ncr2wV6wCaIyTb+w2KsQ4+G3Klk1xOPCDDFigyb+HeVljx3BZko=", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_T_IV", "value": "dkgzaXZCeXZSNzhwaEplcQ==", "domain": ".shopee.com.my", "path": "/"},
    {"name": "SPC_U", "value": "744239905", "domain": ".shopee.com.my", "path": "/"},
    {"name": "_QPWSDCXHZQA", "value": "1c760703-f9c7-40af-ec9f-77ff8853a6c6", "domain": "shopee.com.my", "path": "/"},
    {"name": "_sapid", "value": "5e91ee7b9a8a261c5bcc22795e0e97f642e1a8cdd095f22885f4c004", "domain": "shopee.com.my", "path": "/"},
    {"name": "ds", "value": "0685d1dd139182d883d2cc4f765a1a56", "domain": "shopee.com.my", "path": "/"},
    {"name": "REC7iLP4Q", "value": "9bf7276b-4627-4c9c-8a39-a79146f9b822", "domain": "shopee.com.my", "path": "/"},
    {"name": "shopee_webUnique_ccd", "value": "tzzQf13TsJcl341HdkB7%2FQ%3D%3D%7C0VIFUkP2nRM02oWAR9jGusAAIZL6f2Z3b4uihmNEiLkWRPms0hjNB4SlkEz0h%2Bv625Ga7xtiKQE%3D%7CalQD0eCZApsxCl6T%7C08%7C3", "domain": "shopee.com.my", "path": "/"},
    {"name": "SPC_IA", "value": "1", "domain": "shopee.com.my", "path": "/"},
    {"name": "SPC_SEC_SI", "value": "v1-bmExWnE5WVZHcW1uSjduWCJUMBeW9zrFOpD84FzfSsXxg2QqTaYYizEVRl4efk+B6cqQmpYIkbaoUH7uxrq6D1L1pMFVEHVc22TkW4ttphk=", "domain": "shopee.com.my", "path": "/"},
]

# Initialize FastAPI app
app = FastAPI(
    title="CheckLaPrice Scraper API",
    description="API for scraping product data from Lazada",
    version="1.0.0"
)

# Add CORS middleware for cross-origin requests from React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class ScrapeRequest(BaseModel):
    query: str  # Search query like "minecraft" or "laptop"
    type: str = "search"  # For now, only "search" is supported


class ProductData(BaseModel):
    name: str
    price: float  # Parsed from "RM 99.99" format
    originalPrice: Optional[float] = None
    image: str
    store: str = "Lazada"
    url: str
    discount: Optional[str] = None
    ratings: Optional[str] = None
    reviews: Optional[str] = None


class ScrapeResponse(BaseModel):
    success: bool
    data: Optional[List[ProductData]] = None
    error: Optional[str] = None


def parse_price(price_str: str) -> float:
    """
    Parse price string to float.
    
    Input: "RM 99.99" or "RM99.99" or "99.99" or "RM 1,299.00"
    Output: 99.99 or 1299.00
    
    Returns 0.0 if parsing fails.
    """
    if not price_str or price_str == "N/A":
        return 0.0
    
    try:
        # Remove currency symbols, spaces, and commas
        cleaned = re.sub(r'[RM\s,]', '', price_str, flags=re.IGNORECASE)
        # Extract the numeric value (including decimal)
        match = re.search(r'[\d.]+', cleaned)
        if match:
            return float(match.group())
        return 0.0
    except (ValueError, AttributeError):
        logger.warning(f"Failed to parse price: {price_str}")
        return 0.0


def format_search_query(query: str) -> str:
    """
    Formats the search query to ensure it is lowercase and spaces are URL-encoded.
    """
    return query.strip().lower().replace(" ", "%20")


def transform_scraped_data(raw_data: List[dict]) -> List[ProductData]:
    """
    Transform raw scraped data to ProductData models.
    """
    products = []
    
    for item in raw_data:
        try:
            # Parse the price
            price = parse_price(item.get('price', 'N/A'))
            
            # Skip products with no valid price
            if price == 0.0:
                continue
            
            # Create ProductData instance
            product = ProductData(
                name=item.get('name', 'Unknown Product'),
                price=price,
                originalPrice=None,  # Could be extracted from discount info if available
                image=item.get('image_url', ''),
                store="Lazada",
                url=item.get('link', ''),
                discount=item.get('discount') if item.get('discount') != 'N/A' else None,
                ratings=item.get('ratings') if item.get('ratings') != 'N/A' else None,
                reviews=item.get('reviews') if item.get('reviews') != 'N/A' else None
            )
            products.append(product)
        except Exception as e:
            logger.warning(f"Failed to transform product: {e}")
            continue
    
    return products


async def fetch_lazada_products(query: str) -> List[ProductData]:
    """
    Fetch Lazada products using the existing scraper.
    """
    formatted_query = format_search_query(query)
    url = f"https://www.lazada.com.my/catalog/?q={formatted_query}"

    logger.info(f"Scraping Lazada URL: {url}")
    scraper = Scraper(url)
    raw_results = await scraper.scrape()
    logger.info(f"Lazada scraper returned {len(raw_results)} raw items")
    return transform_scraped_data(raw_results)


def _parse_shopee_price(price_value) -> float:
    """
    Shopee API returns prices in cents. Convert to RM float.
    """
    try:
        numeric = float(price_value)
        return round(numeric / 100, 2)
    except (TypeError, ValueError):
        logger.warning(f"Invalid Shopee price: {price_value}")
        return 0.0


def transform_shopee_data(raw_items: List[dict]) -> List[ProductData]:
    """
    Normalize Shopee dataset items to ProductData models.
    """
    products: List[ProductData] = []

    for item in raw_items:
        price = _parse_shopee_price(item.get("price"))
        if price <= 0:
            continue

        discount_raw = item.get("discountPercentage")
        discount = f"{discount_raw}%" if discount_raw not in (None, "N/A") else None

        product = ProductData(
            name=item.get("name", "Unknown Product"),
            price=price,
            originalPrice=None,
            image=item.get("imageUrl", ""),
            store="Shopee",
            url=item.get("url", ""),
            discount=discount,
            ratings=str(item.get("rating")) if item.get("rating") not in (None, "N/A") else None,
            reviews=str(item.get("salesCount")) if item.get("salesCount") not in (None, "N/A") else None,
        )
        products.append(product)

    return products


def fetch_shopee_products(query: str, max_products: int = 50) -> List[ProductData]:
    """
    Fetch Shopee products via Apify actor and normalize them.

    Uses environment variables:
    - API_TOKEN: Apify token
    - SHOPEE_COOKIES: Optional JSON string of cookies to pass through
    """
    token = os.getenv("API_TOKEN")
    if not token:
        raise HTTPException(status_code=500, detail="API_TOKEN is not configured for Shopee scraping.")

    shopee_cookies_env = os.getenv("SHOPEE_COOKIES")
    try:
        if shopee_cookies_env:
            parsed = json.loads(shopee_cookies_env)
            shopee_cookies = json.dumps(parsed)
            logger.info("Using SHOPEE_COOKIES from environment.")
        else:
            shopee_cookies = json.dumps(DEFAULT_SHOPEE_COOKIES)
            logger.info("Using default Shopee cookies fallback.")
    except json.JSONDecodeError:
        logger.warning("SHOPEE_COOKIES is not valid JSON; falling back to defaults.")
        shopee_cookies = json.dumps(DEFAULT_SHOPEE_COOKIES)

    input_payload = {
        "searchKeywords": [query],
        "country": "MY",
        "scrapeMode": "fast",
        "maxProductsPerSearch": max_products,
        "sortBy": "relevancy",
        "proxyConfiguration": {
            "useApifyProxy": True,
            "apifyProxyGroups": ["RESIDENTIAL"],
            "apifyProxyCountry": "MY"
        }
    }

    input_payload["shopeeCookies"] = shopee_cookies

    url = "https://api.apify.com/v2/acts/fatihtahta~shopee-scraper/run-sync-get-dataset-items"
    try:
        logger.info("Starting Shopee scrape via Apify actor...")
        response = requests.post(url, params={"token": token}, json=input_payload, timeout=120)
        response.raise_for_status()
        items = response.json()
        if not isinstance(items, list):
            logger.error(f"Unexpected Shopee response format: {items}")
            return []
        logger.info(f"Shopee scrape returned {len(items)} items")
        return transform_shopee_data(items)
    except requests.RequestException as e:
        logger.error(f"Shopee scrape failed: {e}")
        raise HTTPException(status_code=502, detail=f"Shopee scrape failed: {e}")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "message": "CheckLaPrice Scraper API is running"}


@app.post("/api/scrape/lazada", response_model=ScrapeResponse)
async def scrape_lazada(request: ScrapeRequest):
    """
    Scrape product data from Lazada based on search query.
    
    Args:
        request: ScrapeRequest containing the search query
        
    Returns:
        ScrapeResponse with scraped product data or error message
    """
    logger.info(f"Received scrape request: query='{request.query}', type='{request.type}'")
    
    # Validate request type
    if request.type != "search":
        return ScrapeResponse(
            success=False,
            error=f"Unsupported scrape type: {request.type}. Only 'search' is currently supported."
        )
    
    # Validate query
    if not request.query or not request.query.strip():
        return ScrapeResponse(
            success=False,
            error="Search query cannot be empty"
        )
    
    try:
        products = await fetch_lazada_products(request.query)
        logger.info(f"Transformed {len(products)} valid products from Lazada")

        if not products:
            return ScrapeResponse(success=True, data=[], error=None)

        return ScrapeResponse(success=True, data=products, error=None)
    except Exception as e:
        logger.error(f"Scraping failed: {str(e)}")
        return ScrapeResponse(
            success=False,
            data=None,
            error=f"Scraping failed: {str(e)}"
        )


@app.post("/api/scrape/all", response_model=ScrapeResponse)
async def scrape_all(request: ScrapeRequest):
    """
    Scrape product data from both Lazada and Shopee, merge, and sort by price (ascending).
    """
    logger.info(f"Received combined scrape request: query='{request.query}', type='{request.type}'")

    if request.type != "search":
        return ScrapeResponse(
            success=False,
            error=f"Unsupported scrape type: {request.type}. Only 'search' is currently supported."
        )

    if not request.query or not request.query.strip():
        return ScrapeResponse(
            success=False,
            error="Search query cannot be empty"
        )

    try:
        lazada_task = asyncio.create_task(fetch_lazada_products(request.query))
        shopee_task = asyncio.create_task(asyncio.to_thread(fetch_shopee_products, request.query))

        lazada_result, shopee_result = await asyncio.gather(lazada_task, shopee_task, return_exceptions=True)

        products: List[ProductData] = []

        if isinstance(lazada_result, Exception):
            logger.error(f"Lazada scrape failed: {lazada_result}")
        else:
            products.extend(lazada_result)

        if isinstance(shopee_result, Exception):
            logger.error(f"Shopee scrape failed: {shopee_result}")
        else:
            products.extend(shopee_result)

        if not products:
            return ScrapeResponse(success=True, data=[], error=None)

        # Sort by price ascending
        products_sorted = sorted(products, key=lambda item: item.price)

        return ScrapeResponse(success=True, data=products_sorted, error=None)
    except Exception as e:
        logger.error(f"Combined scraping failed: {str(e)}")
        return ScrapeResponse(
            success=False,
            data=None,
            error=f"Combined scraping failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)