import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const token = process.env.API_TOKEN;
if (!token) {
    console.error("API_TOKEN is missing. Please set it in your .env file.");
    process.exit(1);
}

const keyword = process.argv[2] || process.env.SHOPEE_KEYWORD;
if (!keyword) {
    console.error("Usage: node scrapy.js \"<search keyword>\" [maxProducts]");
    process.exit(1);
}

const maxProductsArg = Number(process.argv[3]);
const maxProducts = Number.isFinite(maxProductsArg) ? maxProductsArg : 50;

// Initialize the ApifyClient with your API token
const client = new ApifyClient({ token });

// Default cookies remain as fallback; override with env SHOPEE_COOKIES if provided
const DEFAULT_COOKIES = [
    {
        "name": "_ga",
        "value": "GA1.1.132238722.1741167614",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "_ga_NEYMG30JL4",
        "value": "GS1.1.1743420689.2.0.1743420689.60.0.0",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "csrftoken",
        "value": "BDmu5UNFTfPyNGwOyK5K2UdfQ5uAfJ5g",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "language",
        "value": "en",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "REC_T_ID",
        "value": "b58b2b3e-f9a5-11ef-85f9-de0c26825f81",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_CDS_CHAT",
        "value": "b9be6c59-273e-43c3-a40c-ec565258fe90",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_CLIENTID",
        "value": "Iuw5QiAt3RaQ7aXahmyyquxuzsmwumyv",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_EC",
        "value": ".UjNtZlVibDR3MWNJMmtXTsYcPjkbjEiHgeDJ4E26pE/9CofHQXpqKLeflW8X7MG2987iKyzjm3qgU+vlpZvgpw8JitVITH0S9tN6VPQkges9Tlw54ITiBdvXbQJzEKQaQ1zqk/fPGTKQq4yyyuQ/NzCPSS+px0Zf/RO8/iuDhPuvfLDSrHmB8riHvuRCpggsLRNQOD/TDLpVFU2PejCgR1Uhcy/ChoGDL/jwf2NvKS2/TsmceYVKxB2uUaUkiYrVmJuZeSULbiODChRNVVJ49A==",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_F",
        "value": "Iuw5QiAt3RaQ7aXaBCuaQ3mlDm5GaqpT",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_R_T_ID",
        "value": "B2aIB+FEMeLRzSjy+Ehx870vIlbuPt3/hPOinL8E2UR9QDbQef3H3VF+5B7z47WUctqJrbSuwc5GkE7X3d29MmwiWXW9tMs8zo7kVZo7E3dlffDMe2IKwhN9ncr2wV6wCaIyTb+w2KsQ4+G3Klk1xOPCDDFigyb+HeVljx3BZko=",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_R_T_IV",
        "value": "dkgzaXZCeXZSNzhwaEplcQ==",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_SI",
        "value": "zXwdaQAAAABkVFlhZTdLSUaU/AIAAAAAR0d4Z29Ma1E=",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_ST",
        "value": ".M2hwQmE2aDU5bzZBU3ZjSpEg+/v4UBJTQfV58UQMmNyWi2zXK72dzP5lOZFB0nxCeNdjrEEHyQSRYvTctYLHK/BNvKX3ViHq1A954McVz51AoEW0diOnprv6Fu61pATc+ClmtDep6/X5pe7HwA/+/eDPIO0rdImLINIlk29geLvwbt2ojMmSn6JieYh27ACp51VYJS0n2+UZ06YOXk+mIB0BkFHZRkN4yGltDgXQc0UwHGPwGPh9pnss98KIPaLj5qS40+5XhPK5O8IikeD4GA==",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_T_ID",
        "value": "B2aIB+FEMeLRzSjy+Ehx870vIlbuPt3/hPOinL8E2UR9QDbQef3H3VF+5B7z47WUctqJrbSuwc5GkE7X3d29MmwiWXW9tMs8zo7kVZo7E3dlffDMe2IKwhN9ncr2wV6wCaIyTb+w2KsQ4+G3Klk1xOPCDDFigyb+HeVljx3BZko=",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_T_IV",
        "value": "dkgzaXZCeXZSNzhwaEplcQ==",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_U",
        "value": "744239905",
        "domain": ".shopee.com.my",
        "path": "/"
    },
    {
        "name": "_QPWSDCXHZQA",
        "value": "1c760703-f9c7-40af-ec9f-77ff8853a6c6",
        "domain": "shopee.com.my",
        "path": "/"
    },
    {
        "name": "_sapid",
        "value": "5e91ee7b9a8a261c5bcc22795e0e97f642e1a8cdd095f22885f4c004",
        "domain": "shopee.com.my",
        "path": "/"
    },
    {
        "name": "ds",
        "value": "0685d1dd139182d883d2cc4f765a1a56",
        "domain": "shopee.com.my",
        "path": "/"
    },
    {
        "name": "REC7iLP4Q",
        "value": "9bf7276b-4627-4c9c-8a39-a79146f9b822",
        "domain": "shopee.com.my",
        "path": "/"
    },
    {
        "name": "shopee_webUnique_ccd",
        "value": "tzzQf13TsJcl341HdkB7%2FQ%3D%3D%7C0VIFUkP2nRM02oWAR9jGusAAIZL6f2Z3b4uihmNEiLkWRPms0hjNB4SlkEz0h%2Bv625Ga7xtiKQE%3D%7CalQD0eCZApsxCl6T%7C08%7C3",
        "domain": "shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_IA",
        "value": "1",
        "domain": "shopee.com.my",
        "path": "/"
    },
    {
        "name": "SPC_SEC_SI",
        "value": "v1-bmExWnE5WVZHcW1uSjduWCJUMBeW9zrFOpD84FzfSsXxg2QqTaYYizEVRl4efk+B6cqQmpYIkbaoUH7uxrq6D1L1pMFVEHVc22TkW4ttphk=",
        "domain": "shopee.com.my",
        "path": "/"
    }
];

