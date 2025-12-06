import asyncio
import logging
import json
import time
from utils.scraper_lazada import Scraper

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class ResultSaver:
    """
    A utility class to handle saving results to JSON files.
    """
    def __init__(self, filename_prefix="results"):
        self.filename_prefix = filename_prefix

    def save(self, results, query):
        """
        Saves the results to a unique JSON file in a thread-safe manner.
        Relevant products containing the query in their name are placed at the top.
        """
        import threading
        lock = threading.Lock()

        # Generate a unique filename using the query and timestamp
        timestamp = time.strftime("%Y%m%d-%H%M%S")
        filename = f"{self.filename_prefix}_{query.replace('%20', '_')}_{timestamp}.json"

        # Sort results by relevance (products containing the query in their name at the top)
        query_lower = query.lower()
        sorted_results = sorted(
            results,
            key=lambda item: query_lower in item['name'].lower(),
            reverse=True
        )

        with lock:
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(sorted_results, f, ensure_ascii=False, indent=4)

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

    # Use ResultSaver to save results with relevance sorting
    saver = ResultSaver()
    saver.save(results, query)

if __name__ == "__main__":
    asyncio.run(main())