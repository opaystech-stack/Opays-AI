import asyncio
from playwright.async_api import async_playwright
import os

async def html_to_pdf():
    html_path = os.path.abspath(r"C:\LAPOSTE\Projets\OPAYS TECH\docs\plan-dashboards.html")
    pdf_path = os.path.abspath(r"C:\LAPOSTE\Projets\OPAYS TECH\docs\PLAN-OPAYS-DASHBOARDS.pdf")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Load the HTML file
        await page.goto(f"file:///{html_path.replace(os.sep, '/')}")
        
        # Generate PDF with landscape A4
        await page.pdf(
            path=pdf_path,
            format="A4",
            landscape=True,
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"}
        )
        
        await browser.close()
    
    size = os.path.getsize(pdf_path)
    print(f"PDF generated: {pdf_path}")
    print(f"Size: {size:,} bytes ({size/1024:.1f} KB)")

asyncio.run(html_to_pdf())