const envCookies = process.env.SHOPEE_COOKIES;
let cookies = DEFAULT_COOKIES;
if (envCookies) {
    try {
        cookies = JSON.parse(envCookies);
    } catch (err) {
        console.warn("SHOPEE_COOKIES is not valid JSON. Using default cookies.");
    }
}

const input = {
    shopeeCookies: JSON.stringify(cookies),
    searchKeywords: [keyword],
    country: process.env.SHOPEE_COUNTRY || "MY",
    scrapeMode: process.env.SHOPEE_SCRAPE_MODE || "fast",
    maxProductsPerSearch: maxProducts,
    sortBy: process.env.SHOPEE_SORT_BY || "relevancy",
    proxyConfiguration: {
        useApifyProxy: true,
        apifyProxyGroups: ["RESIDENTIAL"],
        apifyProxyCountry: process.env.SHOPEE_PROXY_COUNTRY || "MY"
    }
};

(async () => {
    console.log(`Starting Shopee Scraper for "${keyword}"...`);
    try {
        const run = await client.actor("fatihtahta/shopee-scraper").call(input);
        console.log(`Scraper finished. Run ID: ${run.id}`);
        
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        
        if (items.length > 0) {
            const normalized = items.map(item => ({
                name: item.name,
                price: item.price ? (item.price / 100) : 0,
                image: item.imageUrl,
                store: "Shopee",
                url: item.url,
                discount: item.discountPercentage ? `${item.discountPercentage}%` : null,
                ratings: item.rating ?? null,
                reviews: item.salesCount ?? null,
            }));

            // Generate a unique filename using timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `shopee_full_data_${timestamp}.json`;
            
            // Save the raw data and normalized data to file for debugging
            fs.writeFileSync(fileName, JSON.stringify(items, null, 2));
            fs.writeFileSync(`shopee_normalized_${timestamp}.json`, JSON.stringify(normalized, null, 2));
            console.log(`✅ Saved ${items.length} products to ${fileName} and normalized output.`);
        } else {
            console.log("❌ No items found. If this persists, your residential proxy quota might be empty.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();