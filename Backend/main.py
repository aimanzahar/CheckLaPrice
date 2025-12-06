import asyncio
import logging
import re
from typing import List, Optional

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
        # Format the search query and construct URL
        formatted_query = format_search_query(request.query)
        url = f"https://www.lazada.com.my/catalog/?q={formatted_query}"
        
        logger.info(f"Scraping URL: {url}")
        
        # Initialize scraper and perform scraping
        scraper = Scraper(url)
        raw_results = await scraper.scrape()
        
        logger.info(f"Scraped {len(raw_results)} raw products")
        
        # Transform results to match response schema
        products = transform_scraped_data(raw_results)
        
        logger.info(f"Transformed {len(products)} valid products")
        
        if not products:
            return ScrapeResponse(
                success=True,
                data=[],
                error=None
            )
        
        return ScrapeResponse(
            success=True,
            data=products,
            error=None
        )
        
    except Exception as e:
        logger.error(f"Scraping failed: {str(e)}")
        return ScrapeResponse(
            success=False,
            data=None,
            error=f"Scraping failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)