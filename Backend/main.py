import asyncio
import logging
import json
from utils.scraper_lazada import Scraper

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def save_results_to_json(results, filename="results.json"):
    """
    Saves the scraped results to a JSON file.
    """
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)

def get_search_query_from_terminal():
    """
    Prompts the user to input a search query in the terminal.
    """
    return input("Enter your search query: ")

def format_search_query(query: str) -> str:
    """
    Formats the search query to ensure it is lowercase and spaces are replaced with '%20'.
    """
    return query.strip().lower().replace(" ", "%20")

async def main():
    query = get_search_query_from_terminal()  # Get search query from terminal
    formatted_query = format_search_query(query)  # Format the query
    url = f"https://www.lazada.com.my/catalog/?q={formatted_query}"
    scraper = Scraper(url)
    results = await scraper.scrape()
    save_results_to_json(results)  # Save results to JSON file

if __name__ == "__main__":
    asyncio.run(main())