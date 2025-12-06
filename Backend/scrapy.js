import { ApifyClient } from 'apify-client';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize the ApifyClient with your API token
const client = new ApifyClient({
    token: process.env.API_TOKEN,
});

// ✅ YOUR FULL, VALID COOKIES (Pasted automatically)
const cookies = [
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

const input = {
    // Convert the cookie object array to a JSON string for Apify
    "shopeeCookies": JSON.stringify(cookies),
    "searchKeywords": ["iphone 15 casing"],
    "country": "MY",
    "scrapeMode": "fast",
    "maxProductsPerSearch": 50,
    "sortBy": "sales",
    
    // ✅ PROXY: This is critical for Shopee Malaysia
    "proxyConfiguration": {
        "useApifyProxy": true,
        "apifyProxyGroups": ["RESIDENTIAL"],
        "apifyProxyCountry": "MY" 
    }
};

(async () => {
    console.log("Starting Shopee Scraper...");
    try {
        const run = await client.actor("fatihtahta/shopee-scraper").call(input);
        console.log(`Scraper finished. Run ID: ${run.id}`);
        
        const { items } = await client.dataset(run.defaultDatasetId).listItems();
        
        if (items.length > 0) {
            // Generate a unique filename using timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `shopee_full_data_${timestamp}.json`;
            
            // Save the data to file
            fs.writeFileSync(fileName, JSON.stringify(items, null, 2));
            console.log(`\n✅ Success! Saved ${items.length} products to ${fileName}`);
        } else {
            console.log("❌ No items found. If this persists, your residential proxy quota might be empty.");
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();