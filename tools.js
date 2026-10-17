/* Tool directory data. Entry: [name, vendor URL, category, price, verdict].
   Affiliate links are NOT set here: add the approved URL for a tool in affiliates.json
   (key = lowercase name, spaces -> hyphens) and run `node scripts/build.mjs`. */
const TOOLS=[
["Wave","https://www.waveapps.com","invoicing","Starter $0; Pro $19/mo or $190/yr","Best free all-rounder for solo freelancers in US/Canada."],
["Invoice Ninja","https://invoiceninja.com","invoicing","Free forever (5 clients); Pro $14/mo","Open-source, generous free tier, a bit clunky UI."],
["Zoho Invoice","https://www.zoho.com/invoice/","invoicing","Free plan: 2 users, 3 projects, 500 invoices/yr (Zoho branding)","Genuinely free and polished; best if you like Zoho's ecosystem."],
["Bonsai","https://www.hellobonsai.com","invoicing","Basic $15/mo ($9/mo billed annually)","Contracts+proposals+invoices in one; pricey if you only need invoicing."],
["HoneyBook","https://www.honeybook.com","invoicing","Paid plans, free trial","Great for client-heavy creatives; overkill for devs."],
["FreshBooks","https://www.freshbooks.com","invoicing","Lite list $23/mo (promos often shown), free trial","Friendliest invoicing+time tracking; costs add up with clients."],
["QuickBooks Online","https://quickbooks.intuit.com","bookkeeping","Simple Start $38, Essentials $85, Plus $140, Advanced $340/mo (list prices; promos common)","Accountant default; more power than most freelancers need."],
["Xero","https://www.xero.com","bookkeeping","From $27/mo (shown), free trial","Clean double-entry books; great with an accountant."],
["Zoho Books","https://www.zoho.com/books/","bookkeeping","Free plan; paid tiers, free trial","Strong free option if under revenue limit."],
["Bench","https://www.bench.co","bookkeeping","Grow from $199/mo; Core from $399/mo; Core+Tax from $599/mo; no free trial","Done-for-you bookkeeping, now run under Employer.com after a Dec 2024 acquisition; pricey for most freelancers."],
["Pilot","https://pilot.com","bookkeeping","From ~$250/mo (shown)","Premium done-for-you books; for high-earning freelancers/LLCs."],
["Manager.io","https://www.manager.io","bookkeeping","See vendor site for current pricing","No-nonsense accounting software you can run yourself; dated feel."],
["Keeper","https://www.keepertax.com","tax","14-day free trial; Bookkeeping $20/mo, tax plans from $199/yr (Oct 14, 2026)","Auto-finds write-offs from card transactions; great for 1099 earners."],
["TurboTax Self-Employed","https://turbotax.intuit.com","tax","Paid per filing","Mainstream DIY filing; upsells are aggressive."],
["FreeTaxUSA","https://www.freetaxusa.com","tax","Federal $0; state filing fee (see site)","Cheapest legit DIY filing incl. Schedule C."],
["IRS Direct Pay","https://www.irs.gov/payments/direct-pay","tax","Free","Free way to pay quarterly estimates; no account needed."],
["Found","https://found.com","tax","Free plan; Plus $35/mo or $315/yr","Banking with built-in tax set-aside for self-employed."],
["Stripe","https://stripe.com","payments","Pay-as-you-go per transaction","Developer gold standard for online payments."],
["PayPal","https://www.paypal.com","payments","Per-transaction fees","Clients already have it; fees and holds are the trade-off."],
["Wise","https://wise.com","payments","Per-transfer fees; free account","Best for international clients and multi-currency."],
["Payoneer","https://www.payoneer.com","payments","Per-transaction fees","Standard for marketplace payouts abroad."],
["Square","https://squareup.com","payments","Per-transaction fees","Good for in-person + simple invoices."],
["Mercury","https://mercury.com","banking","Free core plan; paid tiers from $35/mo","Slick business banking for LLCs; startup-oriented."],
["Relay","https://relayfi.com","banking","Starter $0; Grow $30/mo; Scale $90/mo (promo)","Multiple accounts make profit-first budgeting easy."],
["Novo","https://www.novo.co","banking","Free business checking","Simple free business checking for freelancers."],
["Lili","https://lili.co","banking","Free basic; paid tiers","Freelancer-focused banking with tax buckets."],
["YNAB","https://www.ynab.com","runway","$14.99/mo or $109/yr, free trial","Best method for irregular income budgeting."],
["Monarch Money","https://www.monarchmoney.com","runway","$14.99/mo or $99.99/yr, free trial","Polished all-account dashboard and cash-flow view."],
["Float","https://floatapp.com","runway","Paid plans, free trial","Cash-flow forecasting atop Xero/QBO; small-business oriented."],
["Pulse","https://pulseapp.com","runway","From $29/mo, free trial","Simple cash-flow forecasting for small operators."]
];
const slug=n=>n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function cardHtml([n,u,c,p,v]){const a=(typeof AFF!=='undefined'&&AFF[slug(n)])||'';return `<a class="card" href="${a||u}" target="_blank" rel="${a?'sponsored nofollow noopener':'noopener'}"><span class="tag">${c}</span>${a?'<span class="tag aff">affiliate</span>':''}<h3>${n}</h3><p class="price">${p}</p><p>${v}</p></a>`}
